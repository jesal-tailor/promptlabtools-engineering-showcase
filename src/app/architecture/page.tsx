import type { Metadata } from "next";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Public-safe architecture notes for the PromptLabTools engineering showcase.",
};

const layers = [
  ["Frontend", "Next.js App Router pages for showcase, workflow examples, and architecture notes."],
  ["API", "A mock lead-capture route that validates input, handles honeypot spam fields, and creates typed events."],
  ["Workflow layer", "Small orchestration primitives for state transitions and event creation."],
  ["Automation boundary", "Mock dispatch only. Production webhooks, credentials, and business logic are intentionally excluded."],
  ["Quality gates", "ESLint, TypeScript, Vitest, build validation, and GitHub Actions CI."],
];

export default function ArchitecturePage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Architecture</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Simple first, production-aware by design.
          </h1>
          <p className="mt-5 leading-8 text-zinc-400">
            The showcase models the outer shape of an AI workflow platform: frontend product surfaces, API boundaries, event payloads, workflow states, and human review. Private product logic remains outside this repo.
          </p>
          <div className="mt-8 grid gap-4">
            {layers.map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
                <h2 className="font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <ArchitectureDiagram />
      </div>
    </main>
  );
}
