import { NextResponse } from "next/server";
import {
  runCampaignPublishPackageWorkflow,
  validateCampaignWorkflowInput,
} from "@/lib/workflows/workflowRunner";

async function parseJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      return {
        campaignGoal: formData.get("campaignGoal"),
      };
    }

    return await request.json();
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const body = await parseJson(request);
  const validation = validateCampaignWorkflowInput(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        errors: validation.errors,
        note: "Mock workflow start route only. No external service was called.",
      },
      { status: 400 },
    );
  }

  const workflow = runCampaignPublishPackageWorkflow(validation.data);

  return NextResponse.json({
    ok: true,
    workflow,
    note: "Deterministic mock runtime execution only. No external AI API, webhook, or production automation was called.",
  });
}
