import { beforeEach, describe, expect, it } from "vitest";
import {
  getToolAuditEvents,
  resetToolAuditEventsForTests,
} from "../src/lib/tools/toolAuditLog";
import { executeToolCall } from "../src/lib/tools/toolExecutor";

describe("tool audit log", () => {
  beforeEach(() => {
    resetToolAuditEventsForTests();
  });

  it("starts with a public-safe blocked webhook seed event", () => {
    const events = getToolAuditEvents();

    expect(events).toHaveLength(1);
    expect(events[0].toolId).toBe("send_mock_webhook");
    expect(events[0].status).toBe("blocked");
  });

  it("appends audit events for executed tool calls", () => {
    const result = executeToolCall({
      agentId: "qa_agent",
      inputPayload: {
        content: "Mock public-safe approval review.",
      },
      runId: "mock_run_audit",
      stepId: "qa_agent",
      toolId: "score_content_quality",
    });
    const events = getToolAuditEvents({ runId: "mock_run_audit" });

    expect(result.auditEvent.status).toBe("executed");
    expect(events).toHaveLength(1);
    expect(events[0].publicSafetyNote).toContain("Mock public-safe tool audit event");
  });
});
