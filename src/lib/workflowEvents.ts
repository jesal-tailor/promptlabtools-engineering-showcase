import type { ShowcaseLead, WorkflowEvent, WorkflowEventType, WorkflowState } from "@/types/workflow";

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createWorkflowEvent({
  type,
  lead,
  state,
  payload = {},
}: {
  type: WorkflowEventType;
  lead: ShowcaseLead;
  state: WorkflowState;
  payload?: Record<string, string | boolean | number>;
}): WorkflowEvent {
  return {
    id: createId("evt"),
    type,
    leadId: lead.id,
    state,
    createdAt: new Date().toISOString(),
    payload: {
      source: lead.source,
      role: lead.role,
      ...payload,
    },
  };
}

export function createShowcaseWorkflowEvents(lead: ShowcaseLead) {
  const captured = createWorkflowEvent({
    type: "lead_captured",
    lead,
    state: "captured",
    payload: { useCaseLength: lead.useCase.length },
  });

  const queued = createWorkflowEvent({
    type: "workflow_queued",
    lead,
    state: "queued_for_review",
    payload: { reviewMode: "human_in_the_loop", externalCallMade: false },
  });

  const review = createWorkflowEvent({
    type: "human_review_required",
    lead,
    state: "queued_for_review",
    payload: { reason: "public_showcase_mock", automationSafe: true },
  });

  return [captured, queued, review];
}
