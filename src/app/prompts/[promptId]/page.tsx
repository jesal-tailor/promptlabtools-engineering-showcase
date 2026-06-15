import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { getEvaluationCriteriaForPrompt } from "@/lib/evaluations/evaluationCriteria";
import { getEvaluationTrend } from "@/lib/evaluations/evaluationHistory";
import {
  recommendPromptImprovement,
  summariseHumanFeedbackForPrompt,
} from "@/lib/evaluations/humanFeedback";
import { explainPromptLifecycleStatus } from "@/lib/prompts/promptLifecycle";
import { getPromptById, promptRegistry } from "@/lib/prompts/promptRegistry";
import type { PromptVersionComparison } from "@/lib/prompts/promptTypes";
import { comparePromptVersions } from "@/lib/prompts/promptVersioning";
import type { StatusTone } from "@/lib/workflowDisplay";

type PromptDetailPageProps = {
  params: Promise<{ promptId: string }>;
};

const statusTones: Record<string, StatusTone> = {
  active: "success",
  deprecated: "neutral",
  draft: "info",
};
const agentNameById = new Map<string, string>(agentRegistry.map((agent) => [agent.id, agent.name]));

export function generateStaticParams() {
  return promptRegistry.map((prompt) => ({ promptId: prompt.id }));
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { promptId } = await params;
  const prompt = getPromptById(promptId);

  return {
    title: prompt ? `${prompt.name} ${prompt.version}` : "Prompt Detail",
    description: prompt?.changeNotes ?? "Mock prompt registry detail.",
  };
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { promptId } = await params;
  const prompt = getPromptById(promptId);

  if (!prompt) {
    notFound();
  }

  const ownerName = agentNameById.get(prompt.ownerAgentId);
  const criteria = getEvaluationCriteriaForPrompt(prompt.id);
  const evaluationTrend = getEvaluationTrend(prompt.id);
  const latestEvaluation = evaluationTrend.at(-1);
  const feedbackSummary = summariseHumanFeedbackForPrompt(prompt.id);
  const comparison = getComparisonForPrompt(prompt.id);

  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/prompts" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to prompt registry
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {prompt.id} / {prompt.version}
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                {prompt.name}
              </h1>
              <p className="mt-5 max-w-4xl leading-8 text-zinc-400">{prompt.changeNotes}</p>
            </div>
            <StatusBadge label={prompt.status} tone={statusTones[prompt.status]} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <PromptDetailStat label="Owner agent" value={ownerName ?? prompt.ownerAgentId} />
            <PromptDetailStat label="Variables" value={prompt.variables.length.toString()} />
            <PromptDetailStat
              label="Latest score"
              value={latestEvaluation ? `${latestEvaluation.overallScore}/100` : "No run"}
            />
            <PromptDetailStat
              label="Feedback"
              value={`${feedbackSummary.feedbackCount} items`}
            />
          </div>

          <p className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            {explainPromptLifecycleStatus(prompt.id)}
          </p>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Mock prompt template
            </p>
            <pre className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-black p-5 text-sm leading-7 text-zinc-300">
              {prompt.template}
            </pre>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Template values are rendered from deterministic mock variables in tests and demos. This
              is showcase-safe prompt content, not production PromptLabTools logic.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <TagPanel title="Variables" items={prompt.variables} />
              <TagPanel title="Evaluation criteria" items={prompt.evaluationCriteria} />
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Evaluation history
              </p>
              <div className="mt-4 grid gap-3">
                {evaluationTrend.length > 0 ? (
                  evaluationTrend.map((evaluation) => (
                    <Link
                      key={evaluation.id}
                      href={`/evaluations/${evaluation.id}`}
                      className="rounded-2xl border border-white/10 bg-black p-4 transition hover:border-amber-300/40"
                    >
                      <p className="font-semibold text-white">{evaluation.overallScore}/100</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{evaluation.judgeFeedback}</p>
                    </Link>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-black p-4 text-sm leading-6 text-zinc-400">
                    No mock evaluation history yet. Draft prompts must pass deterministic evaluation before activation.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Human feedback loop
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {feedbackSummary.averageRating || "n/a"} average rating
              </p>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-zinc-400">
                {feedbackSummary.themes.map((theme) => (
                  <span key={theme}>{theme}</span>
                ))}
              </div>
              <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
                {recommendPromptImprovement(prompt.id)}
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Criteria suite
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {criteria?.notes ?? "No criteria suite registered for this prompt yet."}
              </p>
              <p className="mt-4 text-sm text-zinc-500">
                Passing score: {criteria ? `${criteria.passingScore}/100` : "n/a"}
              </p>
            </section>
          </aside>
        </div>

        {comparison ? <PromptComparisonPanel comparison={comparison} /> : null}
      </div>
    </main>
  );
}

function getComparisonForPrompt(promptId: string): PromptVersionComparison | undefined {
  const prompt = getPromptById(promptId);

  if (!prompt) {
    return undefined;
  }

  try {
    if (prompt.replacedByPromptId) {
      return comparePromptVersions(prompt.id, prompt.replacedByPromptId);
    }

    if (prompt.id === "prompt_campaign_planner_v2") {
      return comparePromptVersions("prompt_campaign_planner_v1", prompt.id);
    }

    if (prompt.id === "prompt_campaign_drafter_v2_draft") {
      return comparePromptVersions("prompt_campaign_drafter_v1", prompt.id);
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function PromptComparisonPanel({ comparison }: { comparison: PromptVersionComparison }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
        Version comparison
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{comparison.versionChange}</h2>
      <p className="mt-3 leading-7 text-zinc-400">{comparison.changeSummary}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <PromptDetailStat label="Status change" value={comparison.statusChange} />
        <PromptDetailStat
          label="Added variables"
          value={comparison.addedVariables.join(", ") || "None"}
        />
        <PromptDetailStat
          label="Added criteria"
          value={comparison.addedCriteria.join(", ") || "None"}
        />
        <PromptDetailStat
          label="Removed criteria"
          value={comparison.removedCriteria.join(", ") || "None"}
        />
      </div>
    </section>
  );
}

function PromptDetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}

function TagPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
