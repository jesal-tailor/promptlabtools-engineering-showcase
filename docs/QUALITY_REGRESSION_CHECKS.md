# Quality Regression Checks

Quality regression checks compare a baseline score to a candidate score and flag drops that meet a configured threshold.

## Current Implementation

`src/lib/evaluations/regressionChecks.ts` provides:

```ts
detectQualityRegression(baselineScore, candidateScore, threshold)
```

It returns:

- Baseline score.
- Candidate score.
- Threshold.
- Whether regression was detected.
- Severity.
- Explanation.

## API Route

`POST /api/evaluations/regression-check` accepts either evaluation run IDs or explicit numeric scores.

This is deterministic mock behavior. It does not call an external evaluator, analytics system, model provider, or private benchmark.

## Production Changes

A production system would run regression checks automatically in CI or before prompt activation, store results with prompt version metadata, alert owners, block risky promotions, and support deeper investigation through trace and artifact links.
