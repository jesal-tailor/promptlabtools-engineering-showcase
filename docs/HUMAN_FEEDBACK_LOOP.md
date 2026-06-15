# Human Feedback Loop

The human feedback loop shows how reviewer input can inform prompt improvement without exposing private review workflows.

## Current Mock Design

`src/lib/evaluations/humanFeedback.ts` includes deterministic reviewer feedback fixtures and helpers:

- `addMockHumanFeedback`
- `summariseHumanFeedbackForPrompt`
- `recommendPromptImprovement`

The helper returns feedback objects but does not mutate durable state. This keeps the demo predictable and testable.

## Where It Appears

- `/prompts/[promptId]` shows feedback themes and recommended improvements.
- `/evaluations/[evaluationId]` connects evaluation output back to reviewer feedback.
- Tests verify that feedback summaries remain deterministic.

## Production Changes

Production feedback would be stored with reviewer identity, role, timestamp, run artifact reference, prompt version, and moderation status. It would also need permissions, audit logs, conflict handling, and a review queue for deciding whether feedback becomes a prompt change.
