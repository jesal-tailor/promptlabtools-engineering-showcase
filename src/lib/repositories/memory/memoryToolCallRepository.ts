import {
  createRepositoryNotFoundError,
  memoryRepositoryPublicSafetyNote,
  type StoredToolCall,
  type ToolCallCreateInput,
  type ToolCallRepository,
} from "@/lib/repositories/repositoryTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

const seedToolCalls: StoredToolCall[] = [
  {
    toolCallId: "tool_call_seed_blocked_webhook",
    runId: "mock_run_seed",
    stepId: "approval_gate",
    agentId: "approval_agent",
    toolId: "send_mock_webhook",
    inputPayload: {
      eventName: "mock.event",
    },
    status: "blocked",
    errorMessage: "Disabled webhook example was blocked before execution.",
    riskLevel: "high",
    requiresApproval: true,
    createdAt: "2026-06-15T09:00:00.000Z",
    completedAt: "2026-06-15T09:00:00.000Z",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
  },
];

export function createMemoryToolCallRepository(): ToolCallRepository {
  const records = seedToolCalls.map((toolCall) => clone(toolCall));

  return {
    adapterType: "memory",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
    list: () => clone(records),
    getById: (id) => {
      const record = records.find((toolCall) => toolCall.toolCallId === id);

      return record
        ? { ok: true, record: clone(record) }
        : { ok: false, error: createRepositoryNotFoundError("Tool call", id) };
    },
    create: (input: ToolCallCreateInput) => {
      const record: StoredToolCall = {
        ...input,
        publicSafetyNote: input.publicSafetyNote || memoryRepositoryPublicSafetyNote,
      };
      const existingIndex = records.findIndex((toolCall) => toolCall.toolCallId === record.toolCallId);

      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }

      return { ok: true, record: clone(record) };
    },
    update: (id, input) => {
      const index = records.findIndex((toolCall) => toolCall.toolCallId === id);

      if (index < 0) {
        return { ok: false, error: createRepositoryNotFoundError("Tool call", id) };
      }

      records[index] = {
        ...records[index],
        ...input,
        publicSafetyNote: input.publicSafetyNote || records[index].publicSafetyNote,
      };

      return { ok: true, record: clone(records[index]) };
    },
    listByRunId: (runId) => clone(records.filter((toolCall) => toolCall.runId === runId)),
    listByRiskLevel: (riskLevel) => clone(records.filter((toolCall) => toolCall.riskLevel === riskLevel)),
  };
}
