import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

export function mockFetchMetrics(inputPayload: JsonObject, context: ToolAdapterContext): JsonObject {
  const metricScope = typeof inputPayload.metricScope === "string" ? inputPayload.metricScope : "showcase";

  return {
    adapterType: "mock",
    metricScope,
    impressions: 1240,
    approvalsPending: 1,
    evaluationPassRate: 0.92,
    generatedByToolCallId: context.toolCallId,
    publicSafetyNote:
      "Deterministic fixture metrics only. No analytics, CRM, product, or customer data source was queried.",
  };
}
