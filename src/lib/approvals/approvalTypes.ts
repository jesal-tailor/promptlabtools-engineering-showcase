export type ApprovalStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_changes"
  | "completed"
  | "archived";

export type ApprovalDecision = "approved" | "rejected" | "needs_changes";

export type ApprovalWorkflowAction =
  | "continue_workflow"
  | "stop_workflow"
  | "return_to_drafting"
  | "no_action";

export type ApprovalRiskLevel = "low" | "medium" | "high";

export type ApprovalGovernedAction =
  | "publish_public_content"
  | "send_outbound_email"
  | "spend_money"
  | "change_pricing"
  | "use_personal_profile"
  | "modify_live_website_copy"
  | "draft_content"
  | "analyse_metrics"
  | "create_mock_publish_package"
  | "score_content_quality"
  | "generate_mock_utm_url";

export type ApprovalDecisionPayload = {
  approvalId: string;
  runId: string;
  stepId: string;
  decision: ApprovalDecision;
  reviewerComment: string;
  decidedBy: string;
  decidedAt: string;
};

export type ApprovalAuditEvent = {
  id: string;
  type: "approval_decision_recorded";
  approvalId: string;
  runId: string;
  stepId: string;
  previousStatus: ApprovalStatus;
  newStatus: ApprovalStatus;
  decision: ApprovalDecision;
  workflowAction: ApprovalWorkflowAction;
  reviewerComment: string;
  decidedBy: string;
  createdAt: string;
  publicSafetyNote: string;
};

export type ApprovalDecisionResult = {
  previousStatus: ApprovalStatus;
  newStatus: ApprovalStatus;
  workflowAction: ApprovalWorkflowAction;
  auditEvent: ApprovalAuditEvent;
};

export type MockApprovalSimulation = {
  approvalId: string;
  runId: string;
  stepId: "approval_gate";
  actionName: ApprovalGovernedAction;
  status: ApprovalStatus;
  riskLevel: ApprovalRiskLevel;
  reviewerRole: string;
  reviewerComment: string;
};
