import { describe, expect, it } from "vitest";
import {
  compareEvaluationRuns,
  getEvaluationRunById,
  getEvaluationTrend,
} from "../src/lib/evaluations/evaluationHistory";

describe("evaluation history", () => {
  it("retrieves deterministic historical evaluation runs", () => {
    const run = getEvaluationRunById("eval_hist_planner_v2");

    expect(run?.overallScore).toBe(91);
    expect(run?.passed).toBe(true);
  });

  it("compares baseline and candidate runs", () => {
    const comparison = compareEvaluationRuns("eval_hist_planner_v1", "eval_hist_planner_v2");

    expect(comparison.scoreDelta).toBe(11);
    expect(comparison.regressionDetected).toBe(false);
    expect(comparison.summary).toContain("stable or improved");
  });

  it("returns prompt-specific evaluation trends", () => {
    const trend = getEvaluationTrend("prompt_campaign_planner_v2");

    expect(trend.map((run) => run.id)).toEqual(["eval_hist_planner_v2"]);
  });
});
