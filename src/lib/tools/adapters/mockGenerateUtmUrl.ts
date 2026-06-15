import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function mockGenerateUtmUrl(inputPayload: JsonObject, context: ToolAdapterContext): JsonObject {
  const campaign = typeof inputPayload.campaign === "string" ? inputPayload.campaign : "mock-campaign";
  const source = typeof inputPayload.source === "string" ? inputPayload.source : "promptlabtools-showcase";
  const medium = typeof inputPayload.medium === "string" ? inputPayload.medium : "mock-workflow";
  const slug = slugify(campaign) || "mock-campaign";

  return {
    adapterType: "mock",
    url: `https://example.test/${slug}?utm_source=${slugify(source)}&utm_medium=${slugify(medium)}&utm_campaign=${slug}`,
    campaignSlug: slug,
    generatedByToolCallId: context.toolCallId,
    publicSafetyNote:
      "Mock UTM URL only. No analytics provider, tracking service, or production destination was called.",
  };
}
