import { detectQualityRegression } from "@/lib/evaluations/regressionChecks";
import type { EvaluationRun, EvaluationRunComparison } from "@/lib/evaluations/evaluationTypes";

export const evaluationHistory: EvaluationRun[] = [
  {
    id: "eval_hist_planner_v1",
    promptId: "prompt_campaign_planner_v1",
    output: "Plan a mock campaign with public-safe notes and simple approval context.",
    criteriaId: "criteria_campaign_planner_v2",
    scores: {
      accuracy: 82,
      brandFit: 78,
      specificity: 80,
      actionability: 79,
      risk: 86,
      ctaClarity: 76,
      governanceFit: 81,
      overallScore: 80,
    },
    overallScore: 80,
    passed: false,
    judgeFeedback: "Deterministic mock judge feedback: governance needs clearer checkpoints.",
    createdAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "eval_hist_planner_v2",
    promptId: "prompt_campaign_planner_v2",
    output:
      "Create a deterministic public-safe workflow plan with approval policy, audit trail, trace events, and clear reviewer action.",
    criteriaId: "criteria_campaign_planner_v2",
    scores: {
      accuracy: 88,
      brandFit: 84,
      specificity: 92,
      actionability: 90,
      risk: 94,
      ctaClarity: 86,
      governanceFit: 96,
      overallScore: 91,
    },
    overallScore: 91,
    passed: true,
    judgeFeedback: "Deterministic mock judge feedback: strong governance and public-safe framing.",
    createdAt: "2026-06-15T13:00:00.000Z",
  },
  {
    id: "eval_hist_drafter_v1",
    promptId: "prompt_campaign_drafter_v1",
    output:
      "Draft mock PromptLabTools showcase copy with public-safe disclaimer, approval review, and clear CTA to inspect the workflow.",
    criteriaId: "criteria_campaign_drafter_v1",
    scores: {
      accuracy: 84,
      brandFit: 91,
      specificity: 88,
      actionability: 89,
      risk: 93,
      ctaClarity: 90,
      governanceFit: 87,
      overallScore: 89,
    },
    overallScore: 89,
    passed: true,
    judgeFeedback: "Deterministic mock judge feedback: CTA and public-safe boundary are clear.",
    createdAt: "2026-06-15T13:05:00.000Z",
  },
];

export function getEvaluationRunById(runId: string): EvaluationRun | undefined {
  return evaluationHistory.find((run) => run.id === runId);
}

export function compareEvaluationRuns(
  baselineRunId: string,
  candidateRunId: string,
): EvaluationRunComparison {
  const baseline = getEvaluationRunById(baselineRunId);
  const candidate = getEvaluationRunById(candidateRunId);

  if (!baseline || !candidate) {
    throw new Error(`Cannot compare missing evaluation runs: ${baselineRunId}, ${candidateRunId}.`);
  }

  const regression = detectQualityRegression(baseline.overallScore, candidate.overallScore);

  return {
    baselineRunId,
    candidateRunId,
    baselineScore: baseline.overallScore,
    candidateScore: candidate.overallScore,
    scoreDelta: candidate.overallScore - baseline.overallScore,
    regressionDetected: regression.regressionDetected,
    summary: regression.regressionDetected
      ? "Candidate run regressed against baseline."
      : "Candidate run is stable or improved against baseline.",
  };
}

export function getEvaluationTrend(promptId: string): EvaluationRun[] {
  return evaluationHistory
    .filter((run) => run.promptId === promptId)
    .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));
}
