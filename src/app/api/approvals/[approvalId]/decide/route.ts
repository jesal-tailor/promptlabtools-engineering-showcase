import { NextResponse } from "next/server";
import { sampleApprovalRunId } from "@/lib/approvals/approvalAuditLog";
import { applyApprovalDecision } from "@/lib/approvals/approvalStateMachine";
import type { ApprovalDecision, ApprovalDecisionPayload } from "@/lib/approvals/approvalTypes";
import { createRepositoryContext } from "@/lib/repositories/repositoryFactory";

type ApprovalDecisionRouteContext = {
  params: Promise<{ approvalId: string }>;
};

const approvalDecisions: ApprovalDecision[] = ["approved", "rejected", "needs_changes"];

async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateApprovalDecisionBody({
  approvalId,
  body,
}: {
  approvalId: string;
  body: unknown;
}):
  | { ok: true; payload: ApprovalDecisionPayload }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const raw = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const decision = readString(raw.decision) as ApprovalDecision;
  const reviewerComment = readString(raw.reviewerComment);
  const decidedBy = readString(raw.decidedBy);
  const runId = readString(raw.runId) || sampleApprovalRunId;
  const stepId = readString(raw.stepId) || "approval_gate";
  const decidedAt = readString(raw.decidedAt) || "2026-06-15T10:30:00.000Z";

  if (!approvalDecisions.includes(decision)) {
    errors.push("decision must be one of: approved, rejected, needs_changes.");
  }

  if (reviewerComment.length < 8) {
    errors.push("reviewerComment must explain the mock approval decision in at least 8 characters.");
  }

  if (decidedBy.length < 2) {
    errors.push("decidedBy must identify the mock reviewer.");
  }

  if (!Date.parse(decidedAt)) {
    errors.push("decidedAt must be an ISO-compatible date string.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      approvalId,
      runId,
      stepId,
      decision,
      reviewerComment,
      decidedBy,
      decidedAt,
    },
  };
}

export async function POST(request: Request, context: ApprovalDecisionRouteContext) {
  const { approvalId } = await context.params;
  const body = await parseJson(request);
  const validation = validateApprovalDecisionBody({ approvalId, body });

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        errors: validation.errors,
        note: "Mock approval decision route only. No external service was called.",
      },
      { status: 400 },
    );
  }

  const repositories = createRepositoryContext();
  const result = applyApprovalDecision({
    payload: validation.payload,
    repositories,
  });

  return NextResponse.json({
    ok: true,
    approvalId,
    result,
    repository: {
      adapterType: repositories.approvalRepository.adapterType,
      persistedApproval: repositories.approvalRepository.getById(approvalId).ok,
      auditEvents: repositories.auditEventRepository.list().filter((event) => event.subjectId === approvalId).length,
      publicSafetyNote: repositories.approvalRepository.publicSafetyNote,
    },
    note: "Public-safe mock governance only. No database, identity provider, webhook, or production workflow was called.",
  });
}
