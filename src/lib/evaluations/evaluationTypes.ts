export type EvaluationDimension =
  | "accuracy"
  | "brandFit"
  | "specificity"
  | "actionability"
  | "risk"
  | "ctaClarity"
  | "governanceFit"
  | "overallScore";

export type EvaluationScoreBreakdown = Record<EvaluationDimension, number>;

export type EvaluationCriteria = {
  id: string;
  promptId: string;
  dimensions: EvaluationDimension[];
  passingScore: number;
  regressionThreshold: number;
  notes: string;
};

export type EvaluationRun = {
  id: string;
  promptId: string;
  output: string;
  criteriaId: string;
  scores: EvaluationScoreBreakdown;
  overallScore: number;
  passed: boolean;
  judgeFeedback: string;
  createdAt: string;
};

export type EvaluationRunComparison = {
  baselineRunId: string;
  candidateRunId: string;
  baselineScore: number;
  candidateScore: number;
  scoreDelta: number;
  regressionDetected: boolean;
  summary: string;
};

export type QualityRegressionResult = {
  baselineScore: number;
  candidateScore: number;
  threshold: number;
  regressionDetected: boolean;
  severity: "none" | "minor" | "major";
  explanation: string;
};

export type HumanFeedbackEntry = {
  feedbackId: string;
  runId: string;
  promptId: string;
  reviewerName: string;
  rating: number;
  feedback: string;
  suggestedChange: string;
  createdAt: string;
};

export type HumanFeedbackSummary = {
  promptId: string;
  averageRating: number;
  feedbackCount: number;
  themes: string[];
  suggestedChanges: string[];
};
