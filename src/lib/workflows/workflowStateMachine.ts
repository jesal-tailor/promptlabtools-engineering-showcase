export type CampaignWorkflowState =
  | "created"
  | "planning"
  | "drafting"
  | "evaluating"
  | "waiting_for_approval"
  | "publishing"
  | "package_prepared"
  | "completed";

export type CampaignWorkflowEvent =
  | "workflow_started"
  | "planner_completed"
  | "drafting_completed"
  | "qa_completed"
  | "approval_required"
  | "publish_package_prepared"
  | "workflow_completed";

const transitions: Record<CampaignWorkflowState, Partial<Record<CampaignWorkflowEvent, CampaignWorkflowState>>> = {
  created: {
    workflow_started: "planning",
  },
  planning: {
    planner_completed: "drafting",
  },
  drafting: {
    drafting_completed: "evaluating",
  },
  evaluating: {
    qa_completed: "waiting_for_approval",
  },
  waiting_for_approval: {
    approval_required: "publishing",
  },
  publishing: {
    publish_package_prepared: "package_prepared",
  },
  package_prepared: {
    workflow_completed: "completed",
  },
  completed: {},
};

export function transitionCampaignWorkflowState(
  currentState: CampaignWorkflowState,
  event: CampaignWorkflowEvent,
): CampaignWorkflowState {
  const nextState = transitions[currentState][event];

  if (!nextState) {
    throw new Error(`Invalid campaign workflow transition from ${currentState} using ${event}.`);
  }

  return nextState;
}

export function getAllowedCampaignWorkflowEvents(state: CampaignWorkflowState) {
  return Object.keys(transitions[state]) as CampaignWorkflowEvent[];
}
