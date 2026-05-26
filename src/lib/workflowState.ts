import type { WorkflowEventType, WorkflowState } from "@/types/workflow";

const transitions: Record<WorkflowState, Partial<Record<WorkflowEventType, WorkflowState>>> = {
  captured: {
    lead_qualified: "qualified",
    workflow_queued: "queued_for_review",
  },
  qualified: {
    workflow_queued: "queued_for_review",
  },
  queued_for_review: {
    human_review_required: "queued_for_review",
    workflow_approved: "approved",
  },
  approved: {
    workflow_scheduled: "scheduled",
  },
  scheduled: {
    workflow_completed: "completed",
  },
  completed: {},
};

export function transitionWorkflowState(
  currentState: WorkflowState,
  eventType: WorkflowEventType,
): WorkflowState {
  const nextState = transitions[currentState][eventType];

  if (!nextState) {
    throw new Error(`Invalid transition from ${currentState} using ${eventType}.`);
  }

  return nextState;
}

export function getAllowedEvents(state: WorkflowState) {
  return Object.keys(transitions[state]) as WorkflowEventType[];
}
