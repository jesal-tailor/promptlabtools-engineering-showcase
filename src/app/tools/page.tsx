import type { Metadata } from "next";
import { StatusBadge } from "@/components/StatusBadge";
import { agents } from "@/lib/mockData/agents";
import { tools } from "@/lib/mockData/tools";
import type { StatusTone } from "@/lib/workflowDisplay";
import type { ToolRiskLevel } from "@/types/tool";

export const metadata: Metadata = {
  title: "Tool Registry",
  description: "Mock tool registry with agent permissions and risk levels.",
};

const agentById = new Map(agents.map((agent) => [agent.id, agent]));

const riskTones: Record<ToolRiskLevel, StatusTone> = {
  high: "danger",
  low: "success",
  medium: "warning",
};

export default function ToolsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Tool registry
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          Agent tool access, risk levels, and approval requirements.
        </h1>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          Every tool is a mock integration with a mock:// destination. This models platform governance
          without exposing real webhooks, credentials, or production automation scripts.
        </p>

        <section className="mt-10 grid gap-6">
          {tools.map((tool) => {
            const allowedAgents = tool.allowedAgentIds.map((agentId) => agentById.get(agentId)?.name ?? agentId);

            return (
              <article key={tool.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {tool.category} / {tool.safeDestination}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{tool.name}</h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{tool.description}</p>
                  </div>
                  <StatusBadge label={`${tool.riskLevel} risk`} tone={riskTones[tool.riskLevel]} />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
                  <div className="rounded-3xl border border-white/10 bg-black p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Allowed agents
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {allowedAgents.map((agentName) => (
                        <span
                          key={agentName}
                          className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300"
                        >
                          {agentName}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Approval required
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {tool.approvalRequired ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
