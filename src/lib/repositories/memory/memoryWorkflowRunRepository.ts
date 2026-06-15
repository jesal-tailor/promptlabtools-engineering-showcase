import { workflowRuns } from "@/lib/mockData/workflowRuns";
import {
  createRepositoryNotFoundError,
  memoryRepositoryPublicSafetyNote,
  type StoredWorkflowRun,
  type StoredWorkflowStepEvent,
  type WorkflowRunCreateInput,
  type WorkflowRunRepository,
  type WorkflowRunUpdateInput,
  type WorkflowStepEventInput,
} from "@/lib/repositories/repositoryTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

function seedWorkflowRuns(): StoredWorkflowRun[] {
  return workflowRuns.map((run) => ({
    id: run.id,
    title: run.title,
    status: run.status,
    source: "fixture",
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    publicSafetyNote: run.publicSafetyNote,
  }));
}

function seedWorkflowEvents(): StoredWorkflowStepEvent[] {
  return workflowRuns.flatMap((run) =>
    run.trace.map((step, index) => ({
      id: `repo_event_${run.id}_${step.id}`,
      runId: run.id,
      sequence: index + 1,
      eventType: step.status,
      stepId: step.id,
      agentId: step.agentId,
      message: step.summary,
      createdAt: step.completedAt ?? step.startedAt,
      metadata: {
        costUsdEstimate: step.costUsdEstimate,
        inputArtifact: step.inputArtifact,
        outputArtifact: step.outputArtifact,
      },
      publicSafetyNote: memoryRepositoryPublicSafetyNote,
    })),
  );
}

export function createMemoryWorkflowRunRepository(): WorkflowRunRepository {
  const runs = seedWorkflowRuns();
  const events = seedWorkflowEvents();

  return {
    adapterType: "memory",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
    list: () => clone(runs),
    getById: (id) => {
      const record = runs.find((run) => run.id === id);

      return record
        ? { ok: true, record: clone(record) }
        : { ok: false, error: createRepositoryNotFoundError("Workflow run", id) };
    },
    create: (input: WorkflowRunCreateInput) => {
      const record: StoredWorkflowRun = {
        ...input,
        updatedAt: input.updatedAt ?? input.createdAt,
        publicSafetyNote: input.publicSafetyNote || memoryRepositoryPublicSafetyNote,
      };
      const existingIndex = runs.findIndex((run) => run.id === record.id);

      if (existingIndex >= 0) {
        runs[existingIndex] = record;
      } else {
        runs.push(record);
      }

      return { ok: true, record: clone(record) };
    },
    update: (id, input: WorkflowRunUpdateInput) => {
      const index = runs.findIndex((run) => run.id === id);

      if (index < 0) {
        return { ok: false, error: createRepositoryNotFoundError("Workflow run", id) };
      }

      runs[index] = {
        ...runs[index],
        ...input,
        updatedAt: input.updatedAt ?? runs[index].updatedAt,
      };

      return { ok: true, record: clone(runs[index]) };
    },
    appendEvent: (input: WorkflowStepEventInput) => {
      const record: StoredWorkflowStepEvent = {
        ...input,
        publicSafetyNote: input.publicSafetyNote || memoryRepositoryPublicSafetyNote,
      };
      events.push(record);

      return { ok: true, record: clone(record) };
    },
    listEvents: (runId) => clone(runId ? events.filter((event) => event.runId === runId) : events),
  };
}
