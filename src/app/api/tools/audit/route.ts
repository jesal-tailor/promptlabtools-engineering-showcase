import { NextResponse } from "next/server";
import { createRepositoryContext } from "@/lib/repositories/repositoryFactory";
import { getToolAuditEvents } from "@/lib/tools/toolAuditLog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId") ?? undefined;
  const toolId = searchParams.get("toolId") ?? undefined;
  const repositories = createRepositoryContext();
  const repositoryAuditEvents = repositories.auditEventRepository
    .list()
    .filter((event) => (!runId || event.runId === runId) && (!toolId || event.metadata.toolId === toolId));

  return NextResponse.json({
    ok: true,
    auditEvents: getToolAuditEvents({ runId, toolId }),
    repositoryAuditEvents,
    repository: {
      adapterType: repositories.auditEventRepository.adapterType,
      publicSafetyNote: repositories.auditEventRepository.publicSafetyNote,
    },
    note: "Mock public-safe audit log only. Events are deterministic in-memory records and not production audit data.",
  });
}
