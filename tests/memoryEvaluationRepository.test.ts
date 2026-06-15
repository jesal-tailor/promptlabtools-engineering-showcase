import { describe, expect, it } from "vitest";
import { createMemoryEvaluationRepository } from "../src/lib/repositories/memory/memoryEvaluationRepository";

const scoreBreakdown = {
  accuracy: 90,
  brandFit: 90,
  specificity: 90,
  actionability: 90,
  risk: 90,
  ctaClarity: 90,
  governanceFit: 90,
  overallScore: 90,
};

describe("memory evaluation repository", () => {
  it("returns seeded evaluations and safe missing results", () => {
    const repository = createMemoryEvaluationRepository();
    const seeded = repository.getById("eval_hist_planner_v2");
    const missing = repository.getById("missing_evaluation");

    expect(seeded.ok).toBe(true);
    if (seeded.ok) {
      expect(seeded.record.passed).toBe(true);
      expect(seeded.record.overallScore).toBe(91);
    }

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.code).toBe("not_found");
    }
  });

  it("creates and updates evaluation runs", () => {
    const repository = createMemoryEvaluationRepository();
    const created = repository.create({
      id: "eval_repo_test",
      promptId: "prompt_campaign_qa_v1",
      output: "Mock evaluated output.",
      criteriaId: "criteria_campaign_qa_v1",
      scores: scoreBreakdown,
      overallScore: 90,
      passed: true,
      judgeFeedback: "Deterministic mock judge feedback.",
      createdAt: "2026-06-15T12:00:00.000Z",
    });

    expect(created.ok).toBe(true);
    const updated = repository.update("eval_repo_test", {
      judgeFeedback: "Updated deterministic mock judge feedback.",
      overallScore: 92,
    });

    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.record.overallScore).toBe(92);
    }
  });
});
