import { describe, expect, it } from "vitest";
import { POST as comparePromptVersionsRoute } from "../src/app/api/prompts/[promptId]/compare/route";

function createJsonRequest(body: unknown) {
  return new Request("http://localhost/api/prompts/prompt_campaign_planner_v1/compare", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
}

describe("POST /api/prompts/[promptId]/compare", () => {
  it("returns 400 when compareToPromptId is missing", async () => {
    const response = await comparePromptVersionsRoute(createJsonRequest({}), {
      params: Promise.resolve({ promptId: "prompt_campaign_planner_v1" }),
    });
    const body = (await response.json()) as { ok: boolean; errors: string[] };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toContain("compareToPromptId is required.");
  });

  it("returns a deterministic prompt comparison", async () => {
    const response = await comparePromptVersionsRoute(
      createJsonRequest({ compareToPromptId: "prompt_campaign_planner_v2" }),
      {
        params: Promise.resolve({ promptId: "prompt_campaign_planner_v1" }),
      },
    );
    const body = (await response.json()) as {
      ok: boolean;
      comparison: { versionChange: string; addedCriteria: string[] };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.comparison.versionChange).toBe("1.0.0-mock -> 2.0.0-mock");
    expect(body.comparison.addedCriteria).toContain("risk");
  });
});
