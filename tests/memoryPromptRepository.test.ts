import { describe, expect, it } from "vitest";
import { createMemoryPromptRepository } from "../src/lib/repositories/memory/memoryPromptRepository";

describe("memory prompt repository", () => {
  it("returns seeded prompts and safe missing results", () => {
    const repository = createMemoryPromptRepository();
    const seeded = repository.getById("prompt_campaign_planner_v2");
    const missing = repository.getById("missing_prompt");

    expect(seeded.ok).toBe(true);
    if (seeded.ok) {
      expect(seeded.record.status).toBe("active");
      expect(seeded.record.ownerAgentId).toBe("planner_agent");
    }

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.code).toBe("not_found");
    }
  });

  it("creates and updates prompt registry records", () => {
    const repository = createMemoryPromptRepository();
    const created = repository.create({
      id: "prompt_repo_test",
      name: "Repository Prompt",
      version: "1.0.0-mock",
      ownerAgentId: "qa_agent",
      status: "draft",
      template: "Evaluate {{outputType}} with public-safe criteria.",
      variables: ["outputType"],
      evaluationCriteria: ["risk", "governanceFit"],
      changeNotes: "Repository boundary test prompt.",
      createdAt: "2026-06-15T12:00:00.000Z",
    });

    expect(created.ok).toBe(true);
    const updated = repository.update("prompt_repo_test", {
      status: "active",
      changeNotes: "Activated in memory repository test.",
    });

    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.record.status).toBe("active");
    }
  });
});
