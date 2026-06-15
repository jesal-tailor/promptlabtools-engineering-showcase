# Prompt Versioning

Prompt versioning demonstrates how an AI platform can compare prompt versions before activation.

## Current Implementation

`src/lib/prompts/promptVersioning.ts` compares:

- Version changes.
- Status changes.
- Added and removed variables.
- Added and removed evaluation criteria.
- Change notes.

The planner prompt comparison is visible at `/prompts/prompt_campaign_planner_v2`.

## Why This Matters

Prompt changes can alter runtime behavior even when application code is unchanged. Version comparison makes those changes reviewable and testable.

## Production Changes

Production prompt versioning would add full text diffs, semantic review notes, rollback metadata, environment promotion, approval requirements, author identity, reviewer identity, and impact analysis against historical runs.
