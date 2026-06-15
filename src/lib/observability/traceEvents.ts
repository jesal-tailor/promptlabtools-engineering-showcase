import type { RuntimeAgentId } from "@/lib/agents/agentTypes";

export type TraceEventType =
  | "workflow_started"
  | "agent_started"
  | "agent_completed"
  | "approval_required"
  | "evaluation_completed"
  | "workflow_completed";

export type RuntimeTraceEvent = {
  id: string;
  runId: string;
  sequence: number;
  type: TraceEventType;
  createdAt: string;
  message: string;
  stepId?: string;
  agentId?: RuntimeAgentId;
  metadata: Record<string, string | number | boolean>;
};

export function createTraceEvent({
  agentId,
  createdAt,
  message,
  metadata = {},
  runId,
  sequence,
  stepId,
  type,
}: {
  agentId?: RuntimeAgentId;
  createdAt: string;
  message: string;
  metadata?: Record<string, string | number | boolean>;
  runId: string;
  sequence: number;
  stepId?: string;
  type: TraceEventType;
}): RuntimeTraceEvent {
  return {
    id: `trace_${runId}_${String(sequence).padStart(2, "0")}`,
    runId,
    sequence,
    type,
    createdAt,
    message,
    stepId,
    agentId,
    metadata,
  };
}
