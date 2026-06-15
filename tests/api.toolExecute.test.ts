import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "../src/app/api/tools/execute/route";
import { resetToolAuditEventsForTests } from "../src/lib/tools/toolAuditLog";

function createJsonRequest(body: unknown) {
  return new Request("http://localhost/api/tools/execute", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
}

describe("POST /api/tools/execute", () => {
  beforeEach(() => {
    resetToolAuditEventsForTests();
  });

  it("returns 400 for invalid input", async () => {
    const response = await POST(createJsonRequest({ toolId: "score_content_quality" }));
    const body = (await response.json()) as { ok: boolean; errors: string[] };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toContain("runId is required and must be at least 3 characters.");
  });

  it("returns blocked result for approval-required execution without approval", async () => {
    const response = await POST(
      createJsonRequest({
        agentId: "approval_agent",
        inputPayload: {
          body: "Mock body",
          headline: "Mock headline",
          title: "Mock package",
        },
        runId: "mock_run_api",
        stepId: "publish_package",
        toolId: "create_mock_publish_package",
      }),
    );
    const body = (await response.json()) as {
      ok: boolean;
      status: string;
      result: { error: { code: string }; toolCall: { status: string } };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(false);
    expect(body.status).toBe("blocked");
    expect(body.result.error.code).toBe("APPROVAL_REQUIRED");
  });

  it("executes an approved high-risk mock tool", async () => {
    const response = await POST(
      createJsonRequest({
        agentId: "approval_agent",
        approved: true,
        inputPayload: {
          body: "Mock body",
          headline: "Mock headline",
          title: "Mock package",
        },
        runId: "mock_run_api",
        stepId: "publish_package",
        toolId: "create_mock_publish_package",
      }),
    );
    const body = (await response.json()) as {
      ok: boolean;
      status: string;
      result: { toolCall: { outputPayload: { destination: string }; status: string } };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe("executed");
    expect(body.result.toolCall.outputPayload.destination).toBe("mock://publish-package-preview");
  });
});
