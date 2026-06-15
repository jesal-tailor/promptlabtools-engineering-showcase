import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { agents } from "@/lib/mockData/agents";
import { approvals } from "@/lib/mockData/approvals";
import { evaluations } from "@/lib/mockData/evaluations";
import { prompts } from "@/lib/mockData/prompts";
import { tools } from "@/lib/mockData/tools";
import { workflowRuns } from "@/lib/mockData/workflowRuns";
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

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function generateStaticParams() {
  return workflowRuns.map((run) => ({ runId: run.id }));
}

export async function generateMetadata({ params }: WorkflowRunPageProps): Promise<Metadata> {
  const { runId } = await params;
  const run = workflowRuns.find((candidate) => candidate.id === runId);

  return {
    title: run ? run.title : "Workflow Run",
    description: run?.description ?? "Mock workflow run trace.",
  };
}

export default async function WorkflowRunDetailPage({ params }: WorkflowRunPageProps) {
  const { runId } = await params;
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
