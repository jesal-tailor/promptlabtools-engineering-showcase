import { NextResponse } from "next/server";
import { getEvaluationTrend } from "@/lib/evaluations/evaluationHistory";
import {
  recommendPromptImprovement,
  summariseHumanFeedbackForPrompt,
} from "@/lib/evaluations/humanFeedback";
import { explainPromptLifecycleStatus } from "@/lib/prompts/promptLifecycle";
import { getPromptById } from "@/lib/prompts/promptRegistry";

type PromptRouteContext = {
  params: Promise<{ promptId: string }>;
};

export async function GET(_request: Request, context: PromptRouteContext) {
  const { promptId } = await context.params;
  const prompt = getPromptById(promptId);

  if (!prompt) {
    return NextResponse.json(
      {
        ok: false,
        errors: [`Prompt ${promptId} was not found in the mock registry.`],
        note: "Public-safe mock prompt registry only. No production prompts were accessed.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    prompt,
    lifecycle: explainPromptLifecycleStatus(promptId),
    evaluationTrend: getEvaluationTrend(promptId),
    humanFeedback: summariseHumanFeedbackForPrompt(promptId),
    recommendation: recommendPromptImprovement(promptId),
    note: "Public-safe mock prompt metadata only. No production PromptLabTools prompt content was accessed.",
  });
}
