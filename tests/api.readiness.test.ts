import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/readiness/route";

describe("GET /api/readiness", () => {
  it("returns passing mock readiness checks without enabling external integrations", async () => {
    const response = GET();
    const body = (await response.json()) as {
      checks: Array<{ name: string; status: string; detail: string }>;
      externalIntegrationsEnabled: boolean;
      publicSafe: boolean;
      status: string;
    };

    expect(response.status).toBe(200);
    expect(body.status).toBe("ready");
    expect(body.publicSafe).toBe(true);
    expect(body.externalIntegrationsEnabled).toBe(false);
    expect(body.checks.map((check) => check.name)).toEqual([
      "mock repository factory available",
      "mock workflow runner available",
      "mock tool registry available",
      "mock evaluation engine available",
      "no external integrations enabled",
    ]);
    expect(body.checks.every((check) => check.status === "pass")).toBe(true);
    expect(body.checks.at(-1)?.detail).toContain("production systems remain disabled");
  });
});
