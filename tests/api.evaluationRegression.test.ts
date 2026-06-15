import { describe, expect, it } from "vitest";
import { POST as regressionCheckRoute } from "../src/app/api/evaluations/regression-check/route";

function createJsonRequest(body: unknown) {
  return new Request("http://localhost/api/evaluations/regression-check", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
}

describe("POST /api/evaluations/regression-check", () => {
  it("returns 400 when neither run IDs nor scores are provided", async () => {
    const response = await regressionCheckRoute(createJsonRequest({}));
    const body = (await response.json()) as { ok: boolean; errors: string[] };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors[0]).toContain("Provide baselineRunId and candidateRunId");
  });

  it("checks regression from evaluation run IDs", async () => {
    const response = await regressionCheckRoute(
      createJsonRequest({
        baselineRunId: "eval_hist_planner_v1",
        candidateRunId: "eval_hist_planner_v2",
      }),
    );
    const body = (await response.json()) as {
      ok: boolean;
      comparison: { scoreDelta: number };
      regression: { regressionDetected: boolean; severity: string };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.comparison.scoreDelta).toBe(11);
    expect(body.regression.regressionDetected).toBe(false);
    expect(body.regression.severity).toBe("none");
  });

  it("checks regression from explicit scores", async () => {
    const response = await regressionCheckRoute(
      createJsonRequest({
        baselineScore: 91,
        candidateScore: 80,
        threshold: 5,
      }),
    );
    const body = (await response.json()) as {
      ok: boolean;
      regression: { regressionDetected: boolean; severity: string };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.regression.regressionDetected).toBe(true);
    expect(body.regression.severity).toBe("major");
  });
});
