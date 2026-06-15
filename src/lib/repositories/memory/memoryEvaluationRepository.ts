import { evaluationHistory } from "@/lib/evaluations/evaluationHistory";
import type { EvaluationRun } from "@/lib/evaluations/evaluationTypes";
import {
  createRepositoryNotFoundError,
  memoryRepositoryPublicSafetyNote,
  type EvaluationRepository,
} from "@/lib/repositories/repositoryTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function createMemoryEvaluationRepository(): EvaluationRepository {
  const records = evaluationHistory.map((evaluation) => clone(evaluation));

  return {
    adapterType: "memory",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
    list: () => clone(records),
    getById: (id) => {
      const record = records.find((evaluation) => evaluation.id === id);

      return record
        ? { ok: true, record: clone(record) }
        : { ok: false, error: createRepositoryNotFoundError("Evaluation run", id) };
    },
    create: (input: EvaluationRun) => {
      const record = clone(input);
      const existingIndex = records.findIndex((evaluation) => evaluation.id === record.id);

      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }

      return { ok: true, record: clone(record) };
    },
    update: (id, input) => {
      const index = records.findIndex((evaluation) => evaluation.id === id);

      if (index < 0) {
        return { ok: false, error: createRepositoryNotFoundError("Evaluation run", id) };
      }

      records[index] = {
        ...records[index],
        ...input,
      };

      return { ok: true, record: clone(records[index]) };
    },
  };
}
