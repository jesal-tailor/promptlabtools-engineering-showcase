import { describe, expect, it } from "vitest";
import { agents } from "../src/lib/mockData/agents";
import { approvals } from "../src/lib/mockData/approvals";
import { evaluations } from "../src/lib/mockData/evaluations";
import { prompts } from "../src/lib/mockData/prompts";
import { tools } from "../src/lib/mockData/tools";
import { workflowRuns } from "../src/lib/mockData/workflowRuns";

describe("mock control-plane data", () => {
  const agentIds = new Set(agents.map((agent) => agent.id));
  const approvalIds = new Set(approvals.map((approval) => approval.id));
  const evaluationIds = new Set(evaluations.map((evaluation) => evaluation.id));
  const promptIds = new Set(prompts.map((prompt) => prompt.id));
  const toolIds = new Set(tools.map((tool) => tool.id));
  const workflowRunIds = new Set(workflowRuns.map((run) => run.id));

  it("keeps workflow run references internally consistent", () => {
    for (const run of workflowRuns) {
      expect(run.agentIds.every((agentId) => agentIds.has(agentId))).toBe(true);
      expect(run.promptIds.every((promptId) => promptIds.has(promptId))).toBe(true);
      expect(run.toolIds.every((toolId) => toolIds.has(toolId))).toBe(true);
      expect(run.approvalIds.every((approvalId) => approvalIds.has(approvalId))).toBe(true);
      expect(run.evaluationIds.every((evaluationId) => evaluationIds.has(evaluationId))).toBe(true);

      for (const step of run.trace) {
        expect(agentIds.has(step.agentId)).toBe(true);
        expect(step.toolIds.every((toolId) => toolIds.has(toolId))).toBe(true);

        if (step.approvalId) {
          expect(approvalIds.has(step.approvalId)).toBe(true);
        }
      }
    }
  });

  it("keeps registry ownership and permissions consistent", () => {
    expect(prompts.every((prompt) => agentIds.has(prompt.ownerAgentId))).toBe(true);
    expect(tools.every((tool) => tool.allowedAgentIds.every((agentId) => agentIds.has(agentId)))).toBe(true);
    expect(approvals.every((approval) => workflowRunIds.has(approval.runId))).toBe(true);
    expect(approvals.every((approval) => agentIds.has(approval.requesterAgentId))).toBe(true);
    expect(evaluations.every((evaluation) => workflowRunIds.has(evaluation.runId))).toBe(true);
    expect(evaluations.every((evaluation) => promptIds.has(evaluation.promptId))).toBe(true);
  });

  it("labels every integration as mocked and keeps scores within range", () => {
    expect(tools.every((tool) => tool.mockedIntegration)).toBe(true);
    expect(tools.every((tool) => tool.safeDestination.startsWith("mock://"))).toBe(true);
    expect(evaluations.every((evaluation) => evaluation.score >= 0)).toBe(true);
    expect(evaluations.every((evaluation) => evaluation.score <= evaluation.maxScore)).toBe(true);
  });
});
