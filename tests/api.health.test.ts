import { describe, expect, it } from "vitest";
import { GET } from "../src/app/api/health/route";

describe("GET /api/health", () => {
  it("returns public-safe health metadata", async () => {
    const response = GET();
    const body = (await response.json()) as {
      externalCallsEnabled: boolean;
      publicSafe: boolean;
      service: string;
      status: string;
      timestamp: string;
    };

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.service).toBe("promptlabtools-engineering-showcase");
    expect(body.publicSafe).toBe(true);
    expect(body.externalCallsEnabled).toBe(false);
    expect(Date.parse(body.timestamp)).not.toBeNaN();
  });
});
