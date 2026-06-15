import type { ApprovalStatus as GovernanceApprovalStatus } from "@/lib/approvals/approvalTypes";
import type { EvaluationRun } from "@/lib/evaluations/evaluationTypes";
import type { PromptRegistryEntry } from "@/lib/prompts/promptTypes";
import type { JsonObject, ToolCall, ToolRiskLevel } from "@/lib/tools/toolTypes";
import type { WorkflowRunStatus } from "@/types/workflow";

export type RepositoryAdapterType = "memory";

export type RepositoryErrorCode = "not_found" | "invalid_input";

export type RepositoryError = {
  code: RepositoryErrorCode;
  message: string;
  publicSafetyNote: string;
};

export type RepositoryResult<T> =
  | {
      ok: true;
      record: T;
    }
  | {
      ok: false;
      error: RepositoryError;
    };

export type PublicSafeRepositoryMetadata = {
  adapterType: RepositoryAdapterType;
  publicSafetyNote: string;
};

export type StoredWorkflowRun = {
  id: string;
  title: string;
  status: WorkflowRunStatus | "runtime_completed";
  source: "fixture" | "runtime";
  createdAt: string;
  updatedAt: string;
  publicSafetyNote: string;
};

export type StoredWorkflowStepEvent = {
  id: string;
  runId: string;
  sequence: number;
  eventType: string;
  stepId?: string;
  agentId?: string;
  message: string;
  createdAt: string;
  metadata: JsonObject;
  publicSafetyNote: string;
};

export type WorkflowRunCreateInput = Omit<StoredWorkflowRun, "publicSafetyNote" | "updatedAt"> & {
  publicSafetyNote?: string;
  updatedAt?: string;
};

export type WorkflowRunUpdateInput = Partial<
  Pick<StoredWorkflowRun, "title" | "status" | "updatedAt" | "publicSafetyNote">
>;

export type WorkflowStepEventInput = Omit<StoredWorkflowStepEvent, "publicSafetyNote"> & {
  publicSafetyNote?: string;
};

export type WorkflowRunRepository = PublicSafeRepositoryMetadata & {
  list(): StoredWorkflowRun[];
  getById(id: string): RepositoryResult<StoredWorkflowRun>;
  create(input: WorkflowRunCreateInput): RepositoryResult<StoredWorkflowRun>;
  update(id: string, input: WorkflowRunUpdateInput): RepositoryResult<StoredWorkflowRun>;
  appendEvent(input: WorkflowStepEventInput): RepositoryResult<StoredWorkflowStepEvent>;
  listEvents(runId?: string): StoredWorkflowStepEvent[];
};

export type StoredApproval = {
  id: string;
  runId: string;
  stepId: string;
  status: GovernanceApprovalStatus;
  riskLevel: "low" | "medium" | "high";
  reviewerRole: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  publicSafetyNote: string;
};

export type ApprovalCreateInput = Omit<StoredApproval, "publicSafetyNote" | "updatedAt"> & {
  publicSafetyNote?: string;
  updatedAt?: string;
};

export type ApprovalUpdateInput = Partial<
  Pick<StoredApproval, "status" | "updatedAt" | "reason" | "reviewerRole">
>;

export type ApprovalRepository = PublicSafeRepositoryMetadata & {
  list(): StoredApproval[];
  getById(id: string): RepositoryResult<StoredApproval>;
  create(input: ApprovalCreateInput): RepositoryResult<StoredApproval>;
  update(id: string, input: ApprovalUpdateInput): RepositoryResult<StoredApproval>;
};

export type StoredAuditEvent = {
  id: string;
  domain: "workflow" | "approval" | "tool" | "evaluation";
  type: string;
  subjectId: string;
  runId?: string;
  message: string;
  createdAt: string;
  metadata: JsonObject;
  publicSafetyNote: string;
};

export type AuditEventInput = Omit<StoredAuditEvent, "publicSafetyNote"> & {
  publicSafetyNote?: string;
};

export type AuditEventRepository = PublicSafeRepositoryMetadata & {
  list(): StoredAuditEvent[];
  getById(id: string): RepositoryResult<StoredAuditEvent>;
  appendEvent(input: AuditEventInput): RepositoryResult<StoredAuditEvent>;
};

export type PromptRepository = PublicSafeRepositoryMetadata & {
  list(): PromptRegistryEntry[];
  getById(id: string): RepositoryResult<PromptRegistryEntry>;
  create(input: PromptRegistryEntry): RepositoryResult<PromptRegistryEntry>;
  update(id: string, input: Partial<PromptRegistryEntry>): RepositoryResult<PromptRegistryEntry>;
};

export type EvaluationRepository = PublicSafeRepositoryMetadata & {
  list(): EvaluationRun[];
  getById(id: string): RepositoryResult<EvaluationRun>;
  create(input: EvaluationRun): RepositoryResult<EvaluationRun>;
  update(id: string, input: Partial<EvaluationRun>): RepositoryResult<EvaluationRun>;
};

export type StoredToolCall = ToolCall & {
  publicSafetyNote: string;
};

export type ToolCallCreateInput = ToolCall & {
  publicSafetyNote?: string;
};

export type ToolCallRepository = PublicSafeRepositoryMetadata & {
  list(): StoredToolCall[];
  getById(id: string): RepositoryResult<StoredToolCall>;
  create(input: ToolCallCreateInput): RepositoryResult<StoredToolCall>;
  update(id: string, input: Partial<ToolCallCreateInput>): RepositoryResult<StoredToolCall>;
  listByRunId(runId: string): StoredToolCall[];
  listByRiskLevel(riskLevel: ToolRiskLevel): StoredToolCall[];
};

export type RepositoryContext = {
  workflowRunRepository: WorkflowRunRepository;
  approvalRepository: ApprovalRepository;
  auditEventRepository: AuditEventRepository;
  promptRepository: PromptRepository;
  evaluationRepository: EvaluationRepository;
  toolCallRepository: ToolCallRepository;
};

export function createRepositoryNotFoundError(entityName: string, id: string): RepositoryError {
  return {
    code: "not_found",
    message: `${entityName} ${id} was not found in the public-safe in-memory repository.`,
    publicSafetyNote:
      "Repository lookup failed safely. No external database, API, or production data source was queried.",
  };
}

export const memoryRepositoryPublicSafetyNote =
  "Backed by public-safe in-memory repository adapter. No disk write, database connection, Supabase, Postgres, external API, or production data was used.";
