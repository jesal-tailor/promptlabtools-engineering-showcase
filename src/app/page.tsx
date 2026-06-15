import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

const proofPoints = [
  "Typed workflow events, state transitions, and run traces",
  "Agent runtime, prompt registry, and tool registry fixtures",
  "Evaluation scores and human-in-the-loop approval gates",
  "Mock lead-capture API with validation and honeypot handling",
  "Next.js App Router, React, TypeScript, and Tailwind CSS",
  "CI quality gates for lint, typecheck, tests, and build",
  "Public-safe docs that avoid private product logic and secrets",
];

const qualityGates = ["npm run lint", "npm run typecheck", "npm run test", "npm run build", "npm run check"];

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_34%),linear-gradient(180deg,#09090b,#000)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-28">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              AI Platform Engineering Proof of Work
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]">
              A public engineering showcase for AI-assisted workflow systems.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              This repo demonstrates safe, simplified PromptLabTools engineering patterns: platform architecture, API route design, workflow orchestration, lead-capture automation, and CI/CD quality gates.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard" className="rounded-full bg-amber-300 px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-amber-200">
                Open control-plane dashboard
              </Link>
              <Link href="/workflows" className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                View workflow runs
              </Link>
              <Link href="/tools" className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Inspect tools
              </Link>
            </div>
          </div>
          <ArchitectureDiagram />
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">What this demonstrates</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point} className="rounded-3xl border border-white/10 bg-zinc-950 p-5 text-sm leading-6 text-zinc-300">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Mock API route</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Try the showcase lead flow.</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              The form posts to `/api/showcase-lead`, validates input, creates typed workflow events, queues a human-review state, and returns JSON. No external services are called.
            </p>
          </div>

          <form action="/api/showcase-lead" method="POST" className="rounded-[2rem] border border-white/10 bg-black p-6">
            <div className="hidden" aria-hidden="true" hidden>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-zinc-300">Name</span>
                <input name="name" required className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" placeholder="Alex Operator" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-zinc-300">Email</span>
                <input name="email" required type="email" className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" placeholder="alex@example.com" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-zinc-300">Role / interest</span>
              <input name="role" required className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" placeholder="Platform Engineering / AI Workflows" />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-zinc-300">Workflow use case</span>
              <textarea name="useCase" required rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-amber-300" placeholder="I want to turn repeatable content operations into an AI-assisted workflow with review steps." />
            </label>
            <label className="mt-4 flex gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
              <input type="checkbox" name="consent" value="true" required className="mt-1 accent-amber-300" />
              <span>I understand this is a mock showcase flow and no external service will be called.</span>
            </label>
            <button type="submit" className="mt-5 w-full rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-black transition hover:bg-amber-200">
              Submit mock workflow event
            </button>
          </form>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Quality gates</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {qualityGates.map((gate) => (
              <code key={gate} className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-sm text-zinc-300">
                {gate}
              </code>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
