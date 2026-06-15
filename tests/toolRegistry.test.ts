import { describe, expect, it } from "vitest";
import { getToolById, toolRegistry } from "../src/lib/tools/toolRegistry";

describe("tool registry", () => {
  it("registers known mock tools with required fields", () => {
    expect(toolRegistry.map((tool) => tool.id)).toEqual([
      "generate_mock_utm_url",
      "create_mock_publish_package",
      "score_content_quality",
      "write_mock_markdown_artifact",
      "fetch_mock_metrics",
      "create_mock_github_issue",
      "send_mock_webhook",
    ]);

    for (const tool of toolRegistry) {
      expect(tool.name.length).toBeGreaterThan(3);
      expect(tool.allowedAgentIds.length).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(tool.riskLevel);
      expect(tool.adapterType).toBe("mock");
      expect(tool.inputSchemaName).toContain("Input");
      expect(tool.outputSchemaName).toContain("Output");
    }
  });

  it("keeps high-risk webhook disabled as a fail-closed example", () => {
    const tool = getToolById("send_mock_webhook");

    expect(tool?.enabled).toBe(false);
    expect(tool?.requiresApproval).toBe(true);
    expect(tool?.riskLevel).toBe("high");
  });
});
