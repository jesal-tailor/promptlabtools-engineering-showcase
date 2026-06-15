import { approvals } from "@/lib/mockData/approvals";
import {
  createRepositoryNotFoundError,
  memoryRepositoryPublicSafetyNote,
  type ApprovalCreateInput,
  type ApprovalRepository,
  type ApprovalUpdateInput,
  type StoredApproval,
} from "@/lib/repositories/repositoryTypes";
import type { ApprovalStatus as UiApprovalStatus } from "@/types/approval";

const statusMap: Record<UiApprovalStatus, StoredApproval["status"]> = {
  approved: "approved",
  needs_changes: "needs_changes",
  pending: "pending_review",
  rejected: "rejected",
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function seedApprovals(): StoredApproval[] {
  return approvals.map((approval) => ({
    id: approval.id,
    runId: approval.runId,
    stepId: "approval_gate",
    status: statusMap[approval.status],
    riskLevel: approval.risk,
    reviewerRole: approval.reviewerRole,
    reason: approval.decisionNotes ?? approval.reason,
    createdAt: approval.createdAt,
    updatedAt: approval.decidedAt ?? approval.createdAt,
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
  }));
}

export function createMemoryApprovalRepository(): ApprovalRepository {
  const records = seedApprovals();

  return {
    adapterType: "memory",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
    list: () => clone(records),
    getById: (id) => {
      const record = records.find((approval) => approval.id === id);

      return record
        ? { ok: true, record: clone(record) }
        : { ok: false, error: createRepositoryNotFoundError("Approval", id) };
    },
    create: (input: ApprovalCreateInput) => {
      const record: StoredApproval = {
        ...input,
        updatedAt: input.updatedAt ?? input.createdAt,
        publicSafetyNote: input.publicSafetyNote || memoryRepositoryPublicSafetyNote,
      };
      const existingIndex = records.findIndex((approval) => approval.id === record.id);

      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }

      return { ok: true, record: clone(record) };
    },
    update: (id, input: ApprovalUpdateInput) => {
      const index = records.findIndex((approval) => approval.id === id);

      if (index < 0) {
        return { ok: false, error: createRepositoryNotFoundError("Approval", id) };
      }

      records[index] = {
        ...records[index],
        ...input,
        updatedAt: input.updatedAt ?? records[index].updatedAt,
      };

      return { ok: true, record: clone(records[index]) };
    },
  };
}
