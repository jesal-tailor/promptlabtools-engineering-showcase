import { describe, expect, it } from "vitest";
import {
  addMockHumanFeedback,
  recommendPromptImprovement,
  summariseHumanFeedbackForPrompt,
} from "../src/lib/evaluations/humanFeedback";

describe("human feedback loop", () => {
  it("summarises reviewer feedback by prompt", () => {
    const summary = summariseHumanFeedbackForPrompt("prompt_campaign_planner_v2");

    expect(summary.feedbackCount).toBe(1);
    expect(summary.averageRating).toBe(5);
    expect(summary.themes).toContain("governance clarity");
  });

  it("returns deterministic mock feedback without mutating persisted state", () => {
    const feedback = addMockHumanFeedback({
      promptId: "prompt_campaign_planner_v2",
      suggestedChange: "Make approval copy shorter.",
    });

    expect(feedback.feedbackId).toBe("feedback_mock_new");
    expect(feedback.suggestedChange).toBe("Make approval copy shorter.");
    expect(summariseHumanFeedbackForPrompt("prompt_campaign_planner_v2").feedbackCount).toBe(1);
  });

  it("recommends prompt improvement from feedback themes", () => {
    expect(recommendPromptImprovement("prompt_campaign_planner_v2")).toContain(
      "Keep approval rationale visible",
    );
  });
});
