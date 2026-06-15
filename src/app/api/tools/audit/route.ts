import { NextResponse } from "next/server";
import { getToolAuditEvents } from "@/lib/tools/toolAuditLog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId") ?? undefined;
  const toolId = searchParams.get("toolId") ?? undefined;

  return NextResponse.json({
    ok: true,
    auditEvents: getToolAuditEvents({ runId, toolId }),
    note: "Mock public-safe audit log only. Events are deterministic in-memory records and not production audit data.",
  });
}
