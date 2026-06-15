import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

export function mockCreatePublishPackage(
  inputPayload: JsonObject,
  context: ToolAdapterContext,
): JsonObject {
  const title = typeof inputPayload.title === "string" ? inputPayload.title : "Mock Publish Package";
  const headline = typeof inputPayload.headline === "string" ? inputPayload.headline : "Mock headline";
  const body = typeof inputPayload.body === "string" ? inputPayload.body : "Mock body";
  const utmUrl = typeof inputPayload.utmUrl === "string" ? inputPayload.utmUrl : "https://example.test/mock";

  return {
    adapterType: "mock",
    packageId: `mock_publish_package_${context.runId}`,
    title,
    headline,
    body,
    previewUrl: utmUrl,
    destination: "mock://publish-package-preview",
    approvalWasRequired: true,
    publicSafetyNote:
      "Preview-only mock publish package. No social publishing, email send, webhook, or production automation occurred.",
  };
}
