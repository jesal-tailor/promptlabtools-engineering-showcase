import { beforeEach, describe, expect, it } from "vitest";
import { createRepositoryContext } from "../src/lib/repositories/repositoryFactory";
import { resetToolAuditEventsForTests } from "../src/lib/tools/toolAuditLog";
import { executeToolCall } from "../src/lib/tools/toolExecutor";

describe("tool repository integration", () => {
  beforeEach(() => {
    resetToolAuditEventsForTests();
  });

  it("persists tool calls and audit events through the repository context", () => {
    const repositories = createRepositoryContext();
    const result = executeToolCall({
      agentId: "qa_agent",
      inputPayload: {
        content: "Mock public-safe content with clear governance and CTA.",
      },
      repositories,
      runId: "run_repo_tool_integration",
      stepId: "qa_agent",
      toolId: "score_content_quality",
    });
    const storedToolCall = repositories.toolCallRepository.getById(result.toolCall.toolCallId);
    const auditEvents = repositories.auditEventRepository
      .list()
      .filter((event) => event.subjectId === result.toolCall.toolCallId);

    expect(result.ok).toBe(true);
    expect(storedToolCall.ok).toBe(true);
    if (storedToolCall.ok) {
      expect(storedToolCall.record.status).toBe("executed");
      expect(storedToolCall.record.publicSafetyNote).toContain("in-memory repository");
    }
    expect(auditEvents).toHaveLength(1);
    expect(auditEvents[0]?.domain).toBe("tool");
  });
});
