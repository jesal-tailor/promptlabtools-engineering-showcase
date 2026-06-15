import { describe, expect, it } from "vitest";
import { renderPromptTemplate } from "../src/lib/prompts/promptRenderer";

describe("prompt renderer", () => {
  it("renders deterministic templates with provided variables", () => {
    const result = renderPromptTemplate("prompt_campaign_planner_v2", {
      audience: "CV reviewers",
      campaignGoal: "Launch a public-safe showcase",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.renderedPrompt).toContain("Launch a public-safe showcase");
      expect(result.renderedPrompt).toContain("CV reviewers");
      expect(result.renderedPrompt).not.toContain("{{");
    }
  });

  it("returns validation errors when variables are missing", () => {
    const result = renderPromptTemplate("prompt_campaign_drafter_v1", {
      campaignGoal: "Launch a public-safe showcase",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Missing required variable: tone.");
    }
  });
});
