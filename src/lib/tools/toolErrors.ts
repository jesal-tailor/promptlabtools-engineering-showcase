import type { RuntimeAgentId } from "@/lib/agents/agentTypes";
import type { ToolId } from "@/lib/tools/toolTypes";

export type ToolErrorCode =
  | "TOOL_NOT_FOUND"
  | "TOOL_DISABLED"
  | "TOOL_PERMISSION_DENIED"
  | "APPROVAL_REQUIRED"
  | "ADAPTER_FAILED"
  | "INVALID_INPUT";

export type ToolExecutionError = {
  code: ToolErrorCode;
  message: string;
  agentId?: RuntimeAgentId;
  toolId?: ToolId | string;
  safe: true;
};

export function createToolError({
  agentId,
  code,
  message,
  toolId,
}: {
  agentId?: RuntimeAgentId;
  code: ToolErrorCode;
  message: string;
  toolId?: ToolId | string;
}): ToolExecutionError {
  return {
    code,
    message,
    agentId,
    toolId,
    safe: true,
  };
}
