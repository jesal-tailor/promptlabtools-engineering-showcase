import { describe, expect, it } from "vitest";
import { comparePromptVersions } from "../src/lib/prompts/promptVersioning";

describe("prompt versioning", () => {
  it("compares planner v1 to planner v2 deterministically", () => {
    const comparison = comparePromptVersions(
      "prompt_campaign_planner_v1",
      "prompt_campaign_planner_v2",
    );

    expect(comparison.versionChange).toBe("1.0.0-mock -> 2.0.0-mock");
    expect(comparison.statusChange).toBe("deprecated -> active");
    expect(comparison.addedCriteria).toContain("risk");
    expect(comparison.changeSummary).toContain("governance checkpoints");
  });

  it("throws for unknown prompts", () => {
    expect(() => comparePromptVersions("missing_prompt", "prompt_campaign_planner_v2")).toThrow(
      "Cannot compare missing prompts",
    );
  });
});
