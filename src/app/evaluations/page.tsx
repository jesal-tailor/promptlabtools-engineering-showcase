import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { evaluations } from "@/lib/mockData/evaluations";
import { prompts } from "@/lib/mockData/prompts";
import { workflowRuns } from "@/lib/mockData/workflowRuns";
import type { StatusTone } from "@/lib/workflowDisplay";
import type { EvaluationStatus } from "@/types/evaluation";

export const metadata: Metadata = {
  title: "Evaluations",
  description: "Mock evaluation scores and feedback for workflow runs.",
};

const promptById = new Map(prompts.map((prompt) => [prompt.id, prompt]));
const runById = new Map(workflowRuns.map((run) => [run.id, run]));

const evaluationLabels: Record<EvaluationStatus, string> = {
  failed: "Failed",
  passed: "Passed",
  warning: "Warning",
};

const evaluationTones: Record<EvaluationStatus, StatusTone> = {
  failed: "danger",
  passed: "success",
  warning: "warning",
};

export default function EvaluationsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Evaluation engine
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          Mock scores, rubric dimensions, and review feedback.
        </h1>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          Evaluations are deterministic sample records. They show where quality gates would sit
          in an AI workflow platform without invoking model providers or private test sets.
        </p>

        <section className="mt-10 grid gap-6">
          {evaluations.map((evaluation) => {
            const run = runById.get(evaluation.runId);
            const prompt = promptById.get(evaluation.promptId);

            return (
              <article key={evaluation.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {evaluation.suiteName}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      {evaluation.score}/{evaluation.maxScore} for {run?.title ?? evaluation.runId}
                    </h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{evaluation.feedback}</p>
                  </div>
                  <StatusBadge
                    label={evaluationLabels[evaluation.status]}
                    tone={evaluationTones[evaluation.status]}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {evaluation.dimensions.map((dimension) => (
                    <div key={dimension.name} className="rounded-3xl border border-white/10 bg-black p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {dimension.name}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-white">{dimension.score}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{dimension.notes}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-500">
                    Prompt: {prompt?.name ?? evaluation.promptId}
                  </p>
                  <Link
                    href={`/workflows/${evaluation.runId}`}
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
