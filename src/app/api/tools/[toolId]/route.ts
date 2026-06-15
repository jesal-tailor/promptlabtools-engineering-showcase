import { NextResponse } from "next/server";
import { agentRegistry } from "@/lib/agents/agentRegistry";
import { explainToolPermissionDecision } from "@/lib/tools/toolPermissions";
import { getToolById } from "@/lib/tools/toolRegistry";

type ToolRouteContext = {
  params: Promise<{ toolId: string }>;
};

export async function GET(_request: Request, context: ToolRouteContext) {
  const { toolId } = await context.params;
  const tool = getToolById(toolId);

  if (!tool) {
    return NextResponse.json(
      {
        ok: false,
        errors: [`Tool ${toolId} is not registered in the mock sandbox.`],
        note: "Public-safe mock tool registry only. Unknown tools fail safely.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    tool,
    permissionExamples: agentRegistry.map((agent) =>
      explainToolPermissionDecision(agent.id, tool.id),
    ),
    note: "Mock public-safe tool metadata only. No real integration, credential, webhook, or production automation was accessed.",
  });
}
