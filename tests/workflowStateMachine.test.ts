import { describe, expect, it } from "vitest";
import {
  getAllowedCampaignWorkflowEvents,
  transitionCampaignWorkflowState,
} from "../src/lib/workflows/workflowStateMachine";

describe("campaign workflow state machine", () => {
  it("moves through the approval-gated publish path", () => {
    let state = transitionCampaignWorkflowState("created", "workflow_started");
    state = transitionCampaignWorkflowState(state, "planner_completed");
    state = transitionCampaignWorkflowState(state, "drafting_completed");
    state = transitionCampaignWorkflowState(state, "qa_completed");

    expect(state).toBe("waiting_for_approval");
    expect(getAllowedCampaignWorkflowEvents(state)).toEqual(["approval_required"]);

    state = transitionCampaignWorkflowState(state, "approval_required");
    state = transitionCampaignWorkflowState(state, "publish_package_prepared");
    state = transitionCampaignWorkflowState(state, "workflow_completed");

    expect(state).toBe("completed");
  });

  it("rejects publish preparation before approval is required", () => {
    expect(() => transitionCampaignWorkflowState("evaluating", "publish_package_prepared")).toThrow(
      "Invalid campaign workflow transition",
    );
  });
});
