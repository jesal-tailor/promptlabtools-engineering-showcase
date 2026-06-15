export type ToolRiskLevel = "low" | "medium" | "high";

export type ToolCategory = "retrieval" | "planning" | "evaluation" | "notification" | "publishing";

export type ToolDefinition = {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  allowedAgentIds: string[];
  riskLevel: ToolRiskLevel;
  approvalRequired: boolean;
  mockedIntegration: true;
  safeDestination: `mock://${string}`;
};
