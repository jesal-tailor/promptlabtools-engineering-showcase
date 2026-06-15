import { describe, expect, it } from "vitest";
import { detectQualityRegression } from "../src/lib/evaluations/regressionChecks";

describe("quality regression checks", () => {
  it("flags a regression when the candidate drop meets the threshold", () => {
    const result = detectQualityRegression(91, 80, 5);

    expect(result.regressionDetected).toBe(true);
    expect(result.severity).toBe("major");
    expect(result.explanation).toContain("dropped by 11 points");
  });

  it("does not flag stable candidates", () => {
    const result = detectQualityRegression(80, 91, 5);

    expect(result.regressionDetected).toBe(false);
    expect(result.severity).toBe("none");
  });
});
