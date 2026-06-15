import type { ToolDefinition } from "@/types/tool";

export const tools: ToolDefinition[] = [
  {
    id: "tool_context_lookup",
    name: "Mock Context Lookup",
    category: "retrieval",
    description:
      "Returns public-safe sample context from local fixtures instead of private knowledge bases.",
    allowedAgentIds: [
      "agent_intake_orchestrator",
      "agent_prompt_curator",
      "agent_trace_observer",
    ],
    riskLevel: "low",
    approvalRequired: false,
    mockedIntegration: true,
    safeDestination: "mock://context-store",
  },
  {
    id: "tool_prompt_compiler",
    name: "Prompt Compiler",
    category: "planning",
    description:
      "Combines prompt metadata and sample inputs into a reviewable prompt packet.",
    allowedAgentIds: ["agent_intake_orchestrator", "agent_prompt_curator"],
    riskLevel: "medium",
    approvalRequired: false,
    mockedIntegration: true,
    safeDestination: "mock://prompt-registry",
  },
  {
    id: "tool_eval_runner",
    name: "Evaluation Runner",
    category: "evaluation",
    description:
      "Applies deterministic sample rubrics to mock agent outputs and records feedback.",
    allowedAgentIds: ["agent_eval_runner"],
    riskLevel: "medium",
    approvalRequired: false,
    mockedIntegration: true,
    safeDestination: "mock://evaluation-engine",
  },
  {
    id: "tool_mock_notify",
    name: "Mock Operator Notification",
    category: "notification",
    description:
      "Creates a fake operator notification record without sending email, Slack, or webhook calls.",
    allowedAgentIds: ["agent_intake_orchestrator", "agent_approval_coordinator"],
    riskLevel: "medium",
    approvalRequired: true,
    mockedIntegration: true,
    safeDestination: "mock://operator-notifications",
  },
  {
    id: "tool_mock_publish",
    name: "Mock Publish Action",
    category: "publishing",
    description:
      "Represents a publish-like downstream action. It is blocked unless approval is recorded.",
    allowedAgentIds: ["agent_approval_coordinator"],
    riskLevel: "high",
    approvalRequired: true,
    mockedIntegration: true,
    safeDestination: "mock://publish-sandbox",
  },
];
