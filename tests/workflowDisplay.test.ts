import { describe, expect, it } from "vitest";
import { workflowRuns } from "../src/lib/mockData/workflowRuns";
import {
  formatTokenCount,
  formatUsdEstimate,
  getRecentTraceActivity,
  getTraceStepStatusLabel,
  getTraceStepStatusTone,
  getWorkflowRunStatusLabel,
  getWorkflowRunStatusTone,
  summariseWorkflowRuns,
} from "../src/lib/workflowDisplay";

describe("workflow display helpers", () => {
  it("maps workflow and trace states to reviewer-friendly labels and tones", () => {
    expect(getWorkflowRunStatusLabel("waiting_for_approval")).toBe("Waiting for approval");
    expect(getWorkflowRunStatusTone("waiting_for_approval")).toBe("warning");
    expect(getTraceStepStatusLabel("blocked")).toBe("Blocked");
    expect(getTraceStepStatusTone("blocked")).toBe("warning");
  });

  it("summarises run count, pending approvals, tokens, and mock cost", () => {
    const summary = summariseWorkflowRuns(workflowRuns);
    const expectedTokens = workflowRuns.reduce(
      (total, run) => total + run.metrics.promptTokens + run.metrics.completionTokens,
      0,
    );
    const expectedCost = workflowRuns.reduce(
      (total, run) => total + run.metrics.estimatedCostUsd,
      0,
    );

    expect(summary.totalRuns).toBe(workflowRuns.length);
    expect(summary.pendingApprovalRuns).toBe(1);
    expect(summary.totalTokens).toBe(expectedTokens);
    expect(summary.estimatedCostUsd).toBeCloseTo(expectedCost);
  });

  it("returns recent trace activity in descending timestamp order", () => {
    const activity = getRecentTraceActivity(workflowRuns, 4);

    expect(activity).toHaveLength(4);
    expect(Date.parse(activity[0].timestamp)).toBeGreaterThanOrEqual(
      Date.parse(activity[1].timestamp),
    );
    expect(activity[0]).toMatchObject({
      runId: "run_101",
      stepName: "Wait for human approval",
      status: "blocked",
    });
  });

  it("formats token and cost estimates for the UI", () => {
    expect(formatTokenCount(12345)).toBe("12,345");
    expect(formatUsdEstimate(1.2)).toBe("$1.20");
  });
});
