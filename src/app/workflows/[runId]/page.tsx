import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { mockApprovalSimulation } from "@/lib/approvals/approvalAuditLog";
import { evaluationHistory } from "@/lib/evaluations/evaluationHistory";
import { summariseHumanFeedbackForPrompt } from "@/lib/evaluations/humanFeedback";
import { agents } from "@/lib/mockData/agents";
import { approvals } from "@/lib/mockData/approvals";
import { evaluations } from "@/lib/mockData/evaluations";
import { prompts } from "@/lib/mockData/prompts";
import { tools } from "@/lib/mockData/tools";
import { workflowRuns } from "@/lib/mockData/workflowRuns";
import { promptRegistry as runtimePromptRegistry } from "@/lib/prompts/promptRegistry";
import {
  runCampaignPublishPackageWorkflow,
  runCampaignWorkflowWithApprovalDecision,
} from "@/lib/workflows/workflowRunner";
import type {
  CampaignWorkflowContinuationResult,
  CampaignWorkflowRunResult,
} from "@/lib/workflows/workflowTypes";
import {
  formatTokenCount,
  formatUsdEstimate,
  getTraceStepStatusLabel,
  getTraceStepStatusTone,
  getWorkflowRunStatusLabel,
  getWorkflowRunStatusTone,
} from "@/lib/workflowDisplay";

type WorkflowRunPageProps = {
  params: Promise<{ runId: string }>;
};

const agentById = new Map(agents.map((agent) => [agent.id, agent]));
const approvalById = new Map(approvals.map((approval) => [approval.id, approval]));
const evaluationById = new Map(evaluations.map((evaluation) => [evaluation.id, evaluation]));
const promptById = new Map(prompts.map((prompt) => [prompt.id, prompt]));
const toolById = new Map(tools.map((tool) => [tool.id, tool]));
const runtimeSampleRunId = "runtime_sample";
const sampleRuntimeResult = runCampaignPublishPackageWorkflow({
  campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
});
const activeRuntimePrompts = runtimePromptRegistry.filter((prompt) => prompt.status === "active");
const runtimePlannerEvaluation = evaluationHistory.find(
  (evaluation) => evaluation.id === "eval_hist_planner_v2",
);
const runtimePlannerFeedback = summariseHumanFeedbackForPrompt("prompt_campaign_planner_v2");
const sampleApprovalOutcomes = [
  runCampaignWorkflowWithApprovalDecision({
    approvalDecision: "approved",
    campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
    decidedBy: "mock_reviewer@example.test",
    reviewerComment: "Approved for mock preview because public-safe labelling is clear.",
  }),
  runCampaignWorkflowWithApprovalDecision({
    approvalDecision: "rejected",
    campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
    decidedBy: "mock_reviewer@example.test",
    reviewerComment: "Rejected because the mock reviewer wants the publish-like action stopped.",
  }),
  runCampaignWorkflowWithApprovalDecision({
    approvalDecision: "needs_changes",
    campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
    decidedBy: "mock_reviewer@example.test",
    reviewerComment: "Needs clearer public-safe labels before approval.",
  }),
];

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function generateStaticParams() {
  return [
    ...workflowRuns.map((run) => ({ runId: run.id })),
    { runId: runtimeSampleRunId },
  ];
}

export async function generateMetadata({ params }: WorkflowRunPageProps): Promise<Metadata> {
  const { runId } = await params;
  if (runId === runtimeSampleRunId) {
    return {
      title: "Sample Runtime Result",
      description: "Deterministic mock workflow runtime result.",
    };
  }

  const run = workflowRuns.find((candidate) => candidate.id === runId);

  return {
    title: run ? run.title : "Workflow Run",
    description: run?.description ?? "Mock workflow run trace.",
  };
}

export default async function WorkflowRunDetailPage({ params }: WorkflowRunPageProps) {
  const { runId } = await params;

  if (runId === runtimeSampleRunId) {
    return <RuntimeSampleResultPage result={sampleRuntimeResult} />;
  }

  const run = workflowRuns.find((candidate) => candidate.id === runId);

  if (!run) {
    notFound();
  }

  const runPrompts = run.promptIds.map((promptId) => promptById.get(promptId)).filter(isDefined);
  const runEvaluations = run.evaluationIds
    .map((evaluationId) => evaluationById.get(evaluationId))
    .filter(isDefined);
  const runApprovals = run.approvalIds
    .map((approvalId) => approvalById.get(approvalId))
    .filter(isDefined);

  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/workflows" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to workflows
        </Link>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {run.id} / {run.workflowKey}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                {run.title}
              </h1>
              <p className="mt-5 max-w-4xl leading-8 text-zinc-400">{run.description}</p>
            </div>
            <StatusBadge
              label={getWorkflowRunStatusLabel(run.status)}
              tone={getWorkflowRunStatusTone(run.status)}
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <DetailStat label="Priority" value={run.priority} />
            <DetailStat label="Owner" value={run.owner} />
            <DetailStat
              label="Tokens"
              value={formatTokenCount(run.metrics.promptTokens + run.metrics.completionTokens)}
            />
            <DetailStat label="Mock cost" value={formatUsdEstimate(run.metrics.estimatedCostUsd)} />
          </div>

          <p className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            {run.publicSafetyNote}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Step-by-step run trace
            </p>
            <div className="mt-6 grid gap-4">
              {run.trace.map((step, index) => {
                const agent = agentById.get(step.agentId);
                const stepTools = step.toolIds.map((toolId) => toolById.get(toolId)).filter(isDefined);

                return (
                  <article key={step.id} className="rounded-3xl border border-white/10 bg-black p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          Step {index + 1}
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight">{step.name}</h2>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">{step.summary}</p>
                      </div>
                      <StatusBadge
                        label={getTraceStepStatusLabel(step.status)}
                        tone={getTraceStepStatusTone(step.status)}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <TraceField label="Agent" value={agent?.name ?? step.agentId} />
                      <TraceField
                        label="Tools"
                        value={stepTools.map((tool) => tool.name).join(", ") || "No tool call"}
                      />
                      <TraceField label="Input" value={step.inputArtifact} />
                      <TraceField label="Output" value={step.outputArtifact} />
                      <TraceField
                        label="Usage"
                        value={`${formatTokenCount(
                          step.tokens.promptTokens + step.tokens.completionTokens,
                        )} tokens / ${formatUsdEstimate(step.costUsdEstimate)}`}
                      />
                      <TraceField
                        label="Timing"
                        value={`${new Date(step.startedAt).toLocaleString("en-GB", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}${step.durationMs ? ` / ${Math.round(step.durationMs / 1000)}s` : ""}`}
                      />
                    </div>

                    {step.approvalId ? (
                      <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                          Approval gate
                        </p>
                        <p className="mt-2 text-sm leading-6 text-amber-100">
                          {approvalById.get(step.approvalId)?.title ?? step.approvalId}
                        </p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Prompt versions
              </p>
              <div className="mt-4 grid gap-3">
                {runPrompts.map((prompt) => (
                  <div key={prompt.id} className="rounded-2xl border border-white/10 bg-black p-4">
                    <p className="font-semibold text-white">{prompt.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">{prompt.version}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Evaluation results
              </p>
              <div className="mt-4 grid gap-3">
                {runEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="rounded-2xl border border-white/10 bg-black p-4">
                    <p className="font-semibold text-white">
                      {evaluation.suiteName}: {evaluation.score}/{evaluation.maxScore}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{evaluation.feedback}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Approval history
              </p>
              <div className="mt-4 grid gap-3">
                {runApprovals.map((approval) => (
                  <div key={approval.id} className="rounded-2xl border border-white/10 bg-black p-4">
                    <p className="font-semibold text-white">{approval.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {approval.decisionNotes ?? approval.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function TraceField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
}

function RuntimeSampleResultPage({ result }: { result: CampaignWorkflowRunResult }) {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/workflows" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to workflows
        </Link>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                {result.runId} / {result.templateId}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                Deterministic mock runtime result
              </h1>
              <p className="mt-5 max-w-4xl leading-8 text-amber-100">{result.publicSafetyNote}</p>
            </div>
            <StatusBadge label="Runtime completed" tone="success" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <DetailStat label="Steps" value={result.orderedSteps.length.toString()} />
            <DetailStat label="Trace events" value={result.traceEvents.length.toString()} />
            <DetailStat label="Tool calls" value={result.toolCalls.length.toString()} />
            <DetailStat label="Eval score" value={`${result.evaluationSummary.score}/100`} />
            <DetailStat
              label="Mock cost"
              value={formatUsdEstimate(result.evaluationSummary.cost.estimatedCostUsd)}
            />
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Mock public-safe tool execution sandbox
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Runtime tools are permissioned, audited, and adapter-bound.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-emerald-100">
                Drafting writes an in-memory markdown artifact, QA scores content quality, and
                publish package creation is blocked until approval. These are deterministic mock
                tool calls only.
              </p>
            </div>
            <Link
              href="/tools"
              className="rounded-full border border-emerald-200/30 px-5 py-3 text-center text-sm font-semibold text-emerald-50 transition hover:bg-emerald-200/10"
            >
              Open tool registry
            </Link>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {result.toolCalls.map((toolCall) => (
              <article key={toolCall.toolCallId} className="rounded-2xl border border-emerald-200/20 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{toolCall.toolId}</p>
                    <p className="mt-1 text-sm text-emerald-100">{toolCall.agentId}</p>
                  </div>
                  <StatusBadge
                    label={toolCall.status}
                    tone={toolCall.status === "executed" ? "success" : toolCall.status === "failed" ? "danger" : "warning"}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-100">
                  {toolCall.errorMessage ?? toolCall.outputPayload?.publicSafetyNote?.toString() ?? "Executed through mock adapter."}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-sky-400/20 bg-sky-400/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                Prompt and evaluation context
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Runtime output is tied back to versioned prompts and deterministic quality gates.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-sky-100">
                The sample result is still non-persistent mock execution. Active prompts are listed
                as registry metadata, and the planner evaluation shows how a run would be checked
                before human approval.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-sky-100 sm:grid-cols-3 lg:min-w-[32rem]">
              <span>Active prompts: {activeRuntimePrompts.length}</span>
              <span>Planner score: {runtimePlannerEvaluation?.overallScore ?? "n/a"}/100</span>
              <span>Feedback items: {runtimePlannerFeedback.feedbackCount}</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {activeRuntimePrompts.slice(0, 3).map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                className="rounded-2xl border border-sky-200/20 bg-black/40 p-4 transition hover:bg-black/60"
              >
                <p className="font-semibold text-white">{prompt.name}</p>
                <p className="mt-1 text-sm text-sky-100">{prompt.version}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Ordered runtime steps
            </p>
            <div className="mt-6 grid gap-4">
              {result.orderedSteps.map((step, index) => (
                <article key={step.id} className="rounded-3xl border border-white/10 bg-black p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Step {index + 1} / {step.id}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight">{step.name}</h2>
                      <p className="mt-3 text-sm leading-6 text-zinc-400">{step.outputSummary}</p>
                    </div>
                    <StatusBadge
                      label={step.status === "approval_required" ? "Approval required" : "Completed"}
                      tone={step.status === "approval_required" ? "warning" : "success"}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Approval requirement
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">{result.approvalRequirement.gateId}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{result.approvalRequirement.reason}</p>
              <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
                Required before final publish package use.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Final publish package
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">{result.finalPublishPackage.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{result.finalPublishPackage.body}</p>
              <p className="mt-4 text-sm font-semibold text-amber-200">
                Destination: {result.finalPublishPackage.mockDestination}
              </p>
            </section>
          </aside>
        </div>

        <ApprovalOutcomeSection outcomes={sampleApprovalOutcomes} />

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Runtime trace events
          </p>
          <div className="mt-6 grid gap-3">
            {result.traceEvents.map((event) => (
              <article key={event.id} className="rounded-2xl border border-white/10 bg-black p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {event.sequence}. {event.type}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{event.message}</p>
                  </div>
                  <time className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {new Date(event.createdAt).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ApprovalOutcomeSection({ outcomes }: { outcomes: CampaignWorkflowContinuationResult[] }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Mock public-safe approval simulation
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Workflow continuation outcomes</h2>
        </div>
        <Link
          href={`/approvals/${mockApprovalSimulation.approvalId}`}
          className="rounded-full border border-white/10 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Open approval detail
        </Link>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {outcomes.map((outcome) => (
          <article key={outcome.approvalDecisionPayload.decision} className="rounded-3xl border border-white/10 bg-black p-5">
            <StatusBadge
              label={outcome.workflowAction}
              tone={
                outcome.workflowAction === "continue_workflow"
                  ? "success"
                  : outcome.workflowAction === "stop_workflow"
                    ? "danger"
                    : "warning"
              }
            />
            <h3 className="mt-4 text-xl font-semibold text-white">
              {outcome.approvalDecisionPayload.decision}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {outcome.approvalDecisionPayload.reviewerComment}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-zinc-500">
              <span>New status: {outcome.approvalDecisionResult.newStatus}</span>
              <span>Audit: {outcome.approvalDecisionResult.auditEvent.id}</span>
              <span>
                Package: {outcome.finalPublishPackage ? outcome.finalPublishPackage.id : "not generated"}
              </span>
              {outcome.revisionInstruction ? <span>Revision: {outcome.revisionInstruction}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
