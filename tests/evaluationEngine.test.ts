import { describe, expect, it } from "vitest";
import { getEvaluationCriteriaForPrompt } from "../src/lib/evaluations/evaluationCriteria";
import { evaluateOutputAgainstCriteria } from "../src/lib/evaluations/evaluationEngine";

describe("evaluation engine v2", () => {
  it("scores output deterministically against registered criteria", () => {
    const criteria = getEvaluationCriteriaForPrompt("prompt_campaign_planner_v2");

    expect(criteria).toBeDefined();
    if (!criteria) {
      throw new Error("Expected planner evaluation criteria fixture.");
    }

    const evaluation = evaluateOutputAgainstCriteria(
      "Deterministic mock workflow with approval review, governance policy, trace audit, and public-safe CTA.",
      criteria,
    );

    expect(evaluation.promptId).toBe("prompt_campaign_planner_v2");
    expect(evaluation.overallScore).toBeGreaterThanOrEqual(criteria.passingScore);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.judgeFeedback).toContain("Deterministic mock judge feedback");
  });

  it("penalises risky production language in risk scoring", () => {
    const criteria = getEvaluationCriteriaForPrompt("prompt_campaign_planner_v2");
    if (!criteria) {
      throw new Error("Expected planner evaluation criteria fixture.");
    }

    const evaluation = evaluateOutputAgainstCriteria(
      "Production workflow package with approval context.",
      criteria,
    );

    expect(evaluation.scores.risk).toBeLessThan(90);
  });
});
