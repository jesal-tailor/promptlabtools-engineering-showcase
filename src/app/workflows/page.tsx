import type { Metadata } from "next";
import { WorkflowCard } from "@/components/WorkflowCard";

export const metadata: Metadata = {
  title: "Workflow Examples",
  description: "Safe public examples of AI-assisted workflow orchestration patterns.",
};

const workflows = [
  {
    title: "Lead Capture → Human Review",
    description:
      "A simplified lead intake flow that validates inputs, creates an event payload, and queues the workflow for manual review before any automation runs.",
    inputs: ["Form submission", "Consent flag", "Role / workflow need", "Honeypot field"],
    outputs: ["lead_captured event", "workflow_queued event", "Human-review queue state"],
  },
  {
    title: "Prompt Workflow Template",
    description:
      "A conceptual workflow for turning a repeatable content operation into structured prompts, review checkpoints, and output states.",
    inputs: ["Topic brief", "Audience context", "Output requirements", "Review criteria"],
    outputs: ["Draft workflow run", "Evaluation notes", "Approval state", "Publishing-ready output"],
  },
  {
    title: "Operator Report Loop",
    description:
      "A mocked reporting workflow that shows how signals could become a weekly briefing without exposing private analytics or customer data.",
    inputs: ["Anonymised activity signals", "Review cadence", "Decision criteria"],
    outputs: ["Briefing event", "Review notes", "Next-action backlog"],
  },
];

export default function WorkflowsPage() {
  return (
    <main className="bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Workflow orchestration</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Safe examples of AI-native workflow thinking.
        </h1>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          These examples are intentionally simplified. They demonstrate event design, state transitions, and human-in-the-loop patterns without exposing private PromptLabTools funnel logic or production integrations.
        </p>

        <div className="mt-10 grid gap-6">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.title} {...workflow} />
          ))}
        </div>
      </div>
    </main>
  );
}
