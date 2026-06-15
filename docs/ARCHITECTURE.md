# Architecture

This repository demonstrates a public-safe architecture for an AI-assisted workflow platform. It is intentionally simplified and excludes private production implementation details.

## Current Showcase Architecture

```text
User
  |
  v
Next.js App Router
  |
  v
Dashboard and registry pages
  |
  v
Typed mock data layer
  |
  v
Workflow display helpers and state helpers
  |
  v
Mock lead-capture API route
  |
  v
Validation, typed workflow events, and mock dispatch
```

## What Is Implemented

- **Frontend:** App Router pages for dashboard, workflow list, workflow detail, approvals, prompts, evaluations, tools, architecture, and homepage.
- **Control-plane fixtures:** Mock agents, workflow runs, approvals, prompts, evaluations, and tools under `src/lib/mockData`.
- **Domain types:** Shared TypeScript models under `src/types`.
- **API route:** `src/app/api/showcase-lead/route.ts`.
- **Validation:** `src/lib/validation.ts`.
- **Workflow events:** `src/lib/workflowEvents.ts`.
- **Workflow state transitions:** `src/lib/workflowState.ts`.
- **Display helpers:** `src/lib/workflowDisplay.ts`.
- **Mock dispatch:** `src/lib/mockLeadCapture.ts`.
- **Tests:** Validation, state-transition, mock-data integrity, and display-helper tests under `tests`.

## Mock Control-Plane Model

```text
WorkflowRun
  |
  +-- Trace steps
  +-- Agent IDs
  +-- Prompt IDs
  +-- Tool IDs
  +-- Approval IDs
  +-- Evaluation IDs
```

The relationships are held together by typed IDs and tested in `tests/mockData.test.ts`.

## What Is Mocked

- Lead persistence.
- Webhook delivery.
- Workflow queueing.
- Agent execution.
- Prompt compilation.
- Tool calls.
- Human review assignment.
- Evaluation scoring.
- Reporting and analytics.

All mocked components are explicit. The API response states that no external service was called, and tool destinations use `mock://` identifiers only.

## Workflow Event Flow

```text
lead_captured
  |
  v
workflow_queued
  |
  v
human_review_required
  |
  v
workflow_approved
  |
  v
workflow_scheduled
  |
  v
workflow_completed
```

The mock lead route implements the early part of this event flow. The dashboard fixtures model richer run states, including completed, waiting-for-approval, needs-changes, and failed paths.

## What Would Be Productionised

A production system would likely add:

- Authenticated user accounts and role-based access control.
- Durable persistence for workflow runs, approvals, prompts, tools, evaluations, and trace artifacts.
- Queue or event bus for asynchronous workflow execution.
- Server-side enforcement for high-risk tool approval gates.
- Real observability for latency, token use, cost, failures, retries, and approval wait time.
- Secret-managed integrations with email, CRM, analytics, AI providers, and notification tools.
- Audit logs, retention policies, data deletion paths, and incident runbooks.

See [PRODUCTIONISATION_PLAN.md](./PRODUCTIONISATION_PLAN.md) for the staged plan.
