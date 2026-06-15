export type PromptLifecycleStatus = "draft" | "active" | "deprecated";

export type PromptVariableValue = string | number | boolean;

export type PromptRegistryEntry = {
  id: string;
  name: string;
  version: string;
  ownerAgentId: string;
  status: PromptLifecycleStatus;
  template: string;
  variables: string[];
  evaluationCriteria: string[];
  changeNotes: string;
  createdAt: string;
  deprecatedAt?: string;
  replacedByPromptId?: string;
};

export type PromptRenderResult =
  | {
      ok: true;
      promptId: string;
      renderedPrompt: string;
      usedVariables: Record<string, PromptVariableValue>;
    }
  | {
      ok: false;
      promptId: string;
      errors: string[];
    };

export type PromptVersionComparison = {
  promptAId: string;
  promptBId: string;
  versionChange: string;
  statusChange: string;
  addedVariables: string[];
  removedVariables: string[];
  addedCriteria: string[];
  removedCriteria: string[];
  changeSummary: string;
};

export type PromptLifecycleTransitionResult =
  | {
      ok: true;
      promptId: string;
      previousStatus: PromptLifecycleStatus;
      newStatus: PromptLifecycleStatus;
      note: string;
    }
  | {
      ok: false;
      promptId: string;
      previousStatus: PromptLifecycleStatus;
      requestedStatus: PromptLifecycleStatus;
      errors: string[];
    };
