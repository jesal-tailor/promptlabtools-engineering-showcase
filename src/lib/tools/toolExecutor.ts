import { createTraceEvent } from "@/lib/observability/traceEvents";
import { mockCreateGithubIssue } from "@/lib/tools/adapters/mockCreateGithubIssue";
import { mockCreatePublishPackage } from "@/lib/tools/adapters/mockCreatePublishPackage";
import { mockFetchMetrics } from "@/lib/tools/adapters/mockFetchMetrics";
import { mockGenerateUtmUrl } from "@/lib/tools/adapters/mockGenerateUtmUrl";
import { mockScoreContentQuality } from "@/lib/tools/adapters/mockScoreContentQuality";
import { mockSendWebhook } from "@/lib/tools/adapters/mockSendWebhook";
import { mockWriteMarkdownArtifact } from "@/lib/tools/adapters/mockWriteMarkdownArtifact";
import { appendToolAuditEvent } from "@/lib/tools/toolAuditLog";
import { createToolError, type ToolExecutionError } from "@/lib/tools/toolErrors";
import { assertToolPermission } from "@/lib/tools/toolPermissions";
import type {
  ToolAdapter,
  ToolCall,
  ToolExecutionInput,
  ToolExecutionResult,
  ToolId,
  ToolRiskLevel,
} from "@/lib/tools/toolTypes";

const defaultCreatedAt = "2026-06-15T11:00:00.000Z";

const adapterByToolId: Record<ToolId, ToolAdapter> = {
  create_mock_github_issue: mockCreateGithubIssue,
  create_mock_publish_package: mockCreatePublishPackage,
  fetch_mock_metrics: mockFetchMetrics,
  generate_mock_utm_url: mockGenerateUtmUrl,
  score_content_quality: mockScoreContentQuality,
  send_mock_webhook: mockSendWebhook,
  write_mock_markdown_artifact: mockWriteMarkdownArtifact,
};

function completedAtFor(createdAt: string) {
  return new Date(Date.parse(createdAt) + 500).toISOString();
}

function createToolCallId({ runId, stepId, toolId }: ToolExecutionInput) {
  return `tool_call_${runId}_${stepId}_${toolId}`.replace(/[^a-zA-Z0-9_]+/g, "_");
}

function createNonExecutedResult({
  error,
  input,
  requiresApproval,
  riskLevel,
  status,
}: {
  error: ToolExecutionError;
  input: ToolExecutionInput;
  requiresApproval: boolean;
  riskLevel: ToolRiskLevel;
  status: "blocked" | "failed";
}): ToolExecutionResult {
  const createdAt = input.createdAt ?? defaultCreatedAt;
  const completedAt = input.completedAt ?? completedAtFor(createdAt);
  const toolCall: ToolCall = {
    toolCallId: input.toolCallId ?? createToolCallId(input),
    runId: input.runId,
    stepId: input.stepId,
    agentId: input.agentId,
    toolId: input.toolId,
    inputPayload: input.inputPayload,
    status,
    errorMessage: error.message,
    riskLevel,
    requiresApproval,
    createdAt,
    completedAt,
  };
  const auditEvent = appendToolAuditEvent(toolCall);
  const traceEvent = createTraceEvent({
    agentId: input.agentId,
    createdAt,
    message: error.message,
    metadata: {
      status,
      toolAuditEventId: auditEvent.id,
      toolCallId: toolCall.toolCallId,
      toolId: input.toolId,
    },
    runId: input.runId,
    sequence: input.sequence ?? 1,
    stepId: input.stepId,
    type: status === "blocked" ? "tool_blocked" : "tool_failed",
  });

  return { ok: false, toolCall, auditEvent, traceEvent, error };
}

export function executeToolCall(input: ToolExecutionInput): ToolExecutionResult {
  const permission = assertToolPermission(input.agentId, input.toolId);
  const createdAt = input.createdAt ?? defaultCreatedAt;
  const completedAt = input.completedAt ?? completedAtFor(createdAt);

  if (!permission.ok) {
    return createNonExecutedResult({
      error: permission.error,
      input,
      requiresApproval: permission.tool?.requiresApproval ?? true,
      riskLevel: permission.tool?.riskLevel ?? "high",
      status: permission.error.code === "TOOL_NOT_FOUND" ? "failed" : "blocked",
    });
  }

  if ((permission.tool.requiresApproval || permission.tool.riskLevel === "high") && !input.approved) {
    return createNonExecutedResult({
      error: createToolError({
        agentId: input.agentId,
        code: "APPROVAL_REQUIRED",
        message: `${permission.tool.id} requires approval before execution.`,
        toolId: input.toolId,
      }),
      input,
      requiresApproval: permission.tool.requiresApproval,
      riskLevel: permission.tool.riskLevel,
      status: "blocked",
    });
  }

  const toolCallId = input.toolCallId ?? createToolCallId(input);

  try {
    const outputPayload = adapterByToolId[permission.tool.id](input.inputPayload, {
      agentId: input.agentId,
      createdAt,
      runId: input.runId,
      stepId: input.stepId,
      toolCallId,
    });
    const toolCall: ToolCall = {
      toolCallId,
      runId: input.runId,
      stepId: input.stepId,
      agentId: input.agentId,
      toolId: permission.tool.id,
      inputPayload: input.inputPayload,
      status: "executed",
      outputPayload,
      riskLevel: permission.tool.riskLevel,
      requiresApproval: permission.tool.requiresApproval,
      createdAt,
      completedAt,
    };
    const auditEvent = appendToolAuditEvent(toolCall);
    const traceEvent = createTraceEvent({
      agentId: input.agentId,
      createdAt,
      message: `${permission.tool.id} executed through deterministic mock adapter.`,
      metadata: {
        approved: Boolean(input.approved),
        status: toolCall.status,
        toolAuditEventId: auditEvent.id,
        toolCallId,
        toolId: permission.tool.id,
      },
      runId: input.runId,
      sequence: input.sequence ?? 1,
      stepId: input.stepId,
      type: "tool_executed",
    });

    return { ok: true, toolCall, auditEvent, traceEvent };
  } catch (adapterError) {
    return createNonExecutedResult({
      error: createToolError({
        agentId: input.agentId,
        code: "ADAPTER_FAILED",
        message:
          adapterError instanceof Error
            ? adapterError.message
            : `${permission.tool.id} failed inside the mock adapter boundary.`,
        toolId: input.toolId,
      }),
      input,
      requiresApproval: permission.tool.requiresApproval,
      riskLevel: permission.tool.riskLevel,
      status: "failed",
    });
  }
}
