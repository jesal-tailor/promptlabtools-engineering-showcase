import { NextResponse } from "next/server";
import {
  recommendPromptImprovement,
  summariseHumanFeedbackForPrompt,
} from "@/lib/evaluations/humanFeedback";
import { createRepositoryContext } from "@/lib/repositories/repositoryFactory";

type EvaluationRouteContext = {
  params: Promise<{ runId: string }>;
};

export async function GET(_request: Request, context: EvaluationRouteContext) {
  const { runId } = await context.params;
  const repositories = createRepositoryContext();
  const evaluationResult = repositories.evaluationRepository.getById(runId);

  if (!evaluationResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        errors: [evaluationResult.error.message],
        note: "Public-safe mock evaluation history only. No production scores or customer outputs were accessed.",
      },
      { status: 400 },
    );
  }

  const evaluation = evaluationResult.record;

  return NextResponse.json({
    ok: true,
    evaluation,
    humanFeedback: summariseHumanFeedbackForPrompt(evaluation.promptId),
    recommendation: recommendPromptImprovement(evaluation.promptId),
    repository: {
      adapterType: repositories.evaluationRepository.adapterType,
      publicSafetyNote: repositories.evaluationRepository.publicSafetyNote,
    },
    note: "Deterministic mock evaluation run only. No external LLM judge or private dataset was called.",
  });
}
