import { describe, expect, it } from "vitest";
import { mockCreateGithubIssue } from "../src/lib/tools/adapters/mockCreateGithubIssue";
import { mockCreatePublishPackage } from "../src/lib/tools/adapters/mockCreatePublishPackage";
import { mockFetchMetrics } from "../src/lib/tools/adapters/mockFetchMetrics";
import { mockGenerateUtmUrl } from "../src/lib/tools/adapters/mockGenerateUtmUrl";
import { mockScoreContentQuality } from "../src/lib/tools/adapters/mockScoreContentQuality";
import { mockSendWebhook } from "../src/lib/tools/adapters/mockSendWebhook";
import { mockWriteMarkdownArtifact } from "../src/lib/tools/adapters/mockWriteMarkdownArtifact";
import type { ToolAdapterContext } from "../src/lib/tools/toolTypes";

const context: ToolAdapterContext = {
  agentId: "qa_agent",
  createdAt: "2026-06-15T11:00:00.000Z",
  runId: "mock_run_adapter",
  stepId: "qa_agent",
  toolCallId: "tool_call_adapter",
};

describe("mock tool adapters", () => {
  it("returns deterministic outputs without external side effects", () => {
    expect(mockGenerateUtmUrl({ campaign: "Launch Showcase" }, context).url).toContain(
      "utm_campaign=launch-showcase",
    );
    expect(mockCreatePublishPackage({ title: "Mock", headline: "Mock", body: "Body" }, context).destination).toBe(
      "mock://publish-package-preview",
    );
    expect(mockScoreContentQuality({ content: "Mock public-safe approval review" }, context).score).toBe(93);
    expect(mockWriteMarkdownArtifact({ title: "Doc", body: "Body" }, context).location).toContain(
      "mock-memory://",
    );
    expect(mockFetchMetrics({ metricScope: "showcase" }, context).impressions).toBe(1240);
    expect(mockCreateGithubIssue({ title: "Issue", body: "Body" }, context).url).toBe(
      "mock://github/issues/mock_issue",
    );
    expect(mockSendWebhook({ eventName: "mock.event" }, context).destination).toBe(
      "mock://disabled-webhook-sandbox",
    );
  });
});
