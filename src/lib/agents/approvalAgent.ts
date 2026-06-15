import type {
  AgentDefinition,
  AgentExecutionContext,
  ApprovalAgentOutput,
  DraftingAgentOutput,
  QaAgentOutput,
} from "@/lib/agents/agentTypes";
import { createGoalSlug } from "@/lib/agents/agentTypes";
import { estimateAgentTokens } from "@/lib/observability/costEstimator";

export const approvalAgent: AgentDefinition = {
  id: "approval_agent",
  name: "Approval Agent",
  role: "Creates the human approval gate for higher-risk publish-like workflow steps.",
  systemPrompt:
    "Mock approval agent. Require human review before any publish-like action. Produce deterministic approval metadata only.",
  allowedTools: ["mock_approval_queue"],
  riskLevel: "high",
  inputSchemaName: "CampaignEvaluationOutput",
  outputSchemaName: "ApprovalGateOutput",
};

export function runApprovalAgent({
  context,
  draft,
  evaluation,
}: {
  context: AgentExecutionContext;
  draft: DraftingAgentOutput;
  evaluation: QaAgentOutput;
}): ApprovalAgentOutput {
  const tokens = estimateAgentTokens(approvalAgent.id, `${draft.headline} ${evaluation.recommendation}`);

  return {
    agentId: "approval_agent",
    summary: "Created a required human approval gate before the mock publish package.",
    approvalRequired: true,
    gateId: `gate_${createGoalSlug(context.campaignGoal) || "campaign"}_publish`,
    reviewerRole: "Human operator",
    reason:
      "The workflow includes a publish-like package, so the mock runtime requires human approval before use.",
    riskLevel: "high",
    tokens,
  };
}
