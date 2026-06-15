import { describe, expect, it } from "vitest";
import {
  createRepositoryContext,
  getApprovalRepository,
  getAuditEventRepository,
  getEvaluationRepository,
  getPromptRepository,
  getToolCallRepository,
  getWorkflowRunRepository,
} from "../src/lib/repositories/repositoryFactory";

describe("repository factory", () => {
  it("returns public-safe memory adapters for every repository", () => {
    const context = createRepositoryContext();

    expect(context.workflowRunRepository.adapterType).toBe("memory");
    expect(context.approvalRepository.adapterType).toBe("memory");
    expect(context.auditEventRepository.adapterType).toBe("memory");
    expect(context.promptRepository.adapterType).toBe("memory");
    expect(context.evaluationRepository.adapterType).toBe("memory");
    expect(context.toolCallRepository.adapterType).toBe("memory");
    expect(context.workflowRunRepository.publicSafetyNote).toContain("No disk write");
  });

  it("exposes helper accessors for each repository boundary", () => {
    const context = createRepositoryContext();

    expect(getWorkflowRunRepository(context).list().length).toBeGreaterThan(0);
    expect(getApprovalRepository(context).list().length).toBeGreaterThan(0);
    expect(getAuditEventRepository(context).list().length).toBeGreaterThan(0);
    expect(getPromptRepository(context).list().length).toBeGreaterThan(0);
    expect(getEvaluationRepository(context).list().length).toBeGreaterThan(0);
    expect(getToolCallRepository(context).list().length).toBeGreaterThan(0);
  });
});
