import type { QualityRegressionResult } from "@/lib/evaluations/evaluationTypes";

export function detectQualityRegression(
  baselineScore: number,
  candidateScore: number,
  threshold = 5,
): QualityRegressionResult {
  const delta = baselineScore - candidateScore;
  const regressionDetected = delta >= threshold;
  const severity = !regressionDetected ? "none" : delta >= threshold * 2 ? "major" : "minor";

  return {
    baselineScore,
    candidateScore,
    threshold,
    regressionDetected,
    severity,
    explanation: regressionDetected
      ? `Candidate score dropped by ${delta} points, which meets or exceeds the ${threshold}-point threshold.`
      : `Candidate score changed by ${delta} points, below the ${threshold}-point regression threshold.`,
  };
}
