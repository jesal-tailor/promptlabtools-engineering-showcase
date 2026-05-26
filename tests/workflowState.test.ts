import { describe, expect, it } from "vitest";
import { getAllowedEvents, transitionWorkflowState } from "../src/lib/workflowState";

describe("workflow state transitions", () => {
  it("moves a captured lead into review queue when workflow is queued", () => {
    expect(transitionWorkflowState("captured", "workflow_queued")).toBe("queued_for_review");
  });

  it("models human review before scheduling and completion", () => {
    const approved = transitionWorkflowState("queued_for_review", "workflow_approved");
    const scheduled = transitionWorkflowState(approved, "workflow_scheduled");
    const completed = transitionWorkflowState(scheduled, "workflow_completed");

    expect(completed).toBe("completed");
  });

  it("exposes allowed events for state-aware developer tooling", () => {
    expect(getAllowedEvents("queued_for_review")).toEqual([
      "human_review_required",
      "workflow_approved",
    ]);
  });

  it("rejects invalid transitions", () => {
    expect(() => transitionWorkflowState("captured", "workflow_completed")).toThrow(
      "Invalid transition",
    );
  });
});
