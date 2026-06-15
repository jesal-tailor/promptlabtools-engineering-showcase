import { NextResponse } from "next/server";
import {
  recommendPromptImprovement,
  summariseHumanFeedbackForPrompt,
} from "@/lib/evaluations/humanFeedback";
import { getEvaluationRunById } from "@/lib/evaluations/evaluationHistory";

type EvaluationRouteContext = {
  params: Promise<{ runId: string }>;
};

export async function GET(_request: Request, context: EvaluationRouteContext) {
  const { runId } = await context.params;
  const evaluation = getEvaluationRunById(runId);

  if (!evaluation) {
    return NextResponse.json(
      {
        ok: false,
        errors: [`Evaluation run ${runId} was not found in the mock history.`],
        note: "Public-safe mock evaluation history only. No production scores or customer outputs were accessed.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    evaluation,
    humanFeedback: summariseHumanFeedbackForPrompt(evaluation.promptId),
    recommendation: recommendPromptImprovement(evaluation.promptId),
    note: "Deterministic mock evaluation run only. No external LLM judge or private dataset was called.",
  });
}
