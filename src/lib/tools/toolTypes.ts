import type { RuntimeAgentId } from "@/lib/agents/agentTypes";
import type { RuntimeTraceEvent } from "@/lib/observability/traceEvents";

export type ToolRiskLevel = "low" | "medium" | "high";

export type ToolAdapterType = "mock";

export type ToolCallStatus = "requested" | "approved" | "executed" | "blocked" | "failed";

export type ToolId =
  | "generate_mock_utm_url"
  | "create_mock_publish_package"
  | "score_content_quality"
  | "write_mock_markdown_artifact"
  | "fetch_mock_metrics"
  | "create_mock_github_issue"
  | "send_mock_webhook";

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export type JsonObject = {
  [key: string]: JsonValue;
};

export type ToolDefinition = {
  id: ToolId;
  name: string;
  description: string;
  allowedAgentIds: RuntimeAgentId[];
  actionName: string;
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
  inputSchemaName: string;
  outputSchemaName: string;
  adapterType: ToolAdapterType;
  enabled: boolean;
};

export type ToolCall = {
  toolCallId: string;
  runId: string;
  stepId: string;
  agentId: RuntimeAgentId;
  toolId: ToolId | string;
  inputPayload: JsonObject;
  status: ToolCallStatus;
  outputPayload?: JsonObject;
  errorMessage?: string;
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
  createdAt: string;
  completedAt?: string;
};

export type ToolAuditEvent = {
  id: string;
  toolCallId: string;
  runId: string;
  stepId: string;
  agentId: RuntimeAgentId;
  toolId: ToolId | string;
  status: ToolCallStatus;
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
  message: string;
  createdAt: string;
  completedAt?: string;
  publicSafetyNote: string;
};

export type ToolAdapterContext = {
  toolCallId: string;
  runId: string;
  stepId: string;
  agentId: RuntimeAgentId;
  createdAt: string;
};

export type ToolAdapter = (inputPayload: JsonObject, context: ToolAdapterContext) => JsonObject;

export type ToolExecutionInput = {
  toolCallId?: string;
  runId: string;
  stepId: string;
  agentId: RuntimeAgentId;
  toolId: ToolId | string;
  inputPayload: JsonObject;
  approved?: boolean;
  createdAt?: string;
  completedAt?: string;
  sequence?: number;
};

export type ToolExecutionResult = {
  ok: boolean;
  toolCall: ToolCall;
  auditEvent: ToolAuditEvent;
  traceEvent: RuntimeTraceEvent;
  error?: import("@/lib/tools/toolErrors").ToolExecutionError;
};
