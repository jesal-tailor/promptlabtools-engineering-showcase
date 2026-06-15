import { generateMockJudgeFeedback } from "@/lib/evaluations/mockLlmJudge";
import type {
  EvaluationCriteria,
  EvaluationDimension,
  EvaluationRun,
  EvaluationScoreBreakdown,
} from "@/lib/evaluations/evaluationTypes";

const defaultScore = 72;

function scoreDimension(output: string, dimension: EvaluationDimension): number {
  const normalisedOutput = output.toLowerCase();
  const lengthBonus = output.length > 120 ? 8 : output.length > 60 ? 4 : 0;
  const signals: Record<EvaluationDimension, string[]> = {
    accuracy: ["deterministic", "fixture", "criteria"],
    brandFit: ["promptlabtools", "showcase", "platform"],
    specificity: ["workflow", "approval", "trace", "governance"],
    actionability: ["review", "open", "start", "approve"],
    risk: ["mock", "public-safe", "no external", "approval"],
    ctaClarity: ["call to action", "cta", "review", "start"],
    governanceFit: ["governance", "approval", "audit", "policy"],
    overallScore: ["mock", "approval", "workflow", "public-safe"],
  };
  const signalScore = signals[dimension].reduce(
    (score, signal) => score + (normalisedOutput.includes(signal) ? 5 : 0),
    0,
  );
  const riskPenalty = dimension === "risk" && normalisedOutput.includes("production") ? -8 : 0;

  return Math.max(0, Math.min(100, defaultScore + lengthBonus + signalScore + riskPenalty));
}

export function evaluateOutputAgainstCriteria(
  output: string,
  criteria: EvaluationCriteria,
): EvaluationRun {
  const scores = criteria.dimensions.reduce<Partial<EvaluationScoreBreakdown>>((breakdown, dimension) => {
    breakdown[dimension] = scoreDimension(output, dimension);

    return breakdown;
  }, {});
  const completeScores: EvaluationScoreBreakdown = {
    accuracy: scores.accuracy ?? scoreDimension(output, "accuracy"),
    brandFit: scores.brandFit ?? scoreDimension(output, "brandFit"),
    specificity: scores.specificity ?? scoreDimension(output, "specificity"),
    actionability: scores.actionability ?? scoreDimension(output, "actionability"),
    risk: scores.risk ?? scoreDimension(output, "risk"),
    ctaClarity: scores.ctaClarity ?? scoreDimension(output, "ctaClarity"),
    governanceFit: scores.governanceFit ?? scoreDimension(output, "governanceFit"),
    overallScore: scores.overallScore ?? scoreDimension(output, "overallScore"),
  };
  const overallScore = Math.round(
    criteria.dimensions.reduce((total, dimension) => total + completeScores[dimension], 0) /
      criteria.dimensions.length,
  );

  return {
    id: `eval_v2_${criteria.promptId}_${overallScore}`,
    promptId: criteria.promptId,
    output,
    criteriaId: criteria.id,
    scores: {
      ...completeScores,
      overallScore,
    },
    overallScore,
    passed: overallScore >= criteria.passingScore,
    judgeFeedback: generateMockJudgeFeedback(output),
    createdAt: "2026-06-15T13:00:00.000Z",
  };
}
