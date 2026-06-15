import { createApprovalAuditEvent } from "@/lib/approvals/approvalAuditLog";
import type {
  ApprovalDecision,
  ApprovalDecisionPayload,
  ApprovalDecisionResult,
  ApprovalStatus,
  ApprovalWorkflowAction,
} from "@/lib/approvals/approvalTypes";
import type { RepositoryContext } from "@/lib/repositories/repositoryTypes";

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
  repositories,
}: {
  currentStatus?: ApprovalStatus;
  payload: ApprovalDecisionPayload;
  repositories?: RepositoryContext;
}): ApprovalDecisionResult {
  const newStatus = transitionApprovalStatus(currentStatus, payload.decision);
  const workflowAction = getWorkflowActionForApprovalDecision(payload.decision);
  const auditEvent = createApprovalAuditEvent({
    payload,
    previousStatus: currentStatus,
    newStatus,
    workflowAction,
  });

  const updateResult = repositories?.approvalRepository.update(payload.approvalId, {
    status: newStatus,
    updatedAt: payload.decidedAt,
    reason: payload.reviewerComment,
  });

  if (repositories && updateResult && !updateResult.ok) {
    repositories.approvalRepository.create({
      id: payload.approvalId,
      runId: payload.runId,
      stepId: payload.stepId,
      status: newStatus,
      riskLevel: "high",
      reviewerRole: "Human operator",
      reason: payload.reviewerComment,
      createdAt: payload.decidedAt,
      updatedAt: payload.decidedAt,
      publicSafetyNote:
        "Backed by public-safe in-memory repository adapter. Approval record was created because no existing mock record was found.",
    });
  }

  repositories?.auditEventRepository.appendEvent({
    id: `repo_${auditEvent.id}`,
    domain: "approval",
    type: auditEvent.type,
    subjectId: payload.approvalId,
    runId: payload.runId,
    message: payload.reviewerComment,
    createdAt: payload.decidedAt,
    metadata: {
      decision: payload.decision,
      newStatus,
      previousStatus: currentStatus,
      workflowAction,
    },
  });

  return {
    previousStatus: currentStatus,
    newStatus,
    workflowAction,
    auditEvent,
  };
}
