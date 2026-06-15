import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

export function mockSendWebhook(inputPayload: JsonObject, context: ToolAdapterContext): JsonObject {
  const eventName = typeof inputPayload.eventName === "string" ? inputPayload.eventName : "mock.event";

  return {
    adapterType: "mock",
    eventName,
    deliveryId: `mock_webhook_${context.toolCallId}`,
    destination: "mock://disabled-webhook-sandbox",
    publicSafetyNote:
      "Mock webhook payload only. No HTTP request was sent, and this tool is disabled in the registry.",
  };
}
