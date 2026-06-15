import { describe, expect, it } from "vitest";
import {
  runCampaignPublishPackageWorkflow,
  runCampaignWorkflowWithApprovalDecision,
} from "../src/lib/workflows/workflowRunner";

const campaignGoal = "Launch a public-safe AI workflow showcase for CV reviewers";

describe("workflow tool integration", () => {
  it("includes tool calls and tool trace events in the runtime sample", () => {
    const result = runCampaignPublishPackageWorkflow({ campaignGoal });

    expect(result.toolCalls.map((toolCall) => toolCall.toolId)).toEqual([
      "write_mock_markdown_artifact",
      "score_content_quality",
      "create_mock_publish_package",
    ]);
    expect(result.toolCalls.at(-1)?.status).toBe("blocked");
    expect(result.traceEvents.map((event) => event.type)).toContain("tool_blocked");
    expect(result.traceEvents.map((event) => event.type)).toContain("tool_executed");
  });

  it("executes publish package tool after approval", () => {
    const result = runCampaignWorkflowWithApprovalDecision({
      approvalDecision: "approved",
      campaignGoal,
      decidedBy: "mock_reviewer@example.test",
      reviewerComment: "Approved for mock package generation.",
    });

    expect(result.toolCalls.map((toolCall) => toolCall.toolId)).toContain("generate_mock_utm_url");
    expect(result.toolCalls.map((toolCall) => toolCall.toolId)).toContain("create_mock_publish_package");
    expect(result.toolCalls.find((toolCall) => toolCall.toolId === "create_mock_publish_package")?.status).toBe(
      "executed",
    );
  });
});
