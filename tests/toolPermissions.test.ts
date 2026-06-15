import { describe, expect, it } from "vitest";
import {
  assertToolPermission,
  canAgentUseTool,
  explainToolPermissionDecision,
  shouldBlockToolExecution,
} from "../src/lib/tools/toolPermissions";

describe("tool permissions", () => {
  it("allows agents listed on enabled tools", () => {
    expect(canAgentUseTool("qa_agent", "score_content_quality")).toBe(true);
    expect(assertToolPermission("qa_agent", "score_content_quality").ok).toBe(true);
  });

  it("blocks agents that are not listed on the tool", () => {
    const decision = assertToolPermission("planner_agent", "score_content_quality");

    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.error.code).toBe("TOOL_PERMISSION_DENIED");
    }
  });

  it("blocks disabled and approval-required tools", () => {
    expect(shouldBlockToolExecution("send_mock_webhook")).toBe(true);
    expect(shouldBlockToolExecution("create_mock_publish_package")).toBe(true);
  });

  it("explains unknown tools safely", () => {
    const decision = explainToolPermissionDecision("qa_agent", "missing_tool");

    expect(decision.ok).toBe(false);
    if (!decision.ok) {
      expect(decision.error.code).toBe("TOOL_NOT_FOUND");
      expect(decision.message).toContain("Unknown tools fail safely");
    }
  });
});
