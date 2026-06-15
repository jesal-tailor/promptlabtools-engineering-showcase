import { createApprovalAuditEvent } from "@/lib/approvals/approvalAuditLog";
import type {
  ApprovalDecision,
  ApprovalDecisionPayload,
  ApprovalDecisionResult,
  ApprovalStatus,
  ApprovalWorkflowAction,
} from "@/lib/approvals/approvalTypes";

const transitions: Record<ApprovalStatus, Partial<Record<ApprovalDecision, ApprovalStatus>>> = {
  pending_review: {
    approved: "approved",
    rejected: "rejected",
    needs_changes: "needs_changes",
  },
  approved: {},
  rejected: {},
  needs_changes: {},
  completed: {},
  archived: {},
};

const workflowActions: Record<ApprovalDecision, ApprovalWorkflowAction> = {
  approved: "continue_workflow",
  rejected: "stop_workflow",
  needs_changes: "return_to_drafting",
};

export function transitionApprovalStatus(
  currentStatus: ApprovalStatus,
  decision: ApprovalDecision,
): ApprovalStatus {
  const nextStatus = transitions[currentStatus][decision];

  if (!nextStatus) {
    throw new Error(`Invalid approval transition from ${currentStatus} using ${decision}.`);
  }

  return nextStatus;
}

export function getWorkflowActionForApprovalDecision(decision: ApprovalDecision): ApprovalWorkflowAction {
  return workflowActions[decision];
}

export function applyApprovalDecision({
  currentStatus = "pending_review",
  payload,
}: {
  currentStatus?: ApprovalStatus;
  payload: ApprovalDecisionPayload;
}): ApprovalDecisionResult {
  const newStatus = transitionApprovalStatus(currentStatus, payload.decision);
  const workflowAction = getWorkflowActionForApprovalDecision(payload.decision);
  const auditEvent = createApprovalAuditEvent({
    payload,
    previousStatus: currentStatus,
    newStatus,
    workflowAction,
  });

  return {
    previousStatus: currentStatus,
    newStatus,
    workflowAction,
    auditEvent,
  };
}
