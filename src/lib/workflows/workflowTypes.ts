import type {
  ApprovalDecision,
  ApprovalDecisionPayload,
  ApprovalDecisionResult,
  ApprovalWorkflowAction,
} from "@/lib/approvals/approvalTypes";
import type {
  ApprovalAgentOutput,
  DraftingAgentOutput,
  PlannerAgentOutput,
  QaAgentOutput,
  RuntimeAgentId,
} from "@/lib/agents/agentTypes";
import type { MockCostEstimate } from "@/lib/observability/costEstimator";
import type { RuntimeTraceEvent } from "@/lib/observability/traceEvents";
import type { ToolCall } from "@/lib/tools/toolTypes";

export type CampaignWorkflowTemplateId = "campaign_publish_package";

export type CampaignWorkflowStepId =
  | "planner_agent"
  | "drafting_agent"
  | "qa_agent"
  | "approval_gate"
  | "publish_package";

export type CampaignWorkflowRunStatus = "completed";

export type CampaignWorkflowContinuationStatus =
  | "completed"
  | "stopped"
  | "returned_to_drafting";

export type CampaignWorkflowStepStatus = "completed" | "approval_required";

export type CampaignWorkflowInput = {
  campaignGoal: string;
};

export type WorkflowTemplateStep = {
  id: CampaignWorkflowStepId;
  name: string;
  description: string;
  agentId?: RuntimeAgentId;
  requiresApprovalBeforeNextStep: boolean;
};

export type WorkflowTemplate = {
  id: CampaignWorkflowTemplateId;
  name: string;
  description: string;
  steps: WorkflowTemplateStep[];
};

export type CampaignWorkflowStepResult = {
  id: CampaignWorkflowStepId;
  name: string;
  status: CampaignWorkflowStepStatus;
  agentId?: RuntimeAgentId;
  outputSummary: string;
};

export type CampaignWorkflowAgentOutputs = {
  planner: PlannerAgentOutput;
  drafting: DraftingAgentOutput;
  qa: QaAgentOutput;
  approval: ApprovalAgentOutput;
};

export type CampaignApprovalRequirement = {
  required: true;
  gateId: string;
  status: "required_before_publish";
  reviewerRole: string;
  reason: string;
};

export type CampaignPublishPackage = {
  id: string;
  title: string;
  campaignGoal: string;
  headline: string;
  body: string;
  callToAction: string;
  qualityScore: number;
  approvalGateId: string;
  approvalRequiredBeforeUse: true;
  mockDestination: "mock://publish-package-preview";
  publicSafetyNote: string;
};

export type CampaignEvaluationSummary = {
  score: number;
  passed: boolean;
  recommendation: string;
  findings: string[];
  cost: MockCostEstimate;
};

export type CampaignWorkflowRunResult = {
  runId: string;
  templateId: CampaignWorkflowTemplateId;
  status: CampaignWorkflowRunStatus;
  campaignGoal: string;
  orderedSteps: CampaignWorkflowStepResult[];
  agentOutputs: CampaignWorkflowAgentOutputs;
  approvalRequirement: CampaignApprovalRequirement;
  finalPublishPackage: CampaignPublishPackage;
  toolCalls: ToolCall[];
  traceEvents: RuntimeTraceEvent[];
  evaluationSummary: CampaignEvaluationSummary;
  publicSafetyNote: string;
};

export type CampaignWorkflowApprovalDecisionInput = CampaignWorkflowInput & {
  approvalDecision: ApprovalDecision;
  reviewerComment: string;
  decidedBy: string;
  decidedAt?: string;
  runStartedAt?: string;
};

export type CampaignWorkflowContinuationResult = Omit<
  CampaignWorkflowRunResult,
  "finalPublishPackage" | "status"
> & {
  status: CampaignWorkflowContinuationStatus;
  approvalDecisionPayload: ApprovalDecisionPayload;
  approvalDecisionResult: ApprovalDecisionResult;
  workflowAction: ApprovalWorkflowAction;
  finalPublishPackage: CampaignPublishPackage | null;
  revisionInstruction?: string;
};
