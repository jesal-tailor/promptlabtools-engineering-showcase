import type {
  TraceStepStatus,
  WorkflowRun,
  WorkflowRunStatus,
} from "@/types/workflow";

export type StatusTone = "neutral" | "info" | "warning" | "success" | "danger";

const workflowStatusLabels: Record<WorkflowRunStatus, string> = {
  queued: "Queued",
  running: "Running",
  waiting_for_approval: "Waiting for approval",
  needs_changes: "Needs changes",
  completed: "Completed",
  failed: "Failed",
};

const workflowStatusTones: Record<WorkflowRunStatus, StatusTone> = {
  queued: "neutral",
  running: "info",
  waiting_for_approval: "warning",
  needs_changes: "warning",
  completed: "success",
  failed: "danger",
};

const traceStepStatusLabels: Record<TraceStepStatus, string> = {
  completed: "Completed",
  running: "Running",
  waiting: "Waiting",
  blocked: "Blocked",
  skipped: "Skipped",
};

const traceStepStatusTones: Record<TraceStepStatus, StatusTone> = {
  completed: "success",
  running: "info",
  waiting: "neutral",
  blocked: "warning",
  skipped: "neutral",
};

export function getWorkflowRunStatusLabel(status: WorkflowRunStatus) {
  return workflowStatusLabels[status];
}

export function getWorkflowRunStatusTone(status: WorkflowRunStatus) {
  return workflowStatusTones[status];
}

export function getTraceStepStatusLabel(status: TraceStepStatus) {
  return traceStepStatusLabels[status];
}

export function getTraceStepStatusTone(status: TraceStepStatus) {
  return traceStepStatusTones[status];
}

export function formatTokenCount(tokens: number) {
  return new Intl.NumberFormat("en-GB").format(tokens);
}

export function formatUsdEstimate(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function summariseWorkflowRuns(runs: WorkflowRun[]) {
  return runs.reduce(
    (summary, run) => ({
      totalRuns: summary.totalRuns + 1,
      completedRuns: summary.completedRuns + (run.status === "completed" ? 1 : 0),
      pendingApprovalRuns:
        summary.pendingApprovalRuns + (run.status === "waiting_for_approval" ? 1 : 0),
      totalTokens:
        summary.totalTokens + run.metrics.promptTokens + run.metrics.completionTokens,
      estimatedCostUsd: summary.estimatedCostUsd + run.metrics.estimatedCostUsd,
    }),
    {
      totalRuns: 0,
      completedRuns: 0,
      pendingApprovalRuns: 0,
      totalTokens: 0,
      estimatedCostUsd: 0,
    },
  );
}

export function getRecentTraceActivity(runs: WorkflowRun[], limit = 6) {
  return runs
    .flatMap((run) =>
      run.trace.map((step) => ({
        id: `${run.id}:${step.id}`,
        runId: run.id,
        runTitle: run.title,
        stepName: step.name,
        status: step.status,
        timestamp: step.completedAt ?? step.startedAt,
        summary: step.summary,
      })),
    )
    .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp))
    .slice(0, limit);
}
