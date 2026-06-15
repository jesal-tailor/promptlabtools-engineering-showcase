import { describe, expect, it } from "vitest";
import { runCampaignPublishPackageWorkflow } from "../src/lib/workflows/workflowRunner";

describe("campaign publish package workflow runner", () => {
  const result = runCampaignPublishPackageWorkflow({
    campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
  });

  it("executes all expected workflow steps in order", () => {
    expect(result.orderedSteps.map((step) => step.id)).toEqual([
      "planner_agent",
      "drafting_agent",
      "qa_agent",
      "approval_gate",
      "publish_package",
    ]);
    expect(result.status).toBe("completed");
  });

  it("requires approval before the final publish package can be used", () => {
    const approvalIndex = result.orderedSteps.findIndex((step) => step.id === "approval_gate");
    const publishIndex = result.orderedSteps.findIndex((step) => step.id === "publish_package");

    expect(approvalIndex).toBeGreaterThan(-1);
    expect(publishIndex).toBeGreaterThan(approvalIndex);
    expect(result.approvalRequirement.required).toBe(true);
    expect(result.approvalRequirement.status).toBe("required_before_publish");
    expect(result.finalPublishPackage.approvalRequiredBeforeUse).toBe(true);
    expect(result.finalPublishPackage.mockDestination).toBe("mock://publish-package-preview");
  });

  it("generates trace events in the expected order", () => {
    expect(result.traceEvents.map((event) => event.type)).toEqual([
      "workflow_started",
      "agent_started",
      "agent_completed",
      "agent_started",
      "agent_completed",
      "agent_started",
      "agent_completed",
      "evaluation_completed",
      "agent_started",
      "approval_required",
      "agent_completed",
      "workflow_completed",
    ]);
    expect(result.traceEvents.map((event) => event.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("returns deterministic agent outputs and evaluation summary", () => {
    expect(result.agentOutputs.planner.keyMessages[0]).toContain(result.campaignGoal);
    expect(result.agentOutputs.qa.score).toBe(91);
    expect(result.evaluationSummary.passed).toBe(true);
    expect(result.evaluationSummary.cost.totalTokens).toBeGreaterThan(0);
  });
});
