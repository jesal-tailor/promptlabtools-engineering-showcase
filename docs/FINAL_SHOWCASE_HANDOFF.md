# Final Showcase Handoff

## What This Repo Demonstrates

This repository is a public-safe AI Platform Engineering showcase for an agentic workflow control plane. It demonstrates deterministic mock agents, workflow orchestration, human approval gates, audit trails, prompt versioning, evaluation scoring, quality regression checks, mock LLM-judge feedback, permissioned tool execution, adapter boundaries, repository-pattern persistence boundaries, run trace observability, typed API contracts, deployment readiness, documentation, tests, and CI quality gates.

It is inspired by PromptLabTools-style workflow problems, but it is not the PromptLabTools production codebase and does not contain private business logic.

## How To Run Locally

```bash
npm install
npm run dev
```

Open the local app and review:

- `/dashboard`
- `/workflows`
- `/workflows/runtime_sample`
- `/approvals`
- `/prompts`
- `/evaluations`
- `/tools`
- `/tools/audit`
- `/api/health`
- `/api/readiness`

Run the full quality gate with:

```bash
npm run check
```

## How To Review The Live Preview

Live Preview: Pending final Vercel deployment URL

When the live URL is available, open the same review path listed above. The expected behaviour is deterministic: the dashboard, runtime sample, registries, approval flows, tool audit records, health endpoint, and readiness endpoint should show mock data only.

Use [LIVE_PREVIEW_CHECKLIST.md](./LIVE_PREVIEW_CHECKLIST.md) before sharing the preview externally.

## What Is Real vs Mock

Real engineering work:

- Next.js App Router and TypeScript implementation.
- Typed domain models and API contracts.
- Workflow modelling and state transitions.
- Approval governance and audit records.
- Prompt, evaluation, tool, repository, and observability boundaries.
- Vitest coverage and GitHub Actions quality checks.
- Deployment readiness docs and health/readiness endpoints.

Mock/public-safe simulation:

- Deterministic agent outputs.
- Fake costs, token usage, traces, and metrics.
- Mock tool adapters and no real external service calls.
- In-memory repositories only.
- Terraform scaffold only; no infrastructure is applied.

## Technical Skills Proven

- AI workflow orchestration.
- Human-in-the-loop governance.
- Agent runtime modelling.
- Prompt and tool registry design.
- Evaluation and quality regression design.
- Platform observability and trace modelling.
- Repository pattern and adapter boundary design.
- API validation and contract thinking.
- Full-stack Next.js and TypeScript delivery.
- CI/CD and release-readiness documentation.

## Roles This Supports

- AI Platform Engineer.
- Agentic Workflow Engineer.
- Platform Engineer.
- Developer Platform Engineer.
- Full-Stack Platform Engineer.
- AI Governance / Evaluation Engineer.
- Internal Tools Engineer.

## Where To Look In The Codebase

| Area | Path |
| --- | --- |
| App routes | `src/app` |
| Agent runtime | `src/lib/agents` |
| Workflow runner | `src/lib/workflows` |
| Approval governance | `src/lib/approvals` |
| Prompt registry | `src/lib/prompts` |
| Evaluation engine | `src/lib/evaluations` |
| Tool sandbox | `src/lib/tools` |
| Repository boundary | `src/lib/repositories` |
| Observability and cost estimates | `src/lib/observability` |
| Deployment metadata | `src/lib/deployment` |
| API routes | `src/app/api` |
| Tests | `tests` |
| CI | `.github/workflows/ci.yml` |
| Deployment docs | `docs/DEPLOYMENT_GUIDE.md` |
| Terraform planning scaffold | `infra/terraform/aws` |

## Public-Safe Handoff Note

This repo is safe to keep public. It contains no real PromptLabTools secrets, customer data, webhook URLs, credentials, production prompts, production scoring logic, production automation scripts, real AI provider calls, social publishing calls, GitHub writes, database connections, or applied infrastructure.
