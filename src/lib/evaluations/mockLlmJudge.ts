export function generateMockJudgeFeedback(output: string): string {
  const normalisedOutput = output.trim().toLowerCase();
  const mentionsMock = normalisedOutput.includes("mock") || normalisedOutput.includes("public-safe");
  const mentionsApproval = normalisedOutput.includes("approval") || normalisedOutput.includes("review");
  const mentionsCta = normalisedOutput.includes("review") || normalisedOutput.includes("open") || normalisedOutput.includes("start");

  return [
    "Deterministic mock judge feedback:",
    mentionsMock ? "public-safe boundary is visible" : "public-safe boundary should be clearer",
    mentionsApproval ? "approval context is present" : "approval context is missing",
    mentionsCta ? "CTA is actionable" : "CTA needs a clearer next step",
  ].join(" ");
}
