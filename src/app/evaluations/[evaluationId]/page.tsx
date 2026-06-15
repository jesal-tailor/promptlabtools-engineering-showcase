import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { getEvaluationCriteriaForPrompt } from "@/lib/evaluations/evaluationCriteria";
import {
  compareEvaluationRuns,
  evaluationHistory,
  getEvaluationRunById,
} from "@/lib/evaluations/evaluationHistory";
import {
  recommendPromptImprovement,
  summariseHumanFeedbackForPrompt,
} from "@/lib/evaluations/humanFeedback";
import { detectQualityRegression } from "@/lib/evaluations/regressionChecks";
import { getPromptById } from "@/lib/prompts/promptRegistry";

type EvaluationDetailPageProps = {
  params: Promise<{ evaluationId: string }>;
};

export function generateStaticParams() {
  return evaluationHistory.map((evaluation) => ({ evaluationId: evaluation.id }));
}

export async function generateMetadata({ params }: EvaluationDetailPageProps): Promise<Metadata> {
  const { evaluationId } = await params;
  const evaluation = getEvaluationRunById(evaluationId);

  return {
    title: evaluation ? `${evaluation.id} Evaluation` : "Evaluation Detail",
    description: evaluation?.judgeFeedback ?? "Mock evaluation run detail.",
  };
}

export default async function EvaluationDetailPage({ params }: EvaluationDetailPageProps) {
  const { evaluationId } = await params;
  const evaluation = getEvaluationRunById(evaluationId);

  if (!evaluation) {
    notFound();
  }

  const prompt = getPromptById(evaluation.promptId);
  const criteria = getEvaluationCriteriaForPrompt(evaluation.promptId);
  const feedback = summariseHumanFeedbackForPrompt(evaluation.promptId);
  const plannerComparison =
    evaluation.id === "eval_hist_planner_v2"
      ? compareEvaluationRuns("eval_hist_planner_v1", "eval_hist_planner_v2")
      : undefined;
  const regression = plannerComparison
    ? detectQualityRegression(plannerComparison.baselineScore, plannerComparison.candidateScore)
    : undefined;

  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/evaluations" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to evaluations
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {evaluation.id} / {evaluation.criteriaId}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                {evaluation.overallScore}/100 evaluation score
              </h1>
              <p className="mt-5 max-w-4xl leading-8 text-zinc-400">{evaluation.judgeFeedback}</p>
            </div>
            <StatusBadge label={evaluation.passed ? "Passed" : "Needs review"} tone={evaluation.passed ? "success" : "warning"} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <EvaluationDetailStat label="Prompt" value={prompt?.name ?? evaluation.promptId} />
            <EvaluationDetailStat label="Passing score" value={criteria ? `${criteria.passingScore}/100` : "n/a"} />
            <EvaluationDetailStat label="Human feedback" value={`${feedback.feedbackCount} items`} />
            <EvaluationDetailStat
              label="Created"
              value={new Date(evaluation.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
            />
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Score breakdown
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(evaluation.scores).map(([dimension, score]) => (
                <div key={dimension} className="rounded-3xl border border-white/10 bg-black p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold capitalize text-white">{dimension}</p>
                    <p className="text-2xl font-semibold text-white">{score}</p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-amber-300" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Evaluated output
              </p>
              <p className="mt-4 rounded-2xl border border-white/10 bg-black p-4 text-sm leading-7 text-zinc-300">
                {evaluation.output}
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Human feedback
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {feedback.averageRating || "n/a"} average rating
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {recommendPromptImprovement(evaluation.promptId)}
              </p>
            </section>

            {regression ? (
              <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Regression check
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{regression.explanation}</p>
                <p className="mt-4 text-sm font-semibold text-amber-200">
                  Severity: {regression.severity}
                </p>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

function EvaluationDetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}
