import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

export function mockScoreContentQuality(
  inputPayload: JsonObject,
  context: ToolAdapterContext,
): JsonObject {
  const content = typeof inputPayload.content === "string" ? inputPayload.content.toLowerCase() : "";
  const score =
    70 +
    (content.includes("mock") ? 6 : 0) +
    (content.includes("public-safe") ? 8 : 0) +
    (content.includes("approval") ? 5 : 0) +
    (content.includes("review") ? 4 : 0);
  const cappedScore = Math.min(score, 95);

  return {
    adapterType: "mock",
    score: cappedScore,
    passed: cappedScore >= 84,
    dimensions: {
      clarity: cappedScore - 4,
      governanceFit: content.includes("approval") ? cappedScore : cappedScore - 8,
      publicSafety: content.includes("public-safe") ? cappedScore : cappedScore - 10,
    },
    feedback:
      "Deterministic mock quality score. Output is evaluated locally without model-provider calls.",
    generatedByToolCallId: context.toolCallId,
    publicSafetyNote:
      "Mock quality score only. No external LLM judge, private rubric, or customer benchmark was called.",
  };
}
