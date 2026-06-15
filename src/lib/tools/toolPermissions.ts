import type { RuntimeAgentId } from "@/lib/agents/agentTypes";
import { createToolError, type ToolExecutionError } from "@/lib/tools/toolErrors";
import { getToolById } from "@/lib/tools/toolRegistry";
import type { ToolDefinition, ToolId } from "@/lib/tools/toolTypes";

export type ToolPermissionDecision =
  | {
      ok: true;
      tool: ToolDefinition;
      decision: "allowed" | "approval_required";
      message: string;
    }
  | {
      ok: false;
      tool?: ToolDefinition;
      decision: "blocked";
      error: ToolExecutionError;
      message: string;
    };

function isAllowedAgent(tool: ToolDefinition, agentId: RuntimeAgentId | string) {
  return tool.allowedAgentIds.includes(agentId as RuntimeAgentId);
}

export function canAgentUseTool(agentId: RuntimeAgentId | string, toolId: ToolId | string): boolean {
  const tool = getToolById(toolId);

  return Boolean(tool?.enabled && isAllowedAgent(tool, agentId));
}

export function assertToolPermission(
  agentId: RuntimeAgentId,
  toolId: ToolId | string,
): ToolPermissionDecision {
  const tool = getToolById(toolId);

  if (!tool) {
    const error = createToolError({
      agentId,
      code: "TOOL_NOT_FOUND",
      message: `Tool ${toolId} is not registered. Unknown tools fail safely.`,
      toolId,
    });

    return { ok: false, decision: "blocked", error, message: error.message };
  }

  if (!tool.enabled) {
    const error = createToolError({
      agentId,
      code: "TOOL_DISABLED",
      message: `Tool ${tool.id} is disabled and cannot be executed.`,
      toolId,
    });

    return { ok: false, tool, decision: "blocked", error, message: error.message };
  }

  if (!isAllowedAgent(tool, agentId)) {
    const error = createToolError({
      agentId,
      code: "TOOL_PERMISSION_DENIED",
      message: `${agentId} is not permitted to execute ${tool.id}.`,
      toolId,
    });

    return { ok: false, tool, decision: "blocked", error, message: error.message };
  }

  return {
    ok: true,
    tool,
    decision: tool.requiresApproval || tool.riskLevel === "high" ? "approval_required" : "allowed",
    message:
      tool.requiresApproval || tool.riskLevel === "high"
        ? `${tool.id} is permitted for ${agentId} but requires approval before execution.`
        : `${tool.id} is permitted for ${agentId}.`,
  };
}

export function shouldBlockToolExecution(toolId: ToolId | string): boolean {
  const tool = getToolById(toolId);

  return !tool || !tool.enabled || tool.requiresApproval || tool.riskLevel === "high";
}

export function explainToolPermissionDecision(
  agentId: RuntimeAgentId,
  toolId: ToolId | string,
): ToolPermissionDecision {
  return assertToolPermission(agentId, toolId);
}
