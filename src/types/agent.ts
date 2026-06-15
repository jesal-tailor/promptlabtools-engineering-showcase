export type AgentRuntimeStatus = "idle" | "running" | "review_blocked" | "paused";

export type AgentDefinition = {
  id: string;
  name: string;
  role: string;
  description: string;
  runtimePattern: string;
  ownerTeam: string;
  allowedToolIds: string[];
  guardrails: string[];
  status: AgentRuntimeStatus;
};
