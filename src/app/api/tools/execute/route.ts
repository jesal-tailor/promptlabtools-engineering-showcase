import { NextResponse } from "next/server";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import type { RuntimeAgentId } from "@/lib/agents/agentTypes";
import { executeToolCall } from "@/lib/tools/toolExecutor";
import type { JsonObject } from "@/lib/tools/toolTypes";

const runtimeAgentIds = new Set<string>(agentRegistry.map((agent) => agent.id));

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

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const body = await parseJson(request);
  const raw = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const errors: string[] = [];
  const runId = readString(raw.runId);
  const stepId = readString(raw.stepId);
  const agentId = readString(raw.agentId);
  const toolId = readString(raw.toolId);
  const inputPayload = raw.inputPayload;
  const validatedInputPayload = isJsonObject(inputPayload) ? inputPayload : {};
  const approved = typeof raw.approved === "boolean" ? raw.approved : false;

  if (runId.length < 3) {
    errors.push("runId is required and must be at least 3 characters.");
  }

  if (stepId.length < 3) {
    errors.push("stepId is required and must be at least 3 characters.");
  }

  if (!runtimeAgentIds.has(agentId)) {
    errors.push("agentId must be a registered runtime agent.");
  }

  if (toolId.length < 3) {
    errors.push("toolId is required.");
  }

  if (!isJsonObject(inputPayload)) {
    errors.push("inputPayload must be a JSON object.");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        errors,
        note: "Mock tool execution route only. No external service was called.",
      },
      { status: 400 },
    );
  }

  const result = executeToolCall({
    agentId: agentId as RuntimeAgentId,
    approved,
    inputPayload: validatedInputPayload,
    runId,
    stepId,
    toolId,
  });

  return NextResponse.json({
    ok: result.ok,
    result,
    status: result.toolCall.status,
    note: "Mock public-safe tool execution sandbox only. No real API, webhook, filesystem, GitHub, or publishing action was called.",
  });
}
