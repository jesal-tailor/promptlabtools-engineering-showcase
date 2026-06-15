import { mockApprovalSimulation } from "@/lib/approvals/approvalAuditLog";
import {
  createRepositoryNotFoundError,
  memoryRepositoryPublicSafetyNote,
  type AuditEventInput,
  type AuditEventRepository,
  type StoredAuditEvent,
} from "@/lib/repositories/repositoryTypes";
import { initialToolAuditEvents } from "@/lib/tools/toolAuditLog";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function seedAuditEvents(): StoredAuditEvent[] {
  return [
    {
      id: "repo_audit_seed_pending_approval",
      domain: "approval",
      type: "approval_pending",
      subjectId: mockApprovalSimulation.approvalId,
      runId: mockApprovalSimulation.runId,
      message: mockApprovalSimulation.reviewerComment,
      createdAt: "2026-06-15T10:00:00.000Z",
      metadata: {
        riskLevel: mockApprovalSimulation.riskLevel,
        reviewerRole: mockApprovalSimulation.reviewerRole,
      },
      publicSafetyNote: memoryRepositoryPublicSafetyNote,
    },
    ...initialToolAuditEvents.map<StoredAuditEvent>((event) => ({
      id: `repo_${event.id}`,
      domain: "tool",
      type: "tool_call_recorded",
      subjectId: event.toolCallId,
      runId: event.runId,
      message: event.message,
      createdAt: event.createdAt,
      metadata: {
        riskLevel: event.riskLevel,
        status: event.status,
        toolId: event.toolId,
      },
      publicSafetyNote: memoryRepositoryPublicSafetyNote,
    })),
  ];
}

export function createMemoryAuditEventRepository(): AuditEventRepository {
  const records = seedAuditEvents();

  return {
    adapterType: "memory",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
    list: () => clone(records),
    getById: (id) => {
      const record = records.find((event) => event.id === id);

      return record
        ? { ok: true, record: clone(record) }
        : { ok: false, error: createRepositoryNotFoundError("Audit event", id) };
    },
    appendEvent: (input: AuditEventInput) => {
      const record: StoredAuditEvent = {
        ...input,
        publicSafetyNote: input.publicSafetyNote || memoryRepositoryPublicSafetyNote,
      };
      records.push(record);

      return { ok: true, record: clone(record) };
    },
  };
}
