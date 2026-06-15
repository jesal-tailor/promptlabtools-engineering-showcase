import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import {
  createMockApprovalDecisionPayload,
  mockApprovalSimulation,
} from "@/lib/approvals/approvalAuditLog";
import { explainApprovalRequirement, requiresHumanApproval } from "@/lib/approvals/approvalPolicy";
import { applyApprovalDecision } from "@/lib/approvals/approvalStateMachine";
import type { ApprovalDecision, ApprovalWorkflowAction } from "@/lib/approvals/approvalTypes";
import { createRepositoryContext } from "@/lib/repositories/repositoryFactory";
import type { StatusTone } from "@/lib/workflowDisplay";

type ApprovalDetailPageProps = {
  params: Promise<{ approvalId: string }>;
};

const decisionExamples: Array<{
  decision: ApprovalDecision;
  reviewerComment: string;
}> = [
  {
    decision: "approved",
    reviewerComment:
      "Approved for mock preview because public-safe boundaries and approval notes are clear.",
  },
  {
    decision: "rejected",
    reviewerComment:
      "Rejected in the mock flow because publish-like action should stop when reviewer confidence is low.",
  },
  {
    decision: "needs_changes",
    reviewerComment:
      "Needs changes so the drafting step can make mock safety labels and rationale more explicit.",
  },
];

const workflowActionTone: Record<ApprovalWorkflowAction, StatusTone> = {
  continue_workflow: "success",
  no_action: "neutral",
  return_to_drafting: "warning",
  stop_workflow: "danger",
};

export async function generateMetadata({ params }: ApprovalDetailPageProps): Promise<Metadata> {
  const { approvalId } = await params;

  return {
    title: `Approval ${approvalId}`,
    description: "Mock public-safe approval simulation with audit events.",
  };
}

export default async function ApprovalDetailPage({ params }: ApprovalDetailPageProps) {
  const { approvalId } = await params;
  const repositories = createRepositoryContext();
  const examples = decisionExamples.map((example) => {
    const payload = createMockApprovalDecisionPayload({
      decision: example.decision,
      reviewerComment: example.reviewerComment,
    });
    const payloadWithApprovalId = {
      ...payload,
      approvalId,
    };
    const result = applyApprovalDecision({
      payload: payloadWithApprovalId,
      repositories,
    });

    return { payload: payloadWithApprovalId, result };
  });
  const repositoryApprovalPersisted = repositories.approvalRepository.getById(approvalId).ok;
  const repositoryAuditCount = repositories.auditEventRepository
    .list()
    .filter((event) => event.subjectId === approvalId).length;

  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/approvals" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to approvals
        </Link>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                Mock public-safe approval simulation
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                {approvalId}
              </h1>
              <p className="mt-5 max-w-4xl leading-8 text-amber-100">
                {explainApprovalRequirement(mockApprovalSimulation.actionName)}
              </p>
            </div>
            <StatusBadge
              label={requiresHumanApproval(mockApprovalSimulation.actionName) ? "Approval required" : "Auto allowed"}
              tone="warning"
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <DetailField label="Status" value={mockApprovalSimulation.status} />
            <DetailField label="Risk level" value={mockApprovalSimulation.riskLevel} />
            <DetailField label="Reviewer role" value={mockApprovalSimulation.reviewerRole} />
            <DetailField label="Step" value={mockApprovalSimulation.stepId} />
          </div>

          <div className="mt-6 rounded-3xl border border-cyan-200/20 bg-black/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
              Repository boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-cyan-50">
              Backed by public-safe in-memory repository adapter. Persisted approval:{" "}
              {repositoryApprovalPersisted ? "yes" : "no"}, approval audit events: {repositoryAuditCount}.
            </p>
            <p className="mt-2 text-sm leading-6 text-cyan-100">
              Production version would swap this for Supabase/Postgres through the repository factory.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Reviewer comment field
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-zinc-300">Mock reviewer comment</span>
            <textarea
              readOnly
              rows={4}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-zinc-300 outline-none"
              value={mockApprovalSimulation.reviewerComment}
            />
          </label>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            The real product would persist reviewer identity and comments. This public showcase renders
            deterministic examples only.
          </p>
        </section>

        <section className="mt-10 grid gap-6">
          {examples.map(({ payload, result }) => (
            <article key={payload.decision} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Decision example
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">{payload.decision}</h2>
                  <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{payload.reviewerComment}</p>
                </div>
                <StatusBadge
                  label={result.workflowAction}
                  tone={workflowActionTone[result.workflowAction]}
                />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <DetailField label="Previous status" value={result.previousStatus} />
                <DetailField label="New status" value={result.newStatus} />
                <DetailField label="Decided by" value={payload.decidedBy} />
                <DetailField label="Workflow action" value={result.workflowAction} />
              </div>

              <section className="mt-6 rounded-3xl border border-white/10 bg-black p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Audit trail
                </p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-zinc-300 md:grid-cols-2">
                  <p>Audit event: {result.auditEvent.id}</p>
                  <p>Type: {result.auditEvent.type}</p>
                  <p>Created at: {result.auditEvent.createdAt}</p>
                  <p>Public safety: {result.auditEvent.publicSafetyNote}</p>
                </div>
              </section>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
}
