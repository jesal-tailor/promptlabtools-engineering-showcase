# Evaluation Strategy

The evaluation engine models how quality gates could work in an AI workflow platform without using a real model provider or private benchmark data.

## Deterministic Scoring

`src/lib/evaluations/evaluationEngine.ts` scores outputs against typed criteria from `src/lib/evaluations/evaluationCriteria.ts`.

Scores are deterministic. They are based on safe keyword signals and fixed mock rules so Vitest can assert stable results.

## Evaluation Dimensions

The v2 engine supports these dimensions:

- `accuracy`
- `brandFit`
- `specificity`
- `actionability`
- `risk`
- `ctaClarity`
- `governanceFit`
- `overallScore`

## Mock Judge

`src/lib/evaluations/mockLlmJudge.ts` acts like an LLM judge interface, but it never calls an external API. It returns deterministic feedback based on visible output signals such as public-safe framing, approval context, and CTA clarity.

## Evaluation History

`src/lib/evaluations/evaluationHistory.ts` stores sample historical runs for prompt comparisons and UI demos. These are fixtures, not persisted production records.

## Production Changes

A production evaluation system would add curated test sets, rubric versioning, asynchronous evaluation jobs, model-provider adapters, human adjudication, golden datasets, privacy controls, and regression alerts.
