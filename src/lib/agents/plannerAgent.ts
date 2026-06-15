import type { AgentDefinition, AgentExecutionContext, PlannerAgentOutput } from "@/lib/agents/agentTypes";
import { normaliseCampaignGoal } from "@/lib/agents/agentTypes";
import { estimateAgentTokens } from "@/lib/observability/costEstimator";

export const plannerAgent: AgentDefinition = {
  id: "planner_agent",
  name: "Planner Agent",
  role: "Turns a campaign goal into a safe campaign execution plan.",
  systemPrompt:
    "Mock planner. Produce deterministic campaign planning metadata from public-safe input only. Do not call external systems.",
  allowedTools: ["mock_context_lookup", "mock_campaign_brief_builder"],
  riskLevel: "medium",
  inputSchemaName: "CampaignGoalInput",
  outputSchemaName: "CampaignPlanOutput",
};

export function runPlannerAgent(context: AgentExecutionContext): PlannerAgentOutput {
  const goal = normaliseCampaignGoal(context.campaignGoal);
  const tokens = estimateAgentTokens(plannerAgent.id, goal);

  return {
    agentId: "planner_agent",
    summary: `Prepared a mock campaign plan for: ${goal}`,
    targetAudience: "Public showcase reviewers and AI platform engineering hiring teams",
    channels: ["demo_dashboard", "technical_walkthrough", "mock_operator_brief"],
    keyMessages: [
      `Goal: ${goal}`,
      "The workflow uses deterministic mock agents and no production integrations.",
      "Human approval is required before the publish package can be treated as approved.",
    ],
    acceptanceCriteria: [
      "Every artifact is labelled mock and public-safe.",
      "Evaluation feedback is generated before the approval gate.",
      "The final package remains preview-only until approved by a human reviewer.",
    ],
    tokens,
  };
}
