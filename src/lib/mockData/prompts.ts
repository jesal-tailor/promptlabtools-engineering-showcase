import type { PromptDefinition } from "@/types/prompt";

export const prompts: PromptDefinition[] = [
  {
    id: "prompt_lead_triage_v3",
    name: "Workflow Intake Triage",
    version: "3.0.0-mock",
    ownerAgentId: "agent_intake_orchestrator",
    status: "active",
    purpose:
      "Classify a mock workflow request and decide whether it should enter human review.",
    inputs: ["workflow_brief", "risk_flags", "requested_output"],
    evaluationSuiteId: "suite_triage_safety",
    lastReviewedAt: "2026-06-10T09:30:00.000Z",
    safeBoundary: "Uses synthetic request categories only; no real lead scoring rules.",
  },
  {
    id: "prompt_content_brief_v2",
    name: "Content Workflow Brief",
    version: "2.4.0-mock",
    ownerAgentId: "agent_prompt_curator",
    status: "review",
    purpose:
      "Turn a public-safe topic into a structured draft plan with acceptance criteria.",
    inputs: ["topic", "audience", "format", "review_criteria"],
    evaluationSuiteId: "suite_content_quality",
    lastReviewedAt: "2026-06-12T15:45:00.000Z",
    safeBoundary: "Contains placeholder content categories and no private funnel prompts.",
  },
  {
    id: "prompt_eval_rubric_v1",
    name: "Safety And Quality Rubric",
    version: "1.6.0-mock",
    ownerAgentId: "agent_eval_runner",
    status: "active",
    purpose:
      "Score mock outputs for clarity, structure, public safety, and approval readiness.",
    inputs: ["candidate_output", "policy_flags", "workflow_goal"],
    evaluationSuiteId: "suite_platform_readiness",
    lastReviewedAt: "2026-06-13T11:20:00.000Z",
    safeBoundary: "Scores sample outputs only and does not call an external model.",
  },
  {
    id: "prompt_approval_summary_v1",
    name: "Approval Summary",
    version: "1.1.0-mock",
    ownerAgentId: "agent_approval_coordinator",
    status: "draft",
    purpose:
      "Summarise why a human reviewer should approve, reject, or request changes.",
    inputs: ["run_trace", "risk_level", "evaluation_feedback"],
    evaluationSuiteId: "suite_approval_readiness",
    lastReviewedAt: "2026-06-14T08:00:00.000Z",
    safeBoundary: "Summaries are generated from fake trace data and fixture feedback.",
  },
  {
    id: "prompt_legacy_report_v0",
    name: "Legacy Weekly Report",
    version: "0.9.0-mock",
    ownerAgentId: "agent_trace_observer",
    status: "deprecated",
    purpose:
      "Historical sample prompt retained to demonstrate registry deprecation paths.",
    inputs: ["mock_activity_feed"],
    evaluationSuiteId: "suite_archive_visibility",
    lastReviewedAt: "2026-05-28T10:00:00.000Z",
    safeBoundary: "Archived sample only; not used by active mock workflow runs.",
  },
];
