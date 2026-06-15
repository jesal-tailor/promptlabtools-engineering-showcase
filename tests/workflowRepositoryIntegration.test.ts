import { describe, expect, it } from "vitest";
import { createRepositoryContext } from "../src/lib/repositories/repositoryFactory";
import { runCampaignPublishPackageWorkflow } from "../src/lib/workflows/workflowRunner";

describe("workflow repository integration", () => {
  it("persists a deterministic runtime workflow through the repository context", () => {
    const repositories = createRepositoryContext();
    const result = runCampaignPublishPackageWorkflow({
      campaignGoal: "Persist a public-safe showcase workflow for repository tests",
      repositories,
    });
    const storedRun = repositories.workflowRunRepository.getById(result.runId);
    const storedEvents = repositories.workflowRunRepository.listEvents(result.runId);
    const storedToolCalls = repositories.toolCallRepository.listByRunId(result.runId);
    const storedEvaluation = repositories.evaluationRepository.getById(`repo_eval_${result.runId}`);

    expect(storedRun.ok).toBe(true);
    if (storedRun.ok) {
      expect(storedRun.record.source).toBe("runtime");
      expect(storedRun.record.status).toBe("runtime_completed");
    }
    expect(storedEvents.map((event) => event.sequence)).toEqual(
      result.traceEvents.map((event) => event.sequence),
    );
    expect(storedToolCalls).toHaveLength(result.toolCalls.length);
    expect(storedEvaluation.ok).toBe(true);
  });
});
