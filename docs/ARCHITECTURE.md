# Architecture

This repository demonstrates a public-safe architecture for an AI-assisted workflow platform. It is intentionally simplified and excludes private production implementation details.

## Current Showcase Architecture

```text
User
  ↓
Next.js Frontend
  ↓
Showcase / Workflow / Architecture Pages
  ↓
Mock Lead Capture API
  ↓
Validation + Honeypot Check
  ↓
Typed Workflow Events
  ↓
Mock Dispatch Layer
  ↓
Human Review Queue State
```

## What Is Implemented

- **Frontend:** App Router pages under `src/app`.
- **Components:** Header, footer, workflow cards, and architecture diagram.
- **API route:** `src/app/api/showcase-lead/route.ts`.
- **Validation:** `src/lib/validation.ts`.
- **Workflow events:** `src/lib/workflowEvents.ts`.
- **Workflow state transitions:** `src/lib/workflowState.ts`.
- **Mock dispatch:** `src/lib/mockLeadCapture.ts`.
- **Tests:** Validation and state-transition tests under `tests`.

## What Is Mocked

- Lead persistence.
- Webhook delivery.
- Workflow queueing.
- Human review assignment.
- AI agent execution.
- Reporting and analytics.

All mocked components are explicit. The API response states that no external service was called.

## What Would Be Productionised

A production system would likely add:

- Authenticated user accounts.
- Durable persistence for leads, workflow runs, and review history.
- Queue or event bus for asynchronous workflow execution.
- Observability for failed dispatches and workflow run states.
- Secret-managed integrations with email, CRM, analytics, and AI tools.
- Human-review UI with approval, rejection, and scheduling controls.

## Workflow Event Flow

```text
lead_captured
  ↓
workflow_queued
  ↓
human_review_required
  ↓
workflow_approved
  ↓
workflow_scheduled
  ↓
workflow_completed
```

The showcase implements the early part of the flow and tests the state-transition model. It does not execute production automations.

## Future AI Orchestration Layer

The future layer would manage:

- Workflow templates.
- Prompt-system inputs and outputs.
- Run-state visibility.
- Evaluation checkpoints.
- Human approval gates.
- Integration dispatch.
- Reporting and replay history.

This public repo demonstrates the shape of that architecture without exposing private PromptLabTools logic.
