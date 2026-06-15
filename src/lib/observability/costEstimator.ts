import type { RuntimeAgentId, AgentTokenUsage } from "@/lib/agents/agentTypes";

const agentTokenBaselines: Record<RuntimeAgentId, AgentTokenUsage> = {
  planner_agent: { promptTokens: 900, completionTokens: 360 },
  drafting_agent: { promptTokens: 1200, completionTokens: 720 },
  qa_agent: { promptTokens: 820, completionTokens: 310 },
  approval_agent: { promptTokens: 420, completionTokens: 180 },
};

const mockCostPerThousandTokensUsd = 0.01;

export type MockCostEstimate = AgentTokenUsage & {
  totalTokens: number;
  estimatedCostUsd: number;
};

export function estimateAgentTokens(agentId: RuntimeAgentId, inputText: string): AgentTokenUsage {
  const baseline = agentTokenBaselines[agentId];
  const inputFactor = Math.max(1, Math.ceil(inputText.length / 80));

  return {
    promptTokens: baseline.promptTokens + inputFactor * 24,
    completionTokens: baseline.completionTokens + inputFactor * 12,
  };
}

export function estimateWorkflowCost(usages: AgentTokenUsage[]): MockCostEstimate {
  const totals = usages.reduce(
    (summary, usage) => ({
      promptTokens: summary.promptTokens + usage.promptTokens,
      completionTokens: summary.completionTokens + usage.completionTokens,
    }),
    { promptTokens: 0, completionTokens: 0 },
  );
  const totalTokens = totals.promptTokens + totals.completionTokens;

  return {
    ...totals,
    totalTokens,
    estimatedCostUsd: Number(((totalTokens / 1000) * mockCostPerThousandTokensUsd).toFixed(4)),
  };
}
