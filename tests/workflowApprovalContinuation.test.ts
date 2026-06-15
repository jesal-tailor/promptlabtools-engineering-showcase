import { describe, expect, it } from "vitest";
import { runCampaignWorkflowWithApprovalDecision } from "../src/lib/workflows/workflowRunner";

const workflowInput = {
  campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
  decidedBy: "mock_reviewer@example.test",
};

describe("workflow approval continuation", () => {
  it("continues and generates the final package when approved", () => {
    const result = runCampaignWorkflowWithApprovalDecision({
      ...workflowInput,
      approvalDecision: "approved",
      reviewerComment: "Approved for the mock preview.",
    });

    expect(result.workflowAction).toBe("continue_workflow");
    expect(result.status).toBe("completed");
    expect(result.finalPublishPackage?.id).toBeTruthy();
    expect(result.traceEvents.map((event) => event.type)).toContain("approval_approved");
    expect(result.traceEvents.at(-1)?.type).toBe("workflow_completed");
  });

  it("stops and does not generate a package when rejected", () => {
    const result = runCampaignWorkflowWithApprovalDecision({
      ...workflowInput,
      approvalDecision: "rejected",
      reviewerComment: "Rejected so the mock workflow stops.",
    });

    expect(result.workflowAction).toBe("stop_workflow");
    expect(result.status).toBe("stopped");
    expect(result.finalPublishPackage).toBeNull();
    expect(result.traceEvents.map((event) => event.type)).toContain("approval_rejected");
    expect(result.traceEvents.at(-1)?.type).toBe("workflow_stopped");
  });

  it("returns to drafting with revision instructions when changes are requested", () => {
    const result = runCampaignWorkflowWithApprovalDecision({
      ...workflowInput,
      approvalDecision: "needs_changes",
      reviewerComment: "Needs clearer public-safe labelling.",
    });

    expect(result.workflowAction).toBe("return_to_drafting");
    expect(result.status).toBe("returned_to_drafting");
    expect(result.finalPublishPackage).toBeNull();
    expect(result.revisionInstruction).toContain("Revise the mock campaign package");
    expect(result.traceEvents.map((event) => event.type)).toContain("approval_needs_changes");
    expect(result.traceEvents.at(-1)?.type).toBe("workflow_returned_to_drafting");
  });
});
