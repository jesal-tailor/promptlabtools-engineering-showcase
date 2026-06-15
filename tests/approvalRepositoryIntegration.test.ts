import { describe, expect, it } from "vitest";
import { createMockApprovalDecisionPayload } from "../src/lib/approvals/approvalAuditLog";
import { applyApprovalDecision } from "../src/lib/approvals/approvalStateMachine";
import { createRepositoryContext } from "../src/lib/repositories/repositoryFactory";

describe("approval repository integration", () => {
  it("persists approval decisions and audit events through the repository context", () => {
    const repositories = createRepositoryContext();
    const approvalId = "approval_repo_integration";
    const payload = {
      ...createMockApprovalDecisionPayload({
        decision: "approved",
        reviewerComment: "Approved for deterministic repository integration test.",
      }),
      approvalId,
    };
    const result = applyApprovalDecision({ payload, repositories });
    const storedApproval = repositories.approvalRepository.getById(approvalId);
    const auditEvents = repositories.auditEventRepository
      .list()
      .filter((event) => event.subjectId === approvalId);

    expect(result.workflowAction).toBe("continue_workflow");
    expect(storedApproval.ok).toBe(true);
    if (storedApproval.ok) {
      expect(storedApproval.record.status).toBe("approved");
    }
    expect(auditEvents).toHaveLength(1);
    expect(auditEvents[0]?.type).toBe("approval_decision_recorded");
  });
});
