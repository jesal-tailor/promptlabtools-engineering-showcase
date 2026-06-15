import { describe, expect, it } from "vitest";
import { createMemoryToolCallRepository } from "../src/lib/repositories/memory/memoryToolCallRepository";

describe("memory tool call repository", () => {
  it("returns seeded tool calls and safe missing results", () => {
    const repository = createMemoryToolCallRepository();
    const seeded = repository.getById("tool_call_seed_blocked_webhook");
    const missing = repository.getById("missing_tool_call");

    expect(seeded.ok).toBe(true);
    if (seeded.ok) {
      expect(seeded.record.status).toBe("blocked");
      expect(seeded.record.riskLevel).toBe("high");
    }

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.code).toBe("not_found");
    }
  });

  it("creates, updates, and filters tool call records", () => {
    const repository = createMemoryToolCallRepository();
    const created = repository.create({
      toolCallId: "tool_call_repo_test",
      runId: "run_repo_test",
      stepId: "qa_agent",
      agentId: "qa_agent",
      toolId: "score_content_quality",
      inputPayload: { content: "Mock content" },
      status: "executed",
      outputPayload: { score: 93 },
      riskLevel: "medium",
      requiresApproval: false,
      createdAt: "2026-06-15T12:00:00.000Z",
      completedAt: "2026-06-15T12:00:00.500Z",
    });

    expect(created.ok).toBe(true);
    const updated = repository.update("tool_call_repo_test", {
      outputPayload: { score: 94 },
    });

    expect(updated.ok).toBe(true);
    expect(repository.listByRunId("run_repo_test")).toHaveLength(1);
    expect(repository.listByRiskLevel("medium").some((record) => record.toolCallId === "tool_call_repo_test")).toBe(true);
  });
});
