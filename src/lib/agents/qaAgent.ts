import type {
  AgentDefinition,
  AgentExecutionContext,
  DraftingAgentOutput,
  PlannerAgentOutput,
  QaAgentOutput,
} from "@/lib/agents/agentTypes";
import { estimateAgentTokens } from "@/lib/observability/costEstimator";

export const qaAgent: AgentDefinition = {
  id: "qa_agent",
  name: "QA Agent",
  role: "Evaluates mock campaign artifacts for clarity, safety, and approval readiness.",
  systemPrompt:
    "Mock QA agent. Score deterministic fixture output against public-safety criteria. Do not call model providers.",
  allowedTools: ["mock_evaluation_runner", "mock_policy_check"],
  riskLevel: "low",
  inputSchemaName: "CampaignDraftOutput",
  outputSchemaName: "CampaignEvaluationOutput",
};

export function runQaAgent({
  context,
  draft,
  plan,
}: {
  context: AgentExecutionContext;
  draft: DraftingAgentOutput;
  plan: PlannerAgentOutput;
}): QaAgentOutput {
  const evidence = `${context.campaignGoal} ${draft.body} ${plan.acceptanceCriteria.join(" ")}`;
  const tokens = estimateAgentTokens(qaAgent.id, evidence);

  return {
    agentId: "qa_agent",
    summary: "Completed deterministic QA review for the mock campaign package.",
    score: 91,
    passed: true,
    findings: [
      "Campaign draft clearly labels all outputs as mock.",
      "No production webhook URL, credential, customer data, or private prompt is present.",
      "Approval gate remains required before publish package use.",
    ],
    recommendation: "Safe to route to human approval as a mock preview package.",
    tokens,
  };
}
