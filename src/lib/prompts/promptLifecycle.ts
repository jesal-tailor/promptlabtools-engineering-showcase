import { getPromptById } from "@/lib/prompts/promptRegistry";
import type {
  PromptLifecycleStatus,
  PromptLifecycleTransitionResult,
} from "@/lib/prompts/promptTypes";

const allowedTransitions: Record<PromptLifecycleStatus, PromptLifecycleStatus[]> = {
  draft: ["active", "deprecated"],
  active: ["deprecated"],
  deprecated: [],
};

export function transitionPromptStatus(
  promptId: string,
  nextStatus: PromptLifecycleStatus,
): PromptLifecycleTransitionResult {
  const prompt = getPromptById(promptId);

  if (!prompt) {
    return {
      ok: false,
      promptId,
      previousStatus: "draft",
      requestedStatus: nextStatus,
      errors: [`Prompt ${promptId} was not found.`],
    };
  }

  if (!allowedTransitions[prompt.status].includes(nextStatus)) {
    return {
      ok: false,
      promptId,
      previousStatus: prompt.status,
      requestedStatus: nextStatus,
      errors: [
        prompt.status === "deprecated" && nextStatus === "active"
          ? "Deprecated prompts cannot become active without explicit replacement logic."
          : `Invalid prompt lifecycle transition from ${prompt.status} to ${nextStatus}.`,
      ],
    };
  }

  return {
    ok: true,
    promptId,
    previousStatus: prompt.status,
    newStatus: nextStatus,
    note: `Mock lifecycle transition only. ${prompt.id} would move from ${prompt.status} to ${nextStatus}.`,
  };
}

export function explainPromptLifecycleStatus(promptId: string): string {
  const prompt = getPromptById(promptId);

  if (!prompt) {
    return `Prompt ${promptId} was not found in the public-safe mock registry.`;
  }

  if (prompt.status === "active") {
    return `${prompt.name} ${prompt.version} is active for ${prompt.ownerAgentId} and can be used by deterministic mock runs.`;
  }

  if (prompt.status === "draft") {
    return `${prompt.name} ${prompt.version} is draft-only and must be evaluated before activation.`;
  }

  return `${prompt.name} ${prompt.version} is deprecated${
    prompt.replacedByPromptId ? ` and replaced by ${prompt.replacedByPromptId}` : ""
  }. It remains visible for audit and comparison.`;
}
