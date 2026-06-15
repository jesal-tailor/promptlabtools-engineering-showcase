export type EvaluationStatus = "passed" | "warning" | "failed";

export type EvaluationDimension = {
  name: string;
  score: number;
  notes: string;
};

export type EvaluationResult = {
  id: string;
  runId: string;
  promptId: string;
  suiteName: string;
  score: number;
  maxScore: number;
  status: EvaluationStatus;
  feedback: string;
  checkedAt: string;
  dimensions: EvaluationDimension[];
};
