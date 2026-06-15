export type WorkflowState =
  | "captured"
  | "qualified"
  | "queued_for_review"
  | "approved"
  | "scheduled"
  | "completed";

export type WorkflowEventType =
  | "lead_captured"
  | "lead_qualified"
  | "workflow_queued"
  | "human_review_required"
  | "workflow_approved"
  | "workflow_scheduled"
  | "workflow_completed";

export type ShowcaseLead = {
  id: string;
  name: string;
  email: string;
  role: string;
  useCase: string;
  consent: true;
  source: "engineering-showcase";
  submittedAt: string;
};

export type WorkflowEvent = {
  id: string;
  type: WorkflowEventType;
  leadId: string;
  state: WorkflowState;
  createdAt: string;
  payload: Record<string, string | boolean | number>;
};

export type MockDispatchResult = {
  accepted: boolean;
  destination: "mock://workflow-intake";
  eventsAccepted: number;
  externalCallMade: false;
};

export type WorkflowRunStatus =
  | "queued"
  | "running"
  | "waiting_for_approval"
  | "needs_changes"
  | "completed"
  | "failed";

export type WorkflowRunPriority = "low" | "medium" | "high";

export type TraceStepStatus = "completed" | "running" | "waiting" | "blocked" | "skipped";

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
};

export type WorkflowTraceStep = {
  id: string;
  name: string;
  agentId: string;
  toolIds: string[];
  status: TraceStepStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  summary: string;
  inputArtifact: string;
  outputArtifact: string;
  approvalId?: string;
  tokens: TokenUsage;
  costUsdEstimate: number;
};

export type WorkflowRunMetrics = TokenUsage & {
  estimatedCostUsd: number;
};

export type WorkflowRun = {
  id: string;
  workflowKey: string;
  title: string;
  description: string;
  status: WorkflowRunStatus;
  priority: WorkflowRunPriority;
  owner: string;
  createdAt: string;
  updatedAt: string;
  agentIds: string[];
  promptIds: string[];
  toolIds: string[];
  approvalIds: string[];
  evaluationIds: string[];
  metrics: WorkflowRunMetrics;
  publicSafetyNote: string;
  trace: WorkflowTraceStep[];
};
