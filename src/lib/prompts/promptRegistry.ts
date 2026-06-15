import type { PromptRegistryEntry } from "@/lib/prompts/promptTypes";

export const promptRegistry: PromptRegistryEntry[] = [
  {
    id: "prompt_campaign_planner_v1",
    name: "Campaign Planner",
    version: "1.0.0-mock",
    ownerAgentId: "planner_agent",
    status: "deprecated",
    template:
      "Plan a public-safe campaign for {{campaignGoal}}. Audience: {{audience}}. Keep output mock-only.",
    variables: ["campaignGoal", "audience"],
    evaluationCriteria: ["specificity", "actionability", "governanceFit"],
    changeNotes: "Initial public-safe planner prompt. Replaced with clearer governance criteria.",
    createdAt: "2026-06-01T09:00:00.000Z",
    deprecatedAt: "2026-06-12T09:00:00.000Z",
    replacedByPromptId: "prompt_campaign_planner_v2",
  },
  {
    id: "prompt_campaign_planner_v2",
    name: "Campaign Planner",
    version: "2.0.0-mock",
    ownerAgentId: "planner_agent",
    status: "active",
    template:
      "Create a deterministic public-safe campaign plan for {{campaignGoal}}. Audience: {{audience}}. Include governance checkpoints, approval requirements, and mock-only boundaries.",
    variables: ["campaignGoal", "audience"],
    evaluationCriteria: ["specificity", "actionability", "risk", "governanceFit"],
    changeNotes: "Adds explicit governance checkpoints and risk criteria for Stage 5.",
    createdAt: "2026-06-12T09:00:00.000Z",
  },
  {
    id: "prompt_campaign_drafter_v1",
    name: "Campaign Drafter",
    version: "1.0.0-mock",
    ownerAgentId: "drafting_agent",
    status: "active",
    template:
      "Draft mock campaign copy for {{campaignGoal}} using tone {{tone}}. Include a clear CTA and public-safe disclaimer.",
    variables: ["campaignGoal", "tone"],
    evaluationCriteria: ["brandFit", "ctaClarity", "risk", "overallScore"],
    changeNotes: "First deterministic drafting prompt for public showcase copy.",
    createdAt: "2026-06-13T10:00:00.000Z",
  },
  {
    id: "prompt_campaign_qa_v1",
    name: "Campaign QA Rubric",
    version: "1.0.0-mock",
    ownerAgentId: "qa_agent",
    status: "active",
    template:
      "Evaluate {{outputType}} for accuracy, brand fit, specificity, actionability, risk, CTA clarity, governance fit, and overall score.",
    variables: ["outputType"],
    evaluationCriteria: [
      "accuracy",
      "brandFit",
      "specificity",
      "actionability",
      "risk",
      "ctaClarity",
      "governanceFit",
      "overallScore",
    ],
    changeNotes: "Stage 5 deterministic evaluation rubric prompt.",
    createdAt: "2026-06-14T11:00:00.000Z",
  },
  {
    id: "prompt_approval_governance_v1",
    name: "Approval Governance Summary",
    version: "1.0.0-mock",
    ownerAgentId: "approval_agent",
    status: "active",
    template:
      "Summarise approval requirement for {{actionName}} with risk {{riskLevel}} and reviewer context {{reviewerContext}}.",
    variables: ["actionName", "riskLevel", "reviewerContext"],
    evaluationCriteria: ["risk", "governanceFit", "actionability"],
    changeNotes: "Prompt for deterministic approval decision summaries.",
    createdAt: "2026-06-15T10:00:00.000Z",
  },
  {
    id: "prompt_campaign_drafter_v2_draft",
    name: "Campaign Drafter",
    version: "2.0.0-draft-mock",
    ownerAgentId: "drafting_agent",
    status: "draft",
    template:
      "Draft revised mock campaign copy for {{campaignGoal}} using tone {{tone}}. Emphasise evidence, governance fit, CTA clarity, and human feedback: {{humanFeedback}}.",
    variables: ["campaignGoal", "tone", "humanFeedback"],
    evaluationCriteria: ["brandFit", "specificity", "ctaClarity", "governanceFit", "overallScore"],
    changeNotes: "Draft candidate that incorporates human feedback summary.",
    createdAt: "2026-06-15T12:00:00.000Z",
  },
];

export function getPromptById(promptId: string): PromptRegistryEntry | undefined {
  return promptRegistry.find((prompt) => prompt.id === promptId);
}

export function getActivePromptForAgent(agentId: string): PromptRegistryEntry | undefined {
  return promptRegistry.find(
    (prompt) => prompt.ownerAgentId === agentId && prompt.status === "active",
  );
}
