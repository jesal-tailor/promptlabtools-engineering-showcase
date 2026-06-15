import type { AgentDefinition, RuntimeAgentId } from "@/lib/agents/agentTypes";
import { approvalAgent } from "@/lib/agents/approvalAgent";
import { draftingAgent } from "@/lib/agents/draftingAgent";
import { plannerAgent } from "@/lib/agents/plannerAgent";
import { qaAgent } from "@/lib/agents/qaAgent";

export const agentRegistry: AgentDefinition[] = [
  plannerAgent,
  draftingAgent,
  qaAgent,
  approvalAgent,
];

export const agentRegistryById = new Map<RuntimeAgentId, AgentDefinition>(
  agentRegistry.map((agent) => [agent.id, agent]),
);

export function getRuntimeAgent(agentId: RuntimeAgentId) {
  return agentRegistryById.get(agentId);
}
