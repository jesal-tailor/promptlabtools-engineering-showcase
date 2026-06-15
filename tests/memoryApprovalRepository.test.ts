import { describe, expect, it } from "vitest";
import { createMemoryApprovalRepository } from "../src/lib/repositories/memory/memoryApprovalRepository";

describe("memory approval repository", () => {
  it("returns seeded approvals and maps missing approvals safely", () => {
    const repository = createMemoryApprovalRepository();
    const seeded = repository.getById("approval_run_101_publish");
    const missing = repository.getById("missing_approval");

    expect(seeded.ok).toBe(true);
    if (seeded.ok) {
      expect(seeded.record.status).toBe("pending_review");
      expect(seeded.record.riskLevel).toBe("high");
    }

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.message).toContain("public-safe in-memory repository");
    }
  });

  it("creates and updates approval records", () => {
    const repository = createMemoryApprovalRepository();
    const created = repository.create({
      id: "approval_repo_test",
      runId: "run_repo_test",
      stepId: "approval_gate",
      status: "pending_review",
      riskLevel: "medium",
      reviewerRole: "Mock reviewer",
      reason: "Repository boundary test.",
      createdAt: "2026-06-15T12:00:00.000Z",
    });

    expect(created.ok).toBe(true);
    const updated = repository.update("approval_repo_test", {
      reason: "Approved through memory repository test.",
      status: "approved",
      updatedAt: "2026-06-15T12:10:00.000Z",
    });

    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.record.status).toBe("approved");
      expect(updated.record.reason).toContain("Approved");
    }
  });
});
