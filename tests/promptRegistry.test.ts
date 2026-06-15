import { describe, expect, it } from "vitest";
import { agentRegistry } from "../src/lib/agents/agentRegistry";
import { getActivePromptForAgent, getPromptById, promptRegistry } from "../src/lib/prompts/promptRegistry";

const runtimeAgentIds = new Set<string>(agentRegistry.map((agent) => agent.id));

describe("prompt registry", () => {
  it("contains public-safe prompt metadata with required fields", () => {
    expect(promptRegistry.length).toBeGreaterThanOrEqual(5);

    for (const prompt of promptRegistry) {
      expect(prompt.id).toMatch(/^prompt_/);
      expect(prompt.name.length).toBeGreaterThan(2);
      expect(prompt.version).toContain("mock");
      expect(runtimeAgentIds.has(prompt.ownerAgentId)).toBe(true);
      expect(["draft", "active", "deprecated"]).toContain(prompt.status);
      expect(prompt.template).toContain("{{");
      expect(prompt.variables.length).toBeGreaterThan(0);
      expect(prompt.evaluationCriteria.length).toBeGreaterThan(0);
    }
  });

  it("returns active prompt by runtime agent", () => {
    const prompt = getActivePromptForAgent("planner_agent");

    expect(prompt?.id).toBe("prompt_campaign_planner_v2");
    expect(prompt?.status).toBe("active");
  });

  it("keeps deprecated prompts discoverable for audit", () => {
    const prompt = getPromptById("prompt_campaign_planner_v1");

    expect(prompt?.status).toBe("deprecated");
    expect(prompt?.replacedByPromptId).toBe("prompt_campaign_planner_v2");
  });
});
