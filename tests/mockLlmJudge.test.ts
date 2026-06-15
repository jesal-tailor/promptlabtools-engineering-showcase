import { describe, expect, it } from "vitest";
import { generateMockJudgeFeedback } from "../src/lib/evaluations/mockLlmJudge";

describe("mock LLM judge", () => {
  it("returns deterministic feedback for the same output", () => {
    const output = "Public-safe mock workflow with approval review and clear CTA.";

    expect(generateMockJudgeFeedback(output)).toBe(generateMockJudgeFeedback(output));
    expect(generateMockJudgeFeedback(output)).toContain("public-safe boundary is visible");
    expect(generateMockJudgeFeedback(output)).toContain("approval context is present");
  });
});
