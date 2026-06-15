import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/workflows/start/route";

function createJsonRequest(body: unknown) {
  return new Request("http://localhost/api/workflows/start", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
}

describe("POST /api/workflows/start", () => {
  it("returns 400 for invalid workflow input", async () => {
    const response = await POST(createJsonRequest({ campaignGoal: "short" }));
    const body = (await response.json()) as { ok: boolean; errors: string[] };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toContain("campaignGoal must describe the mock campaign goal in at least 12 characters.");
  });

  it("returns a deterministic workflow result for valid input", async () => {
    const response = await POST(
      createJsonRequest({
        campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
      }),
    );
    const body = (await response.json()) as {
      ok: boolean;
      workflow: {
        runId: string;
        orderedSteps: Array<{ id: string }>;
        approvalRequirement: { required: boolean };
        traceEvents: Array<{ type: string }>;
      };
      repository: {
        adapterType: string;
        persistedWorkflowRun: boolean;
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.workflow.runId).toBe(
      "mock_run_campaign_publish_package_launch-a-public-safe-ai-workflow-showcase-for-cv",
    );
    expect(body.workflow.orderedSteps.map((step) => step.id)).toEqual([
      "planner_agent",
      "drafting_agent",
      "qa_agent",
      "approval_gate",
      "publish_package",
    ]);
    expect(body.workflow.approvalRequirement.required).toBe(true);
    expect(body.workflow.traceEvents[0].type).toBe("workflow_started");
    expect(body.repository.adapterType).toBe("memory");
    expect(body.repository.persistedWorkflowRun).toBe(true);
  });
});
