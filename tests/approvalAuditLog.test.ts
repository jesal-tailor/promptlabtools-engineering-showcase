import { describe, expect, it } from "vitest";
import { createApprovalAuditEvent } from "../src/lib/approvals/approvalAuditLog";

describe("approval audit log", () => {
  it("creates a deterministic public-safe audit event", () => {
    const auditEvent = createApprovalAuditEvent({
      payload: {
        approvalId: "approval_test",
        runId: "run_test",
        stepId: "approval_gate",
        decision: "approved",
        reviewerComment: "Looks safe for the mock preview.",
        decidedBy: "mock_reviewer@example.test",
        decidedAt: "2026-06-15T10:30:00.000Z",
      },
      previousStatus: "pending_review",
      newStatus: "approved",
      workflowAction: "continue_workflow",
    });

    expect(auditEvent.id).toBe("audit_approval_test_approved");
    expect(auditEvent.type).toBe("approval_decision_recorded");
    expect(auditEvent.publicSafetyNote).toContain("Mock audit event only");
  });
});
