import { createMemoryApprovalRepository } from "@/lib/repositories/memory/memoryApprovalRepository";
import { createMemoryAuditEventRepository } from "@/lib/repositories/memory/memoryAuditEventRepository";
import { createMemoryEvaluationRepository } from "@/lib/repositories/memory/memoryEvaluationRepository";
import { createMemoryPromptRepository } from "@/lib/repositories/memory/memoryPromptRepository";
import { createMemoryToolCallRepository } from "@/lib/repositories/memory/memoryToolCallRepository";
import { createMemoryWorkflowRunRepository } from "@/lib/repositories/memory/memoryWorkflowRunRepository";
import type {
  ApprovalRepository,
  AuditEventRepository,
  EvaluationRepository,
  PromptRepository,
  RepositoryContext,
  ToolCallRepository,
  WorkflowRunRepository,
} from "@/lib/repositories/repositoryTypes";

export function createRepositoryContext(): RepositoryContext {
  // Production would switch on environment/configuration here and return Supabase/Postgres
  // repository adapters behind these same interfaces. The public showcase intentionally
  // returns deterministic memory repositories only.
  return {
    workflowRunRepository: createMemoryWorkflowRunRepository(),
    approvalRepository: createMemoryApprovalRepository(),
    auditEventRepository: createMemoryAuditEventRepository(),
    promptRepository: createMemoryPromptRepository(),
    evaluationRepository: createMemoryEvaluationRepository(),
    toolCallRepository: createMemoryToolCallRepository(),
  };
}

export function getWorkflowRunRepository(
  context: RepositoryContext = createRepositoryContext(),
): WorkflowRunRepository {
  return context.workflowRunRepository;
}

export function getApprovalRepository(
  context: RepositoryContext = createRepositoryContext(),
): ApprovalRepository {
  return context.approvalRepository;
}

export function getAuditEventRepository(
  context: RepositoryContext = createRepositoryContext(),
): AuditEventRepository {
  return context.auditEventRepository;
}

export function getPromptRepository(
  context: RepositoryContext = createRepositoryContext(),
): PromptRepository {
  return context.promptRepository;
}

export function getEvaluationRepository(
  context: RepositoryContext = createRepositoryContext(),
): EvaluationRepository {
  return context.evaluationRepository;
}

export function getToolCallRepository(
  context: RepositoryContext = createRepositoryContext(),
): ToolCallRepository {
  return context.toolCallRepository;
}
