import { beforeEach, describe, expect, it } from "vitest";
import { resetToolAuditEventsForTests } from "../src/lib/tools/toolAuditLog";
import { executeToolCall } from "../src/lib/tools/toolExecutor";

describe("tool executor", () => {
  beforeEach(() => {
    resetToolAuditEventsForTests();
  });

  it("executes an allowed low/medium-risk mock tool", () => {
    const result = executeToolCall({
      agentId: "qa_agent",
      inputPayload: {
        content: "Mock public-safe content with approval review and clear CTA.",
      },
      runId: "mock_run_test",
      stepId: "qa_agent",
      toolId: "score_content_quality",
    });

    expect(result.ok).toBe(true);
    expect(result.toolCall.status).toBe("executed");
    expect(result.traceEvent.type).toBe("tool_executed");
    expect(result.toolCall.outputPayload?.publicSafetyNote).toContain("Mock quality score only");
    expect(result.toolCall.outputPayload?.score).toBe(93);
  });

  it("blocks a disallowed agent", () => {
    const result = executeToolCall({
      agentId: "planner_agent",
      inputPayload: {
        content: "Mock content",
      },
      runId: "mock_run_test",
      stepId: "planner_agent",
      toolId: "score_content_quality",
    });

    expect(result.ok).toBe(false);
    expect(result.toolCall.status).toBe("blocked");
    expect(result.error?.code).toBe("TOOL_PERMISSION_DENIED");
  });

  it("blocks disabled tools", () => {
    const result = executeToolCall({
      agentId: "approval_agent",
      inputPayload: {
        eventName: "mock.event",
      },
      runId: "mock_run_test",
      stepId: "approval_gate",
      toolId: "send_mock_webhook",
    });

    expect(result.ok).toBe(false);
    expect(result.toolCall.status).toBe("blocked");
    expect(result.error?.code).toBe("TOOL_DISABLED");
  });

  it("fails unknown tools safely", () => {
    const result = executeToolCall({
      agentId: "qa_agent",
      inputPayload: {},
      runId: "mock_run_test",
      stepId: "qa_agent",
      toolId: "missing_tool",
    });

    expect(result.ok).toBe(false);
    expect(result.toolCall.status).toBe("failed");
    expect(result.error?.code).toBe("TOOL_NOT_FOUND");
  });

  it("requires approval for high-risk tools", () => {
    const result = executeToolCall({
      agentId: "approval_agent",
      inputPayload: {
        body: "Mock body",
        headline: "Mock headline",
        title: "Mock package",
      },
      runId: "mock_run_test",
      stepId: "publish_package",
      toolId: "create_mock_publish_package",
    });

    expect(result.ok).toBe(false);
    expect(result.toolCall.status).toBe("blocked");
    expect(result.error?.code).toBe("APPROVAL_REQUIRED");
  });

  it("executes approved high-risk mock tools", () => {
    const result = executeToolCall({
      agentId: "approval_agent",
      approved: true,
      inputPayload: {
        body: "Mock body",
        headline: "Mock headline",
        title: "Mock package",
      },
      runId: "mock_run_test",
      stepId: "publish_package",
      toolId: "create_mock_publish_package",
    });

    expect(result.ok).toBe(true);
    expect(result.toolCall.status).toBe("executed");
    expect(result.toolCall.outputPayload?.destination).toBe("mock://publish-package-preview");
  });
});
