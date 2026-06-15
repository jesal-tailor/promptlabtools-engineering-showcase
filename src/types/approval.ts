export type ApprovalStatus = "pending" | "approved" | "rejected" | "needs_changes";

export type ApprovalRisk = "low" | "medium" | "high";

export type ApprovalItem = {
  id: string;
  runId: string;
  title: string;
  requesterAgentId: string;
  reviewerRole: string;
  status: ApprovalStatus;
  risk: ApprovalRisk;
  reason: string;
  createdAt: string;
  decidedAt?: string;
  decisionNotes?: string;
};
