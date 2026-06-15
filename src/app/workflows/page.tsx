import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { agents } from "@/lib/mockData/agents";
import { approvals } from "@/lib/mockData/approvals";
import { evaluations } from "@/lib/mockData/evaluations";
import { workflowRuns } from "@/lib/mockData/workflowRuns";
import { createRepositoryContext } from "@/lib/repositories/repositoryFactory";
import { runCampaignPublishPackageWorkflow } from "@/lib/workflows/workflowRunner";
import {
  formatTokenCount,
  formatUsdEstimate,
  getWorkflowRunStatusLabel,
  getWorkflowRunStatusTone,
} from "@/lib/workflowDisplay";

export const metadata: Metadata = {
  title: "Workflow Runs",
  description: "Mock workflow runs for the AI platform engineering showcase.",
};

const agentById = new Map(agents.map((agent) => [agent.id, agent]));
const approvalById = new Map(approvals.map((approval) => [approval.id, approval]));
const evaluationById = new Map(evaluations.map((evaluation) => [evaluation.id, evaluation]));
const workflowPageRepositoryContext = createRepositoryContext();
const sampleRuntimeResult = runCampaignPublishPackageWorkflow({
  campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
  repositories: workflowPageRepositoryContext,
});

export default function WorkflowsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Workflow orchestration
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              Mock workflow runs with traceable agents, prompts, tools, and gates.
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              These runs are intentionally synthetic. They demonstrate orchestration patterns,
              state transitions, evaluation checkpoints, and human approval gates without exposing
              PromptLabTools production automations.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>

        <section className="mt-10 grid gap-6 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Stage 3 mock runtime
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Start the deterministic campaign workflow.
            </h2>
            <p className="mt-3 leading-7 text-amber-100">
              This form posts to `/api/workflows/start` and returns JSON. It runs deterministic mock
              agents only: no external AI API, webhook, credential, production data, or private logic.
              The response includes public-safe in-memory repository metadata.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-amber-100">
              <span>{sampleRuntimeResult.orderedSteps.length} ordered steps</span>
              <span>{sampleRuntimeResult.traceEvents.length} trace events</span>
              <span>{formatUsdEstimate(sampleRuntimeResult.evaluationSummary.cost.estimatedCostUsd)} mock cost</span>
            </div>
            <Link
              href="/workflows/runtime_sample"
              className="mt-6 inline-flex rounded-full border border-amber-200/30 px-5 py-3 text-sm font-semibold text-amber-50 transition hover:bg-amber-200/10"
            >
              View sample runtime result
            </Link>
          </div>
          <form action="/api/workflows/start" method="POST" className="rounded-3xl border border-white/10 bg-black p-5">
            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Campaign goal</span>
              <textarea
                name="campaignGoal"
                required
                rows={5}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300"
                defaultValue="Launch a public-safe AI workflow showcase for CV reviewers"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-black transition hover:bg-amber-200"
            >
              Start mock workflow and return JSON
            </button>
          </form>
        </section>

        <section className="mt-10 grid gap-6">
          {workflowRuns.map((run) => {
            const runAgents = run.agentIds
              .map((agentId) => agentById.get(agentId)?.name ?? agentId)
              .join(", ");
            const runApprovals = run.approvalIds
              .map((approvalId) => approvalById.get(approvalId))
              .filter((approval) => approval !== undefined);
            const runEvaluations = run.evaluationIds
              .map((evaluationId) => evaluationById.get(evaluationId))
              .filter((evaluation) => evaluation !== undefined);

            return (
              <article key={run.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {run.workflowKey}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{run.title}</h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{run.description}</p>
                  </div>
                  <StatusBadge
                    label={getWorkflowRunStatusLabel(run.status)}
                    tone={getWorkflowRunStatusTone(run.status)}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <RunStat label="Agents" value={run.agentIds.length.toString()} detail={runAgents} />
                  <RunStat
                    label="Evaluations"
                    value={runEvaluations.length.toString()}
                    detail={runEvaluations.map((evaluation) => `${evaluation.score}/${evaluation.maxScore}`).join(", ")}
                  />
                  <RunStat
                    label="Approvals"
                    value={runApprovals.length.toString()}
                    detail={runApprovals.map((approval) => approval.status).join(", ") || "None"}
                  />
                  <RunStat
                    label="Mock usage"
                    value={formatTokenCount(run.metrics.promptTokens + run.metrics.completionTokens)}
                    detail={formatUsdEstimate(run.metrics.estimatedCostUsd)}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-zinc-500">{run.publicSafetyNote}</p>
                  <Link
                    href={`/workflows/${run.id}`}
                    className="rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200"
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

function RunStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
    </div>
  );
}
