import type {
  AgentDefinition,
  AgentExecutionContext,
  DraftingAgentOutput,
  PlannerAgentOutput,
} from "@/lib/agents/agentTypes";
import { normaliseCampaignGoal } from "@/lib/agents/agentTypes";
import { estimateAgentTokens } from "@/lib/observability/costEstimator";

export const draftingAgent: AgentDefinition = {
  id: "drafting_agent",
  name: "Drafting Agent",
  role: "Creates a deterministic mock campaign draft from the approved plan shape.",
  systemPrompt:
    "Mock drafting agent. Create fixture-quality copy from the plan. Do not generate private PromptLabTools campaign logic.",
  allowedTools: ["mock_prompt_compiler", "mock_copy_template"],
  riskLevel: "medium",
  inputSchemaName: "CampaignPlanOutput",
  outputSchemaName: "CampaignDraftOutput",
};

export function runDraftingAgent({
  context,
  plan,
}: {
  context: AgentExecutionContext;
  plan: PlannerAgentOutput;
}): DraftingAgentOutput {
  const goal = normaliseCampaignGoal(context.campaignGoal);
  const tokens = estimateAgentTokens(draftingAgent.id, `${goal} ${plan.keyMessages.join(" ")}`);

  return {
    agentId: "drafting_agent",
    summary: "Created a mock campaign draft from the planner output.",
    headline: "AI workflow control plane demo package",
    body: [
      `Campaign goal: ${goal}.`,
      "This draft explains a public-safe workflow runtime with deterministic agents, trace events, evaluations, and approval gates.",
      "No external services, real prompts, private customer data, or production automations are used.",
    ].join(" "),
    callToAction: "Review the mock runtime result before any publish-like action.",
    draftAssets: [
      "Dashboard summary card copy",
      "Workflow trace walkthrough copy",
      "Approval gate reviewer note",
    ],
    tokens,
  };
}
