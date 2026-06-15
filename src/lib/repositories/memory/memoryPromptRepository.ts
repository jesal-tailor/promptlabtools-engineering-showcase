import { promptRegistry } from "@/lib/prompts/promptRegistry";
import type { PromptRegistryEntry } from "@/lib/prompts/promptTypes";
import {
  createRepositoryNotFoundError,
  memoryRepositoryPublicSafetyNote,
  type PromptRepository,
} from "@/lib/repositories/repositoryTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function createMemoryPromptRepository(): PromptRepository {
  const records = promptRegistry.map((prompt) => clone(prompt));

  return {
    adapterType: "memory",
    publicSafetyNote: memoryRepositoryPublicSafetyNote,
    list: () => clone(records),
    getById: (id) => {
      const record = records.find((prompt) => prompt.id === id);

      return record
        ? { ok: true, record: clone(record) }
        : { ok: false, error: createRepositoryNotFoundError("Prompt", id) };
    },
    create: (input: PromptRegistryEntry) => {
      const record = clone(input);
      const existingIndex = records.findIndex((prompt) => prompt.id === record.id);

      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }

      return { ok: true, record: clone(record) };
    },
    update: (id, input) => {
      const index = records.findIndex((prompt) => prompt.id === id);

      if (index < 0) {
        return { ok: false, error: createRepositoryNotFoundError("Prompt", id) };
      }

      records[index] = {
        ...records[index],
        ...input,
      };

      return { ok: true, record: clone(records[index]) };
    },
  };
}
