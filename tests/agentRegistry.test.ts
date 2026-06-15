import { describe, expect, it } from "vitest";
import { agentRegistry } from "../src/lib/agents/agentRegistry";

describe("agent registry", () => {
  it("registers all required deterministic mock agents", () => {
    expect(agentRegistry.map((agent) => agent.id)).toEqual([
      "planner_agent",
      "drafting_agent",
      "qa_agent",
      "approval_agent",
    ]);
  });

  it("defines required fields for every registered agent", () => {
    for (const agent of agentRegistry) {
      expect(agent.name).toBeTruthy();
      expect(agent.role).toBeTruthy();
      expect(agent.systemPrompt).toContain("Mock");
      expect(agent.allowedTools.length).toBeGreaterThan(0);
      expect(["low", "medium", "high"]).toContain(agent.riskLevel);
      expect(agent.inputSchemaName).toBeTruthy();
      expect(agent.outputSchemaName).toBeTruthy();
    }
  });
});
