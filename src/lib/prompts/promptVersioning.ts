import { getPromptById } from "@/lib/prompts/promptRegistry";
import type { PromptVersionComparison } from "@/lib/prompts/promptTypes";

function diffAdded(left: string[], right: string[]) {
  return right.filter((item) => !left.includes(item));
}

export function comparePromptVersions(promptAId: string, promptBId: string): PromptVersionComparison {
  const promptA = getPromptById(promptAId);
  const promptB = getPromptById(promptBId);

  if (!promptA || !promptB) {
    throw new Error(`Cannot compare missing prompts: ${promptAId}, ${promptBId}.`);
  }

  const addedVariables = diffAdded(promptA.variables, promptB.variables);
  const removedVariables = diffAdded(promptB.variables, promptA.variables);
  const addedCriteria = diffAdded(promptA.evaluationCriteria, promptB.evaluationCriteria);
  const removedCriteria = diffAdded(promptB.evaluationCriteria, promptA.evaluationCriteria);

  return {
    promptAId,
    promptBId,
    versionChange: `${promptA.version} -> ${promptB.version}`,
    statusChange: `${promptA.status} -> ${promptB.status}`,
    addedVariables,
    removedVariables,
    addedCriteria,
    removedCriteria,
    changeSummary: [
      promptB.changeNotes,
      addedVariables.length > 0 ? `Added variables: ${addedVariables.join(", ")}.` : "No variables added.",
      addedCriteria.length > 0 ? `Added criteria: ${addedCriteria.join(", ")}.` : "No criteria added.",
    ].join(" "),
  };
}
