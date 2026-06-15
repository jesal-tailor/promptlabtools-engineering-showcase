import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { mockApprovalSimulation } from "@/lib/approvals/approvalAuditLog";
import { compareEvaluationRuns, evaluationHistory } from "@/lib/evaluations/evaluationHistory";
import { detectQualityRegression } from "@/lib/evaluations/regressionChecks";
import { agents } from "@/lib/mockData/agents";
import { approvals } from "@/lib/mockData/approvals";
import { workflowRuns } from "@/lib/mockData/workflowRuns";
import { promptRegistry } from "@/lib/prompts/promptRegistry";
import type { PromptLifecycleStatus } from "@/lib/prompts/promptTypes";
import { comparePromptVersions } from "@/lib/prompts/promptVersioning";
import { toolRegistry } from "@/lib/tools/toolRegistry";
import {
  runCampaignPublishPackageWorkflow,
  runCampaignWorkflowWithApprovalDecision,
} from "@/lib/workflows/workflowRunner";
import {
  formatTokenCount,
  formatUsdEstimate,
  getRecentTraceActivity,
  getTraceStepStatusLabel,
  getTraceStepStatusTone,
  getWorkflowRunStatusLabel,
  getWorkflowRunStatusTone,
  summariseWorkflowRuns,
} from "@/lib/workflowDisplay";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Mock AI workflow control-plane dashboard for the public engineering showcase.",
};

const agentById = new Map(agents.map((agent) => [agent.id, agent]));
const summary = summariseWorkflowRuns(workflowRuns);
const pendingApprovals = approvals.filter((approval) => approval.status === "pending");
const sampleRuntimeResult = runCampaignPublishPackageWorkflow({
  campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
});
const approvedContinuation = runCampaignWorkflowWithApprovalDecision({
  approvalDecision: "approved",
  campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
  decidedBy: "mock_reviewer@example.test",
  reviewerComment: "Approved for mock preview after public-safe labels were checked.",
});
const needsChangesContinuation = runCampaignWorkflowWithApprovalDecision({
  approvalDecision: "needs_changes",
  campaignGoal: "Launch a public-safe AI workflow showcase for CV reviewers",
  decidedBy: "mock_reviewer@example.test",
  reviewerComment: "Needs clearer public-safe labels before mock approval.",
});
const promptVersionComparison = comparePromptVersions(
  "prompt_campaign_planner_v1",
  "prompt_campaign_planner_v2",
);
const evaluationComparison = compareEvaluationRuns("eval_hist_planner_v1", "eval_hist_planner_v2");
const regressionCheck = detectQualityRegression(
  evaluationComparison.baselineScore,
  evaluationComparison.candidateScore,
);
const blockedRuntimeToolCalls = sampleRuntimeResult.toolCalls.filter(
  (toolCall) => toolCall.status === "blocked",
);
const recentRuns = [...workflowRuns]
  .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
  .slice(0, 3);
const recentActivity = getRecentTraceActivity(workflowRuns, 5);
const averageEvaluationScore = Math.round(
  evaluationHistory.reduce((total, evaluation) => total + evaluation.overallScore, 0) /
    evaluationHistory.length,
);

const promptStatusCounts = promptRegistry.reduce<Record<PromptLifecycleStatus, number>>(
  (counts, prompt) => ({
    ...counts,
    [prompt.status]: counts[prompt.status] + 1,
  }),
  { active: 0, deprecated: 0, draft: 0 },
);

export default function DashboardPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              AI workflow control plane
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              Mock runtime overview for agentic workflow operations.
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              This dashboard uses local fixtures only. It shows how workflow state, prompt versions,
              evaluations, approvals, and trace activity can be exposed without touching production systems.
            </p>
          </div>
          <Link
            href="/workflows"
            className="rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200"
          >
            Inspect workflow runs
          </Link>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Workflow runs" value={summary.totalRuns.toString()} detail={`${summary.completedRuns} completed`} />
          <MetricCard label="Pending approvals" value={pendingApprovals.length.toString()} detail="Human gates waiting" />
          <MetricCard label="Prompt versions" value={promptRegistry.length.toString()} detail={`${promptStatusCounts.active} active`} />
          <MetricCard label="Average eval score" value={`${averageEvaluationScore}%`} detail={`${evaluationHistory.length} v2 runs`} />
          <MetricCard
            label="Mock spend"
            value={formatUsdEstimate(summary.estimatedCostUsd)}
            detail={`${formatTokenCount(summary.totalTokens)} tokens`}
          />
        </section>

        <section className="mt-10 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Stage 6 tool execution sandbox
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Agents now request tools through a permissioned mock adapter boundary.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-emerald-100">
                The sample workflow records {sampleRuntimeResult.toolCalls.length} tool calls across
                drafting, QA, and publish preparation. High-risk publish execution is blocked until
                approval, and all tool events are written as mock audit records.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-emerald-100 sm:grid-cols-3">
                <span>Registered tools: {toolRegistry.length}</span>
                <span>Blocked runtime calls: {blockedRuntimeToolCalls.length}</span>
                <span>Disabled tools: {toolRegistry.filter((tool) => !tool.enabled).length}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="rounded-full bg-emerald-200 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-100"
              >
                Inspect tool sandbox
              </Link>
              <Link
                href="/tools/audit"
                className="rounded-full border border-emerald-200/30 px-5 py-3 text-center text-sm font-semibold text-emerald-50 transition hover:bg-emerald-200/10"
              >
                View tool audit
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-sky-400/20 bg-sky-400/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                Stage 5 quality layer
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Prompt lifecycle and deterministic evaluations are now wired into the showcase.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-sky-100">
                Planner prompt comparison shows {promptVersionComparison.versionChange} with{" "}
                {promptVersionComparison.addedCriteria.length} new criteria. The evaluation trend improves by{" "}
                {evaluationComparison.scoreDelta} points, and the regression check is{" "}
                {regressionCheck.regressionDetected ? "flagged" : "clear"}.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-sky-100 sm:grid-cols-3">
                <span>Active prompts: {promptStatusCounts.active}</span>
                <span>Draft prompts: {promptStatusCounts.draft}</span>
                <span>Regression severity: {regressionCheck.severity}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/prompts/prompt_campaign_planner_v2"
                className="rounded-full bg-sky-200 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-sky-100"
              >
                Inspect planner prompt
              </Link>
              <Link
                href="/evaluations/eval_hist_planner_v2"
                className="rounded-full border border-sky-200/30 px-5 py-3 text-center text-sm font-semibold text-sky-50 transition hover:bg-sky-200/10"
              >
                Inspect evaluation
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                Stage 4 governance layer
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Human approval decisions now control deterministic workflow continuation.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-amber-100">
                The sample runtime executes planner, drafting, QA, approval gate, and preview publish
                package steps with {sampleRuntimeResult.traceEvents.length} trace events and{" "}
                {formatTokenCount(sampleRuntimeResult.evaluationSummary.cost.totalTokens)} mock tokens.
                Approval examples show continue, stop, and return-to-drafting outcomes.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-amber-100 sm:grid-cols-3">
                <span>Approved: {approvedContinuation.workflowAction}</span>
                <span>Needs changes: {needsChangesContinuation.workflowAction}</span>
                <span>Gate: {mockApprovalSimulation.status}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/workflows/runtime_sample"
                className="rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200"
              >
                View sample result
              </Link>
              <Link
                href={`/approvals/${mockApprovalSimulation.approvalId}`}
                className="rounded-full border border-amber-200/30 px-5 py-3 text-center text-sm font-semibold text-amber-50 transition hover:bg-amber-200/10"
              >
                Review approval simulation
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Recent workflow runs
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Runtime queue</h2>
              </div>
              <Link href="/workflows" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {recentRuns.map((run) => (
                <Link
                  key={run.id}
                  href={`/workflows/${run.id}`}
                  className="rounded-3xl border border-white/10 bg-black p-5 transition hover:border-amber-300/40"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{run.workflowKey}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{run.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{run.description}</p>
                    </div>
                    <StatusBadge
                      label={getWorkflowRunStatusLabel(run.status)}
                      tone={getWorkflowRunStatusTone(run.status)}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>{formatTokenCount(run.metrics.promptTokens + run.metrics.completionTokens)} tokens</span>
                    <span>{formatUsdEstimate(run.metrics.estimatedCostUsd)}</span>
                    <span>{run.trace.length} trace steps</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Pending approvals
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Human gates</h2>
            <div className="mt-6 grid gap-4">
              {pendingApprovals.map((approval) => {
                const requester = agentById.get(approval.requesterAgentId);

                return (
                  <article key={approval.id} className="rounded-3xl border border-amber-300/20 bg-black p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{approval.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{approval.reason}</p>
                      </div>
                      <StatusBadge label={approval.risk} tone="warning" />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Requested by {requester?.name ?? approval.requesterAgentId}
                    </p>
                  </article>
                );
              })}
            </div>
            <Link
              href="/approvals"
              className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open approval queue
            </Link>
          </section>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Recent trace-style activity
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Observable run history</h2>
            </div>
            <p className="text-sm text-zinc-500">Fixture traces only. No private logs are present.</p>
          </div>
          <div className="mt-6 grid gap-4">
            {recentActivity.map((activity) => (
              <article key={activity.id} className="rounded-3xl border border-white/10 bg-black p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link
                      href={`/workflows/${activity.runId}`}
                      className="text-sm font-semibold text-amber-200 hover:text-amber-100"
                    >
                      {activity.runTitle}
                    </Link>
                    <h3 className="mt-2 text-lg font-semibold text-white">{activity.stepName}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{activity.summary}</p>
                  </div>
                  <StatusBadge
                    label={getTraceStepStatusLabel(activity.status)}
                    tone={getTraceStepStatusTone(activity.status)}
                  />
                </div>
                <time className="mt-4 block text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {new Date(activity.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-400">{detail}</p>
    </article>
  );
}
