import { describe, expect, it } from "vitest";
import {
  applyApprovalDecision,
  transitionApprovalStatus,
} from "../src/lib/approvals/approvalStateMachine";
import type { ApprovalDecision } from "../src/lib/approvals/approvalTypes";

const basePayload = {
  approvalId: "approval_test",
  runId: "run_test",
  stepId: "approval_gate",
  reviewerComment: "Mock reviewer decision.",
  decidedBy: "mock_reviewer@example.test",
  decidedAt: "2026-06-15T10:30:00.000Z",
};

describe("approval state machine", () => {
  it.each([
    ["approved", "approved", "continue_workflow"],
    ["rejected", "rejected", "stop_workflow"],
    ["needs_changes", "needs_changes", "return_to_drafting"],
  ] as const)(
    "transitions pending_review to %s",
    (decision: ApprovalDecision, expectedStatus, expectedAction) => {
      const result = applyApprovalDecision({
        payload: {
          ...basePayload,
          decision,
        },
      });

      expect(result.previousStatus).toBe("pending_review");
      expect(result.newStatus).toBe(expectedStatus);
      expect(result.workflowAction).toBe(expectedAction);
      expect(result.auditEvent.decision).toBe(decision);
    },
  );

  it("rejects invalid transitions", () => {
    expect(() => transitionApprovalStatus("approved", "rejected")).toThrow(
      "Invalid approval transition",
    );
  });
});
