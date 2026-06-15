import type { Metadata } from "next";
import Link from "next/link";
import { PublicSafeRuntimeBanner } from "@/components/PublicSafeRuntimeBanner";
import { StatusBadge } from "@/components/StatusBadge";
import { evaluationCriteriaRegistry } from "@/lib/evaluations/evaluationCriteria";
import { compareEvaluationRuns, evaluationHistory } from "@/lib/evaluations/evaluationHistory";
import { summariseHumanFeedbackForPrompt } from "@/lib/evaluations/humanFeedback";
import { detectQualityRegression } from "@/lib/evaluations/regressionChecks";
import { getPromptById } from "@/lib/prompts/promptRegistry";

export const metadata: Metadata = {
  title: "Evaluations",
  description: "Deterministic mock evaluation engine, history, feedback, and regression checks.",
};

const plannerComparison = compareEvaluationRuns("eval_hist_planner_v1", "eval_hist_planner_v2");
const regressionExample = detectQualityRegression(91, 80);
const averageScore = Math.round(
  evaluationHistory.reduce((total, evaluation) => total + evaluation.overallScore, 0) /
    evaluationHistory.length,
);

export default function EvaluationsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Public-safe mock evaluation engine
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              Deterministic quality scoring, feedback, and regression checks.
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              This engine scores mock outputs against public-safe rubric dimensions. It behaves like
              an LLM-as-judge control plane, but all scoring and feedback are local deterministic
              fixtures so tests stay stable and no external model provider is called.
            </p>
          </div>
          <Link
            href="/prompts"
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View prompt registry
          </Link>
        </div>

        <div className="mt-8">
          <PublicSafeRuntimeBanner />
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          <EvaluationMetric label="Average score" value={`${averageScore}/100`} detail={`${evaluationHistory.length} mock runs`} />
          <EvaluationMetric label="Criteria suites" value={evaluationCriteriaRegistry.length.toString()} detail="Prompt-linked rubrics" />
          <EvaluationMetric label="Planner delta" value={`+${plannerComparison.scoreDelta}`} detail={plannerComparison.summary} />
          <EvaluationMetric label="Regression demo" value={regressionExample.severity} detail={regressionExample.explanation} />
        </section>

        <section className="mt-10 grid gap-6">
          {evaluationHistory.map((evaluation) => {
            const prompt = getPromptById(evaluation.promptId);
            const feedback = summariseHumanFeedbackForPrompt(evaluation.promptId);
            const dimensions = Object.entries(evaluation.scores).filter(
              ([dimension]) => dimension !== "overallScore",
            );

            return (
              <article key={evaluation.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {evaluation.criteriaId} / {evaluation.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {evaluation.overallScore}/100 for {prompt?.name ?? evaluation.promptId}
                    </h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{evaluation.judgeFeedback}</p>
                  </div>
                  <StatusBadge
                    label={evaluation.passed ? "Passed" : "Needs review"}
                    tone={evaluation.passed ? "success" : "warning"}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  {dimensions.slice(0, 4).map(([dimension, score]) => (
                    <div key={dimension} className="rounded-3xl border border-white/10 bg-black p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {dimension}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-white">{score}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-500">
                    Feedback: {feedback.feedbackCount} items / {feedback.averageRating || "n/a"} rating
                  </p>
                  <Link
                    href={`/evaluations/${evaluation.id}`}
                    className="rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200"
                  >
                    Inspect evaluation
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

function EvaluationMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
    </article>
  );
}
