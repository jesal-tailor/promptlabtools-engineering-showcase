import type { Metadata } from "next";
import { StatusBadge } from "@/components/StatusBadge";
import { agents } from "@/lib/mockData/agents";
import { prompts } from "@/lib/mockData/prompts";
import type { StatusTone } from "@/lib/workflowDisplay";
import type { PromptStatus } from "@/types/prompt";

export const metadata: Metadata = {
  title: "Prompt Registry",
  description: "Mock prompt registry with versioning and ownership metadata.",
};

const agentById = new Map(agents.map((agent) => [agent.id, agent]));

const promptLabels: Record<PromptStatus, string> = {
  active: "Active",
  deprecated: "Deprecated",
  draft: "Draft",
  review: "In review",
};

const promptTones: Record<PromptStatus, StatusTone> = {
  active: "success",
  deprecated: "neutral",
  draft: "info",
  review: "warning",
};

export default function PromptsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Prompt registry
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          Versioned prompts with owner agents and review status.
        </h1>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          Prompt content is represented as public-safe metadata only. The registry demonstrates
          ownership, versioning, evaluation links, and deprecation without exposing proprietary prompts.
        </p>

        <section className="mt-10 grid gap-5">
          {prompts.map((prompt) => {
            const owner = agentById.get(prompt.ownerAgentId);

            return (
              <article key={prompt.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {prompt.version}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{prompt.name}</h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{prompt.purpose}</p>
                  </div>
                  <StatusBadge label={promptLabels[prompt.status]} tone={promptTones[prompt.status]} />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <PromptField label="Owner agent" value={owner?.name ?? prompt.ownerAgentId} />
                  <PromptField label="Evaluation suite" value={prompt.evaluationSuiteId} />
                  <PromptField
                    label="Last reviewed"
                    value={new Date(prompt.lastReviewedAt).toLocaleDateString("en-GB", {
                      dateStyle: "medium",
                    })}
                  />
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-black p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Inputs
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {prompt.inputs.map((input) => (
                      <span key={input} className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300">
                        {input}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                  {prompt.safeBoundary}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
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
