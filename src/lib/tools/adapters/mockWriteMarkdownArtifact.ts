import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

export function mockWriteMarkdownArtifact(
  inputPayload: JsonObject,
  context: ToolAdapterContext,
): JsonObject {
  const title = typeof inputPayload.title === "string" ? inputPayload.title : "Mock Artifact";
  const body = typeof inputPayload.body === "string" ? inputPayload.body : "Mock artifact body.";

  return {
    adapterType: "mock",
    artifactId: `mock_markdown_${context.toolCallId}`,
    location: `mock-memory://artifacts/${context.toolCallId}.md`,
    markdown: `# ${title}\n\n${body}\n\n> Mock public-safe artifact. No file was written.`,
    publicSafetyNote:
      "In-memory mock markdown artifact only. No filesystem, CMS, or storage API write occurred.",
  };
}
