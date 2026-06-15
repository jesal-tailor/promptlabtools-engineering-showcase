import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { executeToolCall } from "@/lib/tools/toolExecutor";
import { explainToolPermissionDecision } from "@/lib/tools/toolPermissions";
import { getToolById, toolRegistry } from "@/lib/tools/toolRegistry";
import type { ToolRiskLevel } from "@/lib/tools/toolTypes";
import type { StatusTone } from "@/lib/workflowDisplay";

type ToolDetailPageProps = {
  params: Promise<{ toolId: string }>;
};

const riskTones: Record<ToolRiskLevel, StatusTone> = {
  high: "danger",
  low: "success",
  medium: "warning",
};

const samplePayloadByToolId: Record<string, Record<string, string>> = {
  create_mock_github_issue: {
    body: "Mock governance follow-up.",
    title: "Mock issue",
  },
  create_mock_publish_package: {
    body: "Mock body",
    headline: "Mock headline",
    title: "Mock package",
  },
  fetch_mock_metrics: {
    metricScope: "showcase",
  },
  generate_mock_utm_url: {
    campaign: "Launch a public-safe showcase",
    medium: "mock-workflow",
    source: "promptlabtools-showcase",
  },
  score_content_quality: {
    content: "Mock public-safe content with approval review and clear CTA.",
  },
  send_mock_webhook: {
    eventName: "mock.event",
  },
  write_mock_markdown_artifact: {
    body: "Mock markdown body.",
    title: "Mock markdown artifact",
  },
};

export function generateStaticParams() {
  return toolRegistry.map((tool) => ({ toolId: tool.id }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getToolById(toolId);

  return {
    title: tool ? `${tool.name} Tool` : "Tool Detail",
    description: tool?.description ?? "Mock tool sandbox detail.",
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) {
    notFound();
  }

  const sampleAgentId = tool.allowedAgentIds[0];
  const unapprovedSample = executeToolCall({
    agentId: sampleAgentId,
    inputPayload: samplePayloadByToolId[tool.id] ?? {},
    runId: `mock_run_tool_detail_${tool.id}`,
    stepId: "tool_detail",
    toolId: tool.id,
  });
  const approvedSample = executeToolCall({
    agentId: sampleAgentId,
    approved: true,
    inputPayload: samplePayloadByToolId[tool.id] ?? {},
    runId: `mock_run_tool_detail_${tool.id}`,
    stepId: "tool_detail",
    toolId: tool.id,
  });

  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/tools" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to tool registry
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {tool.id} / {tool.adapterType} adapter
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                {tool.name}
              </h1>
              <p className="mt-5 max-w-4xl leading-8 text-zinc-400">{tool.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={`${tool.riskLevel} risk`} tone={riskTones[tool.riskLevel]} />
              <StatusBadge label={tool.enabled ? "Enabled" : "Disabled"} tone={tool.enabled ? "success" : "danger"} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <ToolDetailStat label="Action" value={tool.actionName} />
            <ToolDetailStat label="Approval" value={tool.requiresApproval ? "Required" : "Not required"} />
            <ToolDetailStat label="Input schema" value={tool.inputSchemaName} />
            <ToolDetailStat label="Output schema" value={tool.outputSchemaName} />
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Permission decisions
            </p>
            <div className="mt-5 grid gap-3">
              {agentRegistry.map((agent) => {
                const decision = explainToolPermissionDecision(agent.id, tool.id);

                return (
                  <article key={agent.id} className="rounded-2xl border border-white/10 bg-black p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{decision.message}</p>
                      </div>
                      <StatusBadge
                        label={decision.ok ? decision.decision : decision.error.code}
                        tone={decision.ok ? "success" : "warning"}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="grid gap-6">
            <ExecutionPanel title="Unapproved sample" status={unapprovedSample.toolCall.status} message={unapprovedSample.error?.message ?? "Executed through mock adapter."} />
            <ExecutionPanel title="Approved sample" status={approvedSample.toolCall.status} message={approvedSample.error?.message ?? approvedSample.toolCall.outputPayload?.publicSafetyNote?.toString() ?? "Executed through mock adapter."} />
            <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                API contract
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                `POST /api/tools/execute` validates run, step, agent, tool, payload, and approval
                state before returning an executed, blocked, or failed tool call result.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ToolDetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}

function ExecutionPanel({
  message,
  status,
  title,
}: {
  message: string;
  status: string;
  title: string;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{status}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{message}</p>
    </section>
  );
}
