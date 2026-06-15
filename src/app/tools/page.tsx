import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { executeToolCall } from "@/lib/tools/toolExecutor";
import { toolRegistry } from "@/lib/tools/toolRegistry";
import type { ToolRiskLevel } from "@/lib/tools/toolTypes";
import type { StatusTone } from "@/lib/workflowDisplay";

export const metadata: Metadata = {
  title: "Tool Registry",
  description: "Mock public-safe tool execution sandbox with adapter boundaries.",
};

const agentNameById = new Map<string, string>(agentRegistry.map((agent) => [agent.id, agent.name]));

const riskTones: Record<ToolRiskLevel, StatusTone> = {
  high: "danger",
  low: "success",
  medium: "warning",
};

const enabledToolCount = toolRegistry.filter((tool) => tool.enabled).length;
const approvalRequiredCount = toolRegistry.filter((tool) => tool.requiresApproval).length;
const sampleAllowedExecution = executeToolCall({
  agentId: "qa_agent",
  inputPayload: {
    content: "Mock public-safe content with approval review and clear CTA.",
  },
  runId: "mock_run_tool_sandbox_demo",
  stepId: "qa_agent",
  toolId: "score_content_quality",
});
const sampleBlockedExecution = executeToolCall({
  agentId: "approval_agent",
  inputPayload: {
    body: "Mock package body.",
    headline: "Mock headline",
    title: "Mock package",
  },
  runId: "mock_run_tool_sandbox_demo",
  stepId: "publish_package",
  toolId: "create_mock_publish_package",
});

export default function ToolsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Mock public-safe tool execution sandbox
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              Agent tool access with permissions, adapter boundaries, and audit events.
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
              Agents can request tool actions only through this controlled mock executor. Every
              adapter is deterministic, uses local data only, and clearly labels blocked or executed
              outcomes without touching real APIs, files, webhooks, GitHub, or publishing systems.
            </p>
          </div>
          <Link
            href="/tools/audit"
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View tool audit trail
          </Link>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          <ToolMetric label="Registered tools" value={toolRegistry.length.toString()} detail="All adapterType=mock" />
          <ToolMetric label="Enabled tools" value={enabledToolCount.toString()} detail="Disabled tools fail closed" />
          <ToolMetric label="Approval gates" value={approvalRequiredCount.toString()} detail="High-risk tools blocked" />
          <ToolMetric label="Sample blocked" value={sampleBlockedExecution.toolCall.status} detail={sampleBlockedExecution.error?.code ?? "n/a"} />
        </section>

        <section className="mt-10 grid gap-6 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 lg:grid-cols-2">
          <ExecutionExample title="Allowed low/medium-risk execution" resultStatus={sampleAllowedExecution.toolCall.status} detail={sampleAllowedExecution.toolCall.outputPayload?.feedback?.toString() ?? "Executed through mock adapter."} />
          <ExecutionExample title="Blocked high-risk execution" resultStatus={sampleBlockedExecution.toolCall.status} detail={sampleBlockedExecution.error?.message ?? "Blocked before execution."} />
        </section>

        <section className="mt-10 grid gap-6">
          {toolRegistry.map((tool) => {
            const allowedAgents = tool.allowedAgentIds.map((agentId) => agentNameById.get(agentId) ?? agentId);

            return (
              <article key={tool.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {tool.actionName} / {tool.adapterType} adapter
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{tool.name}</h2>
                    <p className="mt-3 max-w-4xl leading-7 text-zinc-400">{tool.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={`${tool.riskLevel} risk`} tone={riskTones[tool.riskLevel]} />
                    <StatusBadge label={tool.enabled ? "Enabled" : "Disabled"} tone={tool.enabled ? "success" : "danger"} />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
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
                  <ToolField label="Approval required" value={tool.requiresApproval ? "Yes" : "No"} />
                  <ToolField label="Schemas" value={`${tool.inputSchemaName} -> ${tool.outputSchemaName}`} />
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-zinc-500">
                    Mock-only adapter boundary. No production PromptLabTools automation is present.
                  </p>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="rounded-full bg-amber-300 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200"
                  >
                    Inspect tool
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

function ToolMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
    </article>
  );
}

function ToolField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}

function ExecutionExample({
  detail,
  resultStatus,
  title,
}: {
  detail: string;
  resultStatus: string;
  title: string;
}) {
  return (
    <article className="rounded-3xl border border-amber-300/20 bg-black p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
        Sample execution
      </p>
      <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-amber-100">{detail}</p>
      <p className="mt-4 text-sm font-semibold text-white">Status: {resultStatus}</p>
    </article>
  );
}
