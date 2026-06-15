import { describe, expect, it } from "vitest";
import { createMemoryAuditEventRepository } from "../src/lib/repositories/memory/memoryAuditEventRepository";

describe("memory audit event repository", () => {
  it("returns seeded audit events and safe missing results", () => {
    const repository = createMemoryAuditEventRepository();
    const seededEvents = repository.list();
    const missing = repository.getById("missing_audit_event");

    expect(seededEvents.length).toBeGreaterThan(0);
    expect(seededEvents[0]?.publicSafetyNote).toContain("in-memory repository");
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.code).toBe("not_found");
    }
  });

  it("appends audit events without writing to external systems", () => {
    const repository = createMemoryAuditEventRepository();
    const appended = repository.appendEvent({
      id: "audit_repo_test",
      domain: "tool",
      type: "tool_call_recorded",
      subjectId: "tool_call_repo_test",
      runId: "run_repo_test",
      message: "Recorded deterministic mock tool call.",
      createdAt: "2026-06-15T12:00:00.000Z",
      metadata: { toolId: "score_content_quality" },
    });

    expect(appended.ok).toBe(true);
    expect(repository.getById("audit_repo_test").ok).toBe(true);
  });
});
