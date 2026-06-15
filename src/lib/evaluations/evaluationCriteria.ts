import type { EvaluationCriteria } from "@/lib/evaluations/evaluationTypes";

export const evaluationCriteriaRegistry: EvaluationCriteria[] = [
  {
    id: "criteria_campaign_planner_v2",
    promptId: "prompt_campaign_planner_v2",
    dimensions: [
      "accuracy",
      "specificity",
      "actionability",
      "risk",
      "governanceFit",
      "overallScore",
    ],
    passingScore: 82,
    regressionThreshold: 5,
    notes: "Planner output should be specific, safe, and approval-aware.",
  },
  {
    id: "criteria_campaign_drafter_v1",
    promptId: "prompt_campaign_drafter_v1",
    dimensions: [
      "brandFit",
      "specificity",
      "actionability",
      "risk",
      "ctaClarity",
      "governanceFit",
      "overallScore",
    ],
    passingScore: 84,
    regressionThreshold: 4,
    notes: "Draft copy must be clear, branded, actionable, and mock-safe.",
  },
  {
    id: "criteria_campaign_qa_v1",
    promptId: "prompt_campaign_qa_v1",
    dimensions: [
      "accuracy",
      "brandFit",
      "specificity",
      "actionability",
      "risk",
      "ctaClarity",
      "governanceFit",
      "overallScore",
    ],
    passingScore: 85,
    regressionThreshold: 5,
    notes: "QA prompt covers the full deterministic evaluation rubric.",
  },
];

export function getEvaluationCriteriaForPrompt(promptId: string): EvaluationCriteria | undefined {
  return evaluationCriteriaRegistry.find((criteria) => criteria.promptId === promptId);
}
