import { NextResponse } from "next/server";
import { compareEvaluationRuns } from "@/lib/evaluations/evaluationHistory";
import { detectQualityRegression } from "@/lib/evaluations/regressionChecks";

async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = await parseJson(request);
  const raw = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const baselineRunId = readString(raw.baselineRunId);
  const candidateRunId = readString(raw.candidateRunId);
  const baselineScore = readNumber(raw.baselineScore);
  const candidateScore = readNumber(raw.candidateScore);
  const threshold = readNumber(raw.threshold);

  if (baselineRunId && candidateRunId) {
    try {
      const comparison = compareEvaluationRuns(baselineRunId, candidateRunId);
      const regression = detectQualityRegression(
        comparison.baselineScore,
        comparison.candidateScore,
        threshold,
      );

      return NextResponse.json({
        ok: true,
        comparison,
        regression,
        note: "Deterministic mock regression check only. No external evaluator or private benchmark was called.",
      });
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          errors: [error instanceof Error ? error.message : "Unable to compare evaluation runs."],
          note: "Mock evaluation regression route only.",
        },
        { status: 400 },
      );
    }
  }

  if (baselineScore === undefined || candidateScore === undefined) {
    return NextResponse.json(
      {
        ok: false,
        errors: [
          "Provide baselineRunId and candidateRunId, or numeric baselineScore and candidateScore.",
        ],
        note: "Mock evaluation regression route only.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    regression: detectQualityRegression(baselineScore, candidateScore, threshold),
    note: "Deterministic mock regression check only. No external evaluator or private benchmark was called.",
  });
}
