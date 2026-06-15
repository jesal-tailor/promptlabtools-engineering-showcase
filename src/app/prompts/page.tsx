import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { getEvaluationTrend } from "@/lib/evaluations/evaluationHistory";
import { summariseHumanFeedbackForPrompt } from "@/lib/evaluations/humanFeedback";
import { promptRegistry } from "@/lib/prompts/promptRegistry";
import type { PromptLifecycleStatus } from "@/lib/prompts/promptTypes";
import type { StatusTone } from "@/lib/workflowDisplay";

export const metadata: Metadata = {
  title: "Prompt Registry",
  description: "Mock prompt registry with lifecycle, versioning, evaluation, and feedback metadata.",
};

const promptLabels: Record<PromptLifecycleStatus, string> = {
  active: "Active",
  deprecated: "Deprecated",
  draft: "Draft",
};

const promptTones: Record<PromptLifecycleStatus, StatusTone> = {
  active: "success",
  deprecated: "neutral",
  draft: "info",
};
const agentNameById = new Map<string, string>(agentRegistry.map((agent) => [agent.id, agent.name]));

const statusCounts = promptRegistry.reduce<Record<PromptLifecycleStatus, number>>(
  (counts, prompt) => ({
    ...counts,
    [prompt.status]: counts[prompt.status] + 1,
  }),
  { active: 0, deprecated: 0, draft: 0 },
);

export default function PromptsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Public-safe mock prompt registry
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              Versioned prompt metadata with lifecycle, evaluation, and feedback loops.
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              These prompts are deterministic public-safe fixtures. They demonstrate registry
              ownership, template rendering variables, lifecycle controls, version comparison,
              evaluation criteria, and human feedback without exposing production prompt content.
            </p>
          </div>
          <Link
            href="/evaluations"
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View evaluation engine
          </Link>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <RegistryMetric label="Active prompts" value={statusCounts.active.toString()} detail="Runnable by mock agents" />
          <RegistryMetric label="Draft prompts" value={statusCounts.draft.toString()} detail="Awaiting evaluation" />
          <RegistryMetric label="Deprecated prompts" value={statusCounts.deprecated.toString()} detail="Retained for audit" />
        </section>

        <section className="mt-10 grid gap-5">
          {promptRegistry.map((prompt) => {
            const ownerName = agentNameById.get(prompt.ownerAgentId);
            const trend = getEvaluationTrend(prompt.id);
            const latestEvaluation = trend.at(-1);
            const feedback = summariseHumanFeedbackForPrompt(prompt.id);

            return (
              <article key={prompt.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {prompt.version} / {prompt.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{prompt.name}</h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{prompt.changeNotes}</p>
                  </div>
                  <StatusBadge label={promptLabels[prompt.status]} tone={promptTones[prompt.status]} />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <PromptField label="Owner agent" value={ownerName ?? prompt.ownerAgentId} />
                  <PromptField label="Variables" value={prompt.variables.join(", ")} />
                  <PromptField
                    label="Latest score"
                    value={latestEvaluation ? `${latestEvaluation.overallScore}/100` : "No run yet"}
                  />
                  <PromptField
                    label="Human feedback"
                    value={`${feedback.feedbackCount} items / ${feedback.averageRating || "n/a"} rating`}
                  />
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-black p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Evaluation criteria
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {prompt.evaluationCriteria.map((criterion) => (
                      <span key={criterion} className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300">
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-zinc-500">
                    Mock-only template metadata. No production PromptLabTools prompt text or customer data is present.
                  </p>
                  <Link
                    href={`/prompts/${prompt.id}`}
                    className="rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200"
                  >
                    Inspect prompt
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

function RegistryMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
    </article>
  );
}

function PromptField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
}
