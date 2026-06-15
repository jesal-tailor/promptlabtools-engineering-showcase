import { NextResponse } from "next/server";
import { comparePromptVersions } from "@/lib/prompts/promptVersioning";

type PromptCompareRouteContext = {
  params: Promise<{ promptId: string }>;
};

async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request, context: PromptCompareRouteContext) {
  const { promptId } = await context.params;
  const body = await parseJson(request);
  const raw = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const compareToPromptId = readString(raw.compareToPromptId);

  if (compareToPromptId.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        errors: ["compareToPromptId is required."],
        note: "Mock prompt comparison route only. No production prompt data was accessed.",
      },
      { status: 400 },
    );
  }

  try {
    const comparison = comparePromptVersions(promptId, compareToPromptId);

    return NextResponse.json({
      ok: true,
      comparison,
      note: "Deterministic mock prompt version comparison only.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        errors: [error instanceof Error ? error.message : "Unable to compare prompt versions."],
        note: "Mock prompt comparison route only. No production prompt data was accessed.",
      },
      { status: 400 },
    );
  }
}
