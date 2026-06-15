import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { getToolAuditEvents } from "@/lib/tools/toolAuditLog";

export const metadata: Metadata = {
  title: "Tool Audit Trail",
  description: "Mock public-safe tool execution audit events.",
};

export default function ToolAuditPage() {
  const auditEvents = getToolAuditEvents();

  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/tools" className="text-sm font-semibold text-amber-200 hover:text-amber-100">
          Back to tool registry
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
          Mock public-safe tool audit trail
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
          Tool calls are recorded as deterministic audit events.
        </h1>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          This audit trail demonstrates the shape of governance logging for agent tool calls.
          Events are in-memory mock records, not production audit logs.
        </p>

        <section className="mt-10 grid gap-4">
          {auditEvents.map((event) => (
            <article key={event.id} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {event.runId} / {event.stepId}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{event.toolId}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{event.message}</p>
                </div>
                <StatusBadge
                  label={event.status}
                  tone={event.status === "executed" ? "success" : event.status === "failed" ? "danger" : "warning"}
                />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <AuditField label="Agent" value={event.agentId} />
                <AuditField label="Risk" value={event.riskLevel} />
                <AuditField label="Approval" value={event.requiresApproval ? "Required" : "Not required"} />
                <AuditField
                  label="Created"
                  value={new Date(event.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
              </div>
              <p className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                {event.publicSafetyNote}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function AuditField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
}
