export type PromptStatus = "draft" | "active" | "review" | "deprecated";

export type PromptDefinition = {
  id: string;
  name: string;
  version: string;
  ownerAgentId: string;
  status: PromptStatus;
  purpose: string;
  inputs: string[];
  evaluationSuiteId: string;
  lastReviewedAt: string;
  safeBoundary: string;
};
