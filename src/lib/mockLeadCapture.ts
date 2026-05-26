import type { MockDispatchResult, ShowcaseLead, WorkflowEvent } from "@/types/workflow";

export async function dispatchMockLeadCapture({
  lead,
  events,
}: {
  lead: ShowcaseLead;
  events: WorkflowEvent[];
}): Promise<MockDispatchResult> {
  await Promise.resolve({ leadId: lead.id });

  return {
    accepted: true,
    destination: "mock://workflow-intake",
    eventsAccepted: events.length,
    externalCallMade: false,
  };
}
