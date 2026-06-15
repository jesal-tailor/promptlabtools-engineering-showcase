export type AgentRiskLevel = "low" | "medium" | "high";

export type RuntimeAgentId =
  | "planner_agent"
  | "drafting_agent"
  | "qa_agent"
  | "approval_agent";

export type AgentDefinition = {
  id: RuntimeAgentId;
  name: string;
  role: string;
  systemPrompt: string;
  allowedTools: string[];
  riskLevel: AgentRiskLevel;
  inputSchemaName: string;
  outputSchemaName: string;
};

export type AgentExecutionContext = {
  runId: string;
  campaignGoal: string;
  timestamp: string;
};

export type AgentTokenUsage = {
  promptTokens: number;
  completionTokens: number;
};

export type AgentOutputBase = {
  agentId: RuntimeAgentId;
  summary: string;
  tokens: AgentTokenUsage;
};

export type PlannerAgentOutput = AgentOutputBase & {
  agentId: "planner_agent";
  targetAudience: string;
  channels: string[];
  keyMessages: string[];
  acceptanceCriteria: string[];
};

export type DraftingAgentOutput = AgentOutputBase & {
  agentId: "drafting_agent";
  headline: string;
  body: string;
  callToAction: string;
  draftAssets: string[];
};

export type QaAgentOutput = AgentOutputBase & {
  agentId: "qa_agent";
  score: number;
  passed: boolean;
  findings: string[];
  recommendation: string;
};

export type ApprovalAgentOutput = AgentOutputBase & {
  agentId: "approval_agent";
  approvalRequired: true;
  gateId: string;
  reviewerRole: string;
  reason: string;
  riskLevel: "high";
};

export type RuntimeAgentOutput =
  | PlannerAgentOutput
  | DraftingAgentOutput
  | QaAgentOutput
  | ApprovalAgentOutput;

export function normaliseCampaignGoal(campaignGoal: string) {
  return campaignGoal.trim().replace(/\s+/g, " ");
}

export function createGoalSlug(campaignGoal: string) {
  return normaliseCampaignGoal(campaignGoal)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
