import type { ToolAuditEvent, ToolCall } from "@/lib/tools/toolTypes";

const publicSafetyNote =
  "Mock public-safe tool audit event only. No external API, webhook, file write, credential, or production PromptLabTools automation was used.";

export const initialToolAuditEvents: ToolAuditEvent[] = [
  {
    id: "tool_audit_seed_blocked_webhook",
    toolCallId: "tool_call_seed_blocked_webhook",
    runId: "mock_run_seed",
    stepId: "approval_gate",
    agentId: "approval_agent",
    toolId: "send_mock_webhook",
    status: "blocked",
    riskLevel: "high",
    requiresApproval: true,
    message: "Disabled webhook example was blocked before execution.",
    createdAt: "2026-06-15T09:00:00.000Z",
    completedAt: "2026-06-15T09:00:00.000Z",
    publicSafetyNote,
  },
];

const toolAuditEvents: ToolAuditEvent[] = [...initialToolAuditEvents];

export function createToolAuditEvent(toolCall: ToolCall): ToolAuditEvent {
  return {
    id: `tool_audit_${toolCall.toolCallId}`,
    toolCallId: toolCall.toolCallId,
    runId: toolCall.runId,
    stepId: toolCall.stepId,
    agentId: toolCall.agentId,
    toolId: toolCall.toolId,
    status: toolCall.status,
    riskLevel: toolCall.riskLevel,
    requiresApproval: toolCall.requiresApproval,
    message:
      toolCall.status === "executed"
        ? `${toolCall.toolId} executed through the mock adapter boundary.`
        : toolCall.errorMessage ?? `${toolCall.toolId} did not execute.`,
    createdAt: toolCall.createdAt,
    completedAt: toolCall.completedAt,
    publicSafetyNote,
  };
}

export function appendToolAuditEvent(toolCall: ToolCall): ToolAuditEvent {
  const event = createToolAuditEvent(toolCall);
  toolAuditEvents.push(event);

  return event;
}

export function getToolAuditEvents({
  runId,
  toolId,
}: {
  runId?: string;
  toolId?: string;
} = {}): ToolAuditEvent[] {
  return toolAuditEvents.filter(
    (event) => (!runId || event.runId === runId) && (!toolId || event.toolId === toolId),
  );
}

export function resetToolAuditEventsForTests() {
  toolAuditEvents.splice(0, toolAuditEvents.length, ...initialToolAuditEvents);
}
