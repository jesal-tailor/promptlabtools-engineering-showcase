import { describe, expect, it } from "vitest";
import {
  explainPromptLifecycleStatus,
  transitionPromptStatus,
} from "../src/lib/prompts/promptLifecycle";

describe("prompt lifecycle", () => {
  it("allows draft prompts to transition to active in mock lifecycle simulation", () => {
    const result = transitionPromptStatus("prompt_campaign_drafter_v2_draft", "active");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.previousStatus).toBe("draft");
      expect(result.newStatus).toBe("active");
      expect(result.note).toContain("Mock lifecycle transition");
    }
  });

  it("prevents deprecated prompts from becoming active directly", () => {
    const result = transitionPromptStatus("prompt_campaign_planner_v1", "active");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]).toContain("Deprecated prompts cannot become active");
    }
  });

  it("explains active prompt status for reviewers", () => {
    expect(explainPromptLifecycleStatus("prompt_campaign_planner_v2")).toContain("is active");
  });
});
