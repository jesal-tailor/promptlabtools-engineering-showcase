import { describe, expect, it } from "vitest";
import { createMemoryWorkflowRunRepository } from "../src/lib/repositories/memory/memoryWorkflowRunRepository";

describe("memory workflow run repository", () => {
  it("returns seeded workflow runs and safe missing results", () => {
    const repository = createMemoryWorkflowRunRepository();
    const seeded = repository.getById("run_101");
    const missing = repository.getById("missing_run");

    expect(seeded.ok).toBe(true);
    if (seeded.ok) {
      expect(seeded.record.source).toBe("fixture");
      expect(seeded.record.publicSafetyNote).toContain("synthetic");
    }

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.code).toBe("not_found");
      expect(missing.error.publicSafetyNote).toContain("No external database");
    }
  });

  it("creates, updates, and appends workflow step events", () => {
    const repository = createMemoryWorkflowRunRepository();
    const created = repository.create({
      id: "run_repo_test",
      title: "Repository test run",
      status: "runtime_completed",
      source: "runtime",
      createdAt: "2026-06-15T12:00:00.000Z",
    });

    expect(created.ok).toBe(true);
    const updated = repository.update("run_repo_test", {
      status: "completed",
      title: "Updated repository test run",
      updatedAt: "2026-06-15T12:05:00.000Z",
    });
    const event = repository.appendEvent({
      id: "repo_event_test",
      runId: "run_repo_test",
      sequence: 1,
      eventType: "workflow_started",
      message: "Started public-safe repository test workflow.",
      createdAt: "2026-06-15T12:00:00.000Z",
      metadata: { safe: true },
    });

    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.record.title).toBe("Updated repository test run");
    }
    expect(event.ok).toBe(true);
    expect(repository.listEvents("run_repo_test")).toHaveLength(1);
  });
});
