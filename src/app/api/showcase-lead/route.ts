import { NextResponse } from "next/server";
import { dispatchMockLeadCapture } from "@/lib/mockLeadCapture";
import { validateShowcaseLead } from "@/lib/validation";
import { createShowcaseWorkflowEvents } from "@/lib/workflowEvents";
import { transitionWorkflowState } from "@/lib/workflowState";

type RawLeadRequest = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  useCase?: unknown;
  consent?: unknown;
  website?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function parseRequest(request: Request): Promise<RawLeadRequest> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as RawLeadRequest;
  }

  const formData = await request.formData();

  return {
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    useCase: formData.get("useCase"),
    consent: formData.get("consent"),
    website: formData.get("website"),
  };
}

export async function POST(request: Request) {
  const rawLead = await parseRequest(request);
  const honeypot = readString(rawLead.website);

  if (honeypot) {
    return NextResponse.json({
      ok: true,
      accepted: true,
      message: "Request received.",
    });
  }

  const validation = validateShowcaseLead(rawLead);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  const lead = validation.data;
  const queuedState = transitionWorkflowState("captured", "workflow_queued");
  const events = createShowcaseWorkflowEvents(lead);
  const dispatch = await dispatchMockLeadCapture({ lead, events });

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    workflowState: queuedState,
    dispatch,
    events,
    note: "Mock showcase route only. No external service was called.",
  });
}
