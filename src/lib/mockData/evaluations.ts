import type { EvaluationResult } from "@/types/evaluation";

export const evaluations: EvaluationResult[] = [
  {
    id: "eval_run_101_triage",
    runId: "run_101",
    promptId: "prompt_lead_triage_v3",
    suiteName: "Triage Safety Suite",
    score: 86,
    maxScore: 100,
    status: "warning",
    feedback:
      "Good structure and safety labelling. Approval summary should call out the high-risk mock publish tool.",
    checkedAt: "2026-06-15T08:12:00.000Z",
    dimensions: [
      { name: "Public safety", score: 92, notes: "No production data or URLs present." },
      { name: "Traceability", score: 88, notes: "Run steps link to agents, prompts, and tools." },
      { name: "Approval readiness", score: 78, notes: "Needs a stronger publish gate summary." },
    ],
  },
  {
    id: "eval_run_102_content",
    runId: "run_102",
    promptId: "prompt_content_brief_v2",
    suiteName: "Content Quality Suite",
    score: 94,
    maxScore: 100,
    status: "passed",
    feedback:
      "Output is concise, reviewable, and clearly labelled as a mock workflow artifact.",
    checkedAt: "2026-06-14T15:08:00.000Z",
    dimensions: [
      { name: "Clarity", score: 95, notes: "Operator action is easy to understand." },
      { name: "Structure", score: 96, notes: "Inputs, outputs, and handoff state are explicit." },
      { name: "Safety", score: 91, notes: "Sample payloads remain public-safe." },
    ],
  },
  {
    id: "eval_run_103_prompt",
    runId: "run_103",
    promptId: "prompt_approval_summary_v1",
    suiteName: "Approval Readiness Suite",
    score: 72,
    maxScore: 100,
    status: "warning",
    feedback:
      "Reviewer can understand the intent, but the public-safe boundary needs to be more prominent.",
    checkedAt: "2026-06-14T11:52:00.000Z",
    dimensions: [
      { name: "Reviewer context", score: 80, notes: "Reason for approval is visible." },
      { name: "Boundary clarity", score: 62, notes: "Needs an explicit mock-only statement." },
      { name: "Actionability", score: 74, notes: "Change request is clear enough to route." },
    ],
  },
  {
    id: "eval_run_104_publish",
    runId: "run_104",
    promptId: "prompt_eval_rubric_v1",
    suiteName: "Platform Readiness Suite",
    score: 61,
    maxScore: 100,
    status: "failed",
    feedback:
      "The run demonstrates fail-closed behaviour because evaluation feedback was unresolved before publish.",
    checkedAt: "2026-06-13T17:01:00.000Z",
    dimensions: [
      { name: "Sequence control", score: 55, notes: "Publish step came too early." },
      { name: "Safety", score: 78, notes: "No real integrations were called." },
      { name: "Operator confidence", score: 50, notes: "Human reviewer should reject this run." },
    ],
  },
];
