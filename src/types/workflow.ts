export type WorkflowState =
  | "captured"
  | "qualified"
  | "queued_for_review"
  | "approved"
  | "scheduled"
  | "completed";

export type WorkflowEventType =
  | "lead_captured"
  | "lead_qualified"
  | "workflow_queued"
  | "human_review_required"
  | "workflow_approved"
  | "workflow_scheduled"
  | "workflow_completed";

export type ShowcaseLead = {
  id: string;
  name: string;
  email: string;
  role: string;
  useCase: string;
  consent: true;
  source: "engineering-showcase";
  submittedAt: string;
};

export type WorkflowEvent = {
  id: string;
  type: WorkflowEventType;
  leadId: string;
  state: WorkflowState;
  createdAt: string;
  payload: Record<string, string | boolean | number>;
};

export type MockDispatchResult = {
  accepted: boolean;
  destination: "mock://workflow-intake";
  eventsAccepted: number;
  externalCallMade: false;
};
