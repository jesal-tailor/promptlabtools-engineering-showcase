import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/approvals/[approvalId]/decide/route";

function createJsonRequest(body: unknown) {
  return new Request("http://localhost/api/approvals/approval_test/decide", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
}

const routeContext = {
  params: Promise.resolve({ approvalId: "approval_test" }),
};

describe("POST /api/approvals/[approvalId]/decide", () => {
  it("returns 400 for invalid input", async () => {
    const response = await POST(createJsonRequest({ decision: "maybe" }), routeContext);
    const body = (await response.json()) as { ok: boolean; errors: string[] };

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toContain("decision must be one of: approved, rejected, needs_changes.");
  });

  it("returns an audit event for a valid approval decision", async () => {
    const response = await POST(
      createJsonRequest({
        decision: "approved",
        reviewerComment: "Approved for public-safe mock preview.",
        decidedBy: "mock_reviewer@example.test",
      }),
      routeContext,
    );
    const body = (await response.json()) as {
      ok: boolean;
      result: {
        newStatus: string;
        workflowAction: string;
        auditEvent: { id: string; approvalId: string };
      };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result.newStatus).toBe("approved");
    expect(body.result.workflowAction).toBe("continue_workflow");
    expect(body.result.auditEvent.id).toBe("audit_approval_test_approved");
    expect(body.result.auditEvent.approvalId).toBe("approval_test");
  });
});
