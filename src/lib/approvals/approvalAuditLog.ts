import type {
  ApprovalAuditEvent,
  ApprovalDecisionPayload,
  ApprovalStatus,
  ApprovalWorkflowAction,
  MockApprovalSimulation,
} from "@/lib/approvals/approvalTypes";
import { getActionRiskLevel } from "@/lib/approvals/approvalPolicy";

export const sampleApprovalId = "gate_launch-a-public-safe-ai-workflow-showcase-for-cv_publish";
export const sampleApprovalRunId = "mock_run_campaign_publish_package_launch-a-public-safe-ai-workflow-showcase-for-cv";

export const mockApprovalSimulation: MockApprovalSimulation = {
  approvalId: sampleApprovalId,
  runId: sampleApprovalRunId,
  stepId: "approval_gate",
  actionName: "publish_public_content",
  status: "pending_review",
  riskLevel: getActionRiskLevel("publish_public_content"),
  reviewerRole: "Human operator",
  reviewerComment:
    "Mock reviewer should confirm public-safe labelling before approving the preview publish package.",
};

export function createApprovalAuditEvent({
  payload,
  previousStatus,
  newStatus,
  workflowAction,
}: {
  payload: ApprovalDecisionPayload;
  previousStatus: ApprovalStatus;
  newStatus: ApprovalStatus;
  workflowAction: ApprovalWorkflowAction;
}): ApprovalAuditEvent {
  return {
    id: `audit_${payload.approvalId}_${payload.decision}`,
    type: "approval_decision_recorded",
    approvalId: payload.approvalId,
    runId: payload.runId,
    stepId: payload.stepId,
    previousStatus,
    newStatus,
    decision: payload.decision,
    workflowAction,
    reviewerComment: payload.reviewerComment,
    decidedBy: payload.decidedBy,
    createdAt: payload.decidedAt,
    publicSafetyNote:
      "Mock audit event only. No production identity system, database, webhook, or external approval tool was called.",
  };
}

export function createMockApprovalDecisionPayload({
  decision,
  reviewerComment,
  decidedBy = "mock_reviewer@example.test",
  decidedAt = "2026-06-15T10:30:00.000Z",
}: Pick<ApprovalDecisionPayload, "decision" | "reviewerComment"> &
  Partial<Pick<ApprovalDecisionPayload, "decidedBy" | "decidedAt">>): ApprovalDecisionPayload {
  return {
    approvalId: sampleApprovalId,
    runId: sampleApprovalRunId,
    stepId: "approval_gate",
    decision,
    reviewerComment,
    decidedBy,
    decidedAt,
  };
}
