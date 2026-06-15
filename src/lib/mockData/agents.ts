import type { AgentDefinition } from "@/types/agent";

export const agents: AgentDefinition[] = [
  {
    id: "agent_intake_orchestrator",
    name: "Intake Orchestrator",
    role: "Routes new workflow requests into safe reviewable run plans.",
    description:
      "Mock runtime that turns structured intake data into a run plan and review queue item.",
    runtimePattern: "Planner plus state-machine checkpoint",
    ownerTeam: "AI Platform",
    allowedToolIds: ["tool_context_lookup", "tool_prompt_compiler", "tool_mock_notify"],
    guardrails: [
      "No production lead scoring logic",
      "No external dispatch",
      "Human approval required before publish-like actions",
    ],
    status: "review_blocked",
  },
  {
    id: "agent_prompt_curator",
    name: "Prompt Curator",
    role: "Selects prompt templates and validates version metadata.",
    description:
      "Mock agent that demonstrates prompt registry ownership, versioning, and retirement paths.",
    runtimePattern: "Registry reader with policy checks",
    ownerTeam: "Prompt Ops",
    allowedToolIds: ["tool_context_lookup", "tool_prompt_compiler"],
    guardrails: [
      "Only public-safe placeholder prompt content",
      "Prompt changes require evaluation notes",
      "Deprecated versions remain visible for audit",
    ],
    status: "idle",
  },
  {
    id: "agent_eval_runner",
    name: "Evaluation Runner",
    role: "Scores mock outputs against rubric dimensions.",
    description:
      "Mock evaluation runtime for clarity, safety, structure, and approval readiness checks.",
    runtimePattern: "Deterministic rubric scoring",
    ownerTeam: "Quality Engineering",
    allowedToolIds: ["tool_eval_runner"],
    guardrails: [
      "Scores are sample data only",
      "No model provider calls",
      "Failures block downstream actions",
    ],
    status: "running",
  },
  {
    id: "agent_approval_coordinator",
    name: "Approval Coordinator",
    role: "Coordinates human-in-the-loop decisions for higher-risk workflow steps.",
    description:
      "Mock coordinator that records approval status before a workflow can continue.",
    runtimePattern: "Approval gate and audit trail",
    ownerTeam: "Operations",
    allowedToolIds: ["tool_mock_notify", "tool_mock_publish"],
    guardrails: [
      "High-risk tools require approval",
      "Rejected approvals terminate the mock run",
      "Decision notes are stored as fake sample data",
    ],
    status: "paused",
  },
  {
    id: "agent_trace_observer",
    name: "Trace Observer",
    role: "Summarises run activity for operator visibility.",
    description:
      "Mock observability agent that turns run traces into dashboard activity cards.",
    runtimePattern: "Trace summariser",
    ownerTeam: "Platform Observability",
    allowedToolIds: ["tool_context_lookup"],
    guardrails: [
      "Trace payloads are synthetic",
      "Token and cost estimates are illustrative",
      "No private logs or webhook payloads",
    ],
    status: "idle",
  },
];
