import { getPromptById } from "@/lib/prompts/promptRegistry";
import type { PromptRenderResult, PromptVariableValue } from "@/lib/prompts/promptTypes";

const variablePattern = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export function renderPromptTemplate(
  promptId: string,
  variables: Record<string, PromptVariableValue>,
): PromptRenderResult {
  const prompt = getPromptById(promptId);

  if (!prompt) {
    return { ok: false, promptId, errors: [`Prompt ${promptId} was not found.`] };
  }

  const missingVariables = prompt.variables.filter((variableName) => variables[variableName] === undefined);

  if (missingVariables.length > 0) {
    return {
      ok: false,
      promptId,
      errors: missingVariables.map((variableName) => `Missing required variable: ${variableName}.`),
    };
  }

  return {
    ok: true,
    promptId,
    renderedPrompt: prompt.template.replace(variablePattern, (_match, variableName: string) =>
      String(variables[variableName]),
    ),
    usedVariables: Object.fromEntries(
      prompt.variables.map((variableName) => [variableName, variables[variableName]]),
    ),
  };
}
