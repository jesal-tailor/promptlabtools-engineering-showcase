import type { ApprovalItem } from "@/types/approval";

export const approvals: ApprovalItem[] = [
  {
    id: "approval_run_101_publish",
    runId: "run_101",
    title: "Approve mock publish packet",
    requesterAgentId: "agent_approval_coordinator",
    reviewerRole: "Human operator",
    status: "pending",
    risk: "high",
    reason:
      "The run wants to exercise a publish-like sandbox action, so the mock gate must be approved first.",
    createdAt: "2026-06-15T08:15:00.000Z",
  },
  {
    id: "approval_run_102_notify",
    runId: "run_102",
    title: "Approve operator notification summary",
    requesterAgentId: "agent_intake_orchestrator",
    reviewerRole: "Workflow owner",
    status: "approved",
    risk: "medium",
    reason:
      "Operator notification was required before completing the mock lead enrichment workflow.",
    createdAt: "2026-06-14T15:10:00.000Z",
    decidedAt: "2026-06-14T15:18:00.000Z",
    decisionNotes: "Approved because the payload was fixture-only and clearly labelled mock.",
  },
  {
    id: "approval_run_103_prompt",
    runId: "run_103",
    title: "Request prompt packet changes",
    requesterAgentId: "agent_prompt_curator",
    reviewerRole: "Prompt reviewer",
    status: "needs_changes",
    risk: "medium",
    reason:
      "The prompt packet is missing an explicit public-safe boundary statement.",
    createdAt: "2026-06-14T12:00:00.000Z",
    decidedAt: "2026-06-14T12:16:00.000Z",
    decisionNotes: "Add a clearer mock-data disclaimer before the run can continue.",
  },
  {
    id: "approval_run_104_publish",
    runId: "run_104",
    title: "Reject unreviewed publish action",
    requesterAgentId: "agent_approval_coordinator",
    reviewerRole: "Human operator",
    status: "rejected",
    risk: "high",
    reason:
      "The run attempted to move to the mock publish step before evaluation feedback was resolved.",
    createdAt: "2026-06-13T17:05:00.000Z",
    decidedAt: "2026-06-13T17:22:00.000Z",
    decisionNotes: "Rejected to demonstrate fail-closed workflow behaviour.",
  },
];
