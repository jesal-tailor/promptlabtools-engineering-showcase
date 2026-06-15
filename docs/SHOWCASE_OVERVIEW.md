# Showcase Overview

This repository is a public-safe AI Platform Engineering showcase for PromptLabTools. It demonstrates the control-plane patterns behind an agentic workflow system without exposing production secrets, real automation scripts, private prompts, customer data, or commercially sensitive business logic.

## Core Idea

The app models a workflow operations surface:

- Operators can inspect recent workflow runs.
- A deterministic runtime can execute a sample campaign workflow from mock input.
- Each run has typed trace steps.
- Agents are represented as runtime roles with allowed tools and guardrails.
- Prompts are versioned and owned by agents.
- Tools declare allowed agents, risk levels, and approval requirements.
- Evaluations record rubric scores and feedback.
- Human approval gates pause or fail-close higher-risk actions.
- Approval decisions produce mock audit events and deterministic workflow continuation outcomes.

All data is static fixture data under `src/lib/mockData`.

## Demo Surfaces

| Route | Purpose |
| --- | --- |
| `/dashboard` | Control-plane summary for runs, approvals, prompts, evaluations, tokens, costs, and traces |
| `/workflows` | Mock workflow run list |
| `/workflows/[runId]` | Step-by-step trace for one run |
| `/approvals` | Human-in-the-loop queue with pending, approved, rejected, and needs-changes states |
| `/prompts` | Prompt registry metadata with versions, owner agents, and statuses |
| `/evaluations` | Evaluation results with scores, dimensions, and feedback |
| `/tools` | Tool registry with allowed agents, risk levels, and approval requirements |
| `/api/workflows/start` | Deterministic mock workflow start route |
| `/api/approvals/[approvalId]/decide` | Deterministic mock approval decision route |
| `/api/showcase-lead` | Mock lead-capture route with validation and typed events |

## Public-Safe Design

The showcase uses explicit mock boundaries:

- Integration destinations use `mock://` identifiers.
- The mock lead API returns JSON and does not call third-party systems.
- Prompt records contain metadata, not proprietary prompt bodies.
- Evaluation scores and cost estimates are illustrative.
- Run traces are synthetic and contain no private logs.
- Human approval records are sample data only.

## Architecture Pattern

```text
Next.js pages
  |
  v
Typed fixture registries
  |
  v
Display helpers and state helpers
  |
  v
Mock API route and workflow event builder
  |
  v
Vitest and CI quality gates
```

## What A Reviewer Should Notice

- The domain is intentionally modelled with TypeScript types before UI rendering.
- Workflow runs connect agents, prompts, tools, approvals, evaluations, and traces by IDs.
- Higher-risk tool usage is blocked behind approval records.
- Failed and needs-changes paths are represented, not just happy paths.
- Documentation explains what is mocked and what would be productionised.

## What This Is Not

This is not a production workflow engine, model orchestration service, CRM integration, analytics pipeline, or PromptLabTools source-code mirror. It is a serious but safe portfolio demonstration of the engineering shape.
