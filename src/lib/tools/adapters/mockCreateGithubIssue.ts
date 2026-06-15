import type { JsonObject, ToolAdapterContext } from "@/lib/tools/toolTypes";

export function mockCreateGithubIssue(inputPayload: JsonObject, context: ToolAdapterContext): JsonObject {
  const title = typeof inputPayload.title === "string" ? inputPayload.title : "Mock governance follow-up";
  const body = typeof inputPayload.body === "string" ? inputPayload.body : "Mock issue body.";

  return {
    adapterType: "mock",
    issueId: `mock_issue_${context.toolCallId}`,
    title,
    body,
    url: "mock://github/issues/mock_issue",
    publicSafetyNote:
      "Mock GitHub issue payload only. No GitHub API request or real repository mutation occurred.",
  };
}
