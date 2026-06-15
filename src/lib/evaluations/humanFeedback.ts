import type { HumanFeedbackEntry, HumanFeedbackSummary } from "@/lib/evaluations/evaluationTypes";

const mockHumanFeedback: HumanFeedbackEntry[] = [
  {
    feedbackId: "feedback_planner_v2_001",
    runId: "eval_hist_planner_v2",
    promptId: "prompt_campaign_planner_v2",
    reviewerName: "Mock Reviewer",
    rating: 5,
    feedback: "Strong governance checkpoints and public-safe framing.",
    suggestedChange: "Keep approval rationale visible near the CTA.",
    createdAt: "2026-06-15T13:30:00.000Z",
  },
  {
    feedbackId: "feedback_drafter_v1_001",
    runId: "eval_hist_drafter_v1",
    promptId: "prompt_campaign_drafter_v1",
    reviewerName: "Mock Reviewer",
    rating: 4,
    feedback: "Clear copy, but the CTA can be more explicit.",
    suggestedChange: "Mention the exact dashboard route reviewers should open.",
    createdAt: "2026-06-15T13:35:00.000Z",
  },
];

export function addMockHumanFeedback(
  feedback: Partial<HumanFeedbackEntry> = {},
): HumanFeedbackEntry {
  return {
    feedbackId: feedback.feedbackId ?? "feedback_mock_new",
    runId: feedback.runId ?? "eval_hist_planner_v2",
    promptId: feedback.promptId ?? "prompt_campaign_planner_v2",
    reviewerName: feedback.reviewerName ?? "Mock Reviewer",
    rating: feedback.rating ?? 4,
    feedback: feedback.feedback ?? "Mock feedback captured for prompt improvement.",
    suggestedChange: feedback.suggestedChange ?? "Make approval rationale more explicit.",
    createdAt: feedback.createdAt ?? "2026-06-15T14:00:00.000Z",
  };
}

export function summariseHumanFeedbackForPrompt(promptId: string): HumanFeedbackSummary {
  const feedback = mockHumanFeedback.filter((entry) => entry.promptId === promptId);
  const averageRating =
    feedback.length === 0
      ? 0
      : Number((feedback.reduce((total, entry) => total + entry.rating, 0) / feedback.length).toFixed(1));

  return {
    promptId,
    averageRating,
    feedbackCount: feedback.length,
    themes: feedback.length > 0 ? ["governance clarity", "CTA specificity"] : ["no feedback yet"],
    suggestedChanges: feedback.map((entry) => entry.suggestedChange),
  };
}

export function recommendPromptImprovement(promptId: string): string {
  const summary = summariseHumanFeedbackForPrompt(promptId);

  if (summary.feedbackCount === 0) {
    return "Collect mock reviewer feedback before recommending prompt changes.";
  }

  return `Recommended improvement for ${promptId}: ${summary.suggestedChanges[0]}`;
}
