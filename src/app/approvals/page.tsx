import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { mockApprovalSimulation } from "@/lib/approvals/approvalAuditLog";
import { explainApprovalRequirement, getActionRiskLevel } from "@/lib/approvals/approvalPolicy";
import { agents } from "@/lib/mockData/agents";
import { approvals } from "@/lib/mockData/approvals";
import { workflowRuns } from "@/lib/mockData/workflowRuns";
import type { StatusTone } from "@/lib/workflowDisplay";
import type { ApprovalStatus } from "@/types/approval";

export const metadata: Metadata = {
  title: "Approvals",
  description: "Mock human-in-the-loop approval queue.",
};

const agentById = new Map(agents.map((agent) => [agent.id, agent]));
const runById = new Map(workflowRuns.map((run) => [run.id, run]));

const approvalLabels: Record<ApprovalStatus, string> = {
  approved: "Approved",
  needs_changes: "Needs changes",
  pending: "Pending",
  rejected: "Rejected",
};

const approvalTones: Record<ApprovalStatus, StatusTone> = {
  approved: "success",
  needs_changes: "warning",
  pending: "warning",
  rejected: "danger",
};

export default function ApprovalsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Human-in-the-loop gates
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          Mock approval queue for agentic workflow control.
        </h1>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          Approval states are fixture data. They show how a platform can pause, approve,
          reject, or request changes before higher-risk tool usage.
        </p>

        <section className="mt-10 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                Mock public-safe approval simulation
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                {mockApprovalSimulation.actionName}
              </h2>
              <p className="mt-3 max-w-4xl leading-7 text-amber-100">
                {explainApprovalRequirement(mockApprovalSimulation.actionName)}
              </p>
            </div>
            <StatusBadge
              label={`${getActionRiskLevel(mockApprovalSimulation.actionName)} risk`}
              tone="danger"
            />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <ApprovalField label="Status" value={mockApprovalSimulation.status} />
            <ApprovalField label="Reviewer role" value={mockApprovalSimulation.reviewerRole} />
            <ApprovalField label="Run" value={mockApprovalSimulation.runId} />
            <ApprovalField label="Reviewer comment" value={mockApprovalSimulation.reviewerComment} />
          </div>
          <Link
            href={`/approvals/${mockApprovalSimulation.approvalId}`}
            className="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-200"
          >
            View decision examples
          </Link>
        </section>

        <section className="mt-10 grid gap-6">
          {approvals.map((approval) => {
            const run = runById.get(approval.runId);
            const requester = agentById.get(approval.requesterAgentId);

            return (
              <article key={approval.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {approval.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{approval.title}</h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{approval.reason}</p>
                  </div>
                  <StatusBadge
                    label={approvalLabels[approval.status]}
                    tone={approvalTones[approval.status]}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <ApprovalField label="Risk" value={approval.risk} />
                  <ApprovalField label="Reviewer" value={approval.reviewerRole} />
                  <ApprovalField label="Requester" value={requester?.name ?? approval.requesterAgentId} />
                  <ApprovalField
                    label="Decision notes"
                    value={approval.decisionNotes ?? "Waiting for a mock human decision"}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-500">
                    Linked run: {run?.title ?? approval.runId}
                  </p>
                  <Link
                    href={`/workflows/${approval.runId}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View run trace
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function ApprovalField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
}
