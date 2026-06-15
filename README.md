# PromptLabTools Engineering Showcase

[![CI](https://github.com/jesal-tailor/promptlabtools-engineering-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/jesal-tailor/promptlabtools-engineering-showcase/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-d4af37.svg)](./LICENSE)

PromptLabTools Engineering Showcase is a public-safe AI Platform Engineering portfolio project that demonstrates the shape of an agentic workflow control plane: typed workflow runs, deterministic mock agent runtimes, workflow execution, prompt and tool registries, human approval gates, evaluation scores, observability-style traces, repository boundaries, API contracts, documentation, tests, and CI quality gates.

This is a curated proof-of-work repository. It is not a copy of the private PromptLabTools production codebase.

## What This Repo Proves

- Ability to model AI workflow orchestration with typed state, events, run traces, and approval gates.
- Product engineering judgement across Next.js App Router, React, TypeScript, Tailwind CSS, API routes, and tests.
- Public-safe platform thinking: mock integrations, no real secrets, no production webhooks, no customer data, and no private business logic.
- Documentation discipline for recruiters, engineering reviewers, security boundaries, architecture, and productionisation planning.
- Quality baseline with ESLint, TypeScript strict checks, Vitest, production build, and GitHub Actions CI.

## Five-Minute Demo Path

1. Open `/dashboard` to see the mock AI workflow control plane.
2. Open `/workflows` and select `run_101` to inspect a step-by-step run trace.
3. Open `/workflows/runtime_sample` to inspect the deterministic Stage 3 runtime result.
4. Use the mock start form on `/workflows` or POST JSON to `/api/workflows/start`.
5. Open `/approvals`, `/prompts`, `/evaluations`, and `/tools` to review the registries behind the workflow.
6. Open `/prompts/prompt_campaign_planner_v2` and `/evaluations/eval_hist_planner_v2` to inspect Stage 5 prompt lifecycle, version comparison, deterministic scoring, and feedback loops.
7. Open `/tools` and `/tools/audit` to inspect the Stage 6 mock tool execution sandbox, blocked high-risk execution, and audit trail.
8. Look for the Stage 7 labels on `/dashboard`, `/workflows/runtime_sample`, `/approvals/gate_launch-a-public-safe-ai-workflow-showcase-for-cv_publish`, `/tools/audit`, and `/evaluations/eval_hist_planner_v2` to see the public-safe in-memory repository boundary.

## Architecture Summary

```text
User
  |
  v
Next.js App Router pages
  |
  v
Mock workflow control-plane UI
  |
  v
Typed local fixtures and helper functions
  |
  v
Public-safe repository interfaces and memory adapters
  |
  v
Mock API route with validation and typed workflow events
  |
  v
Human approval gates, evaluation records, and trace views
```

There are no real external API calls. Webhook-like destinations use `mock://` identifiers only.

## Skills Demonstrated

| Area | Evidence |
| --- | --- |
| AI platform engineering | Workflow runs, agents, prompts, tools, evaluations, approvals, and traces |
| Agentic workflow design | Human gates, fail-closed mock publish step, registry-driven runtime metadata |
| Mock runtime engineering | Deterministic planner, drafting, QA, and approval agents under `src/lib/agents` |
| Prompt governance | Versioned prompt registry, lifecycle simulation, rendering, comparison, and feedback loops under `src/lib/prompts` |
| Evaluation governance | Deterministic mock judge, score history, human feedback, and regression checks under `src/lib/evaluations` |
| Tool execution governance | Permissioned mock tool executor, adapters, typed errors, audit log, and trace events under `src/lib/tools` |
| Persistence boundary | Repository interfaces, memory adapters, and factory under `src/lib/repositories` |
| TypeScript modelling | Shared types under `src/types` and typed fixtures under `src/lib/mockData` |
| API contract design | Mock lead and workflow-start API routes with validation and safe JSON responses |
| Frontend engineering | App Router pages for dashboard, workflow detail, registries, and documentation links |
| Quality engineering | Vitest tests for validation, workflow transitions, fixtures, and display helpers |
| Security awareness | Explicit public-safe boundaries, no secrets, no customer data, no production scripts |

## Public-Safe Boundaries

This repository intentionally excludes:

- Real PromptLabTools production secrets.
- Real webhook URLs, credentials, API keys, or deployment configuration.
- Customer data, private analytics, real lead data, or user exports.
- Proprietary PromptLabTools prompts, scoring rules, funnel logic, or automation scripts.
- Real model-provider calls or external service calls.

All workflow runs, agents, prompts, tools, approvals, evaluations, costs, tokens, and trace entries are mock data.

## How To Run Locally

Prerequisites:

- Node.js 20.18 or newer
- npm 10 or newer

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional local env file:

```bash
cp .env.example .env.local
```

The app does not require real environment variables for the showcase flow.

## Quality Checks

Run individual checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Run the full local quality gate:

```bash
npm run check
```

GitHub Actions runs lint, typecheck, tests, and build on push and pull request.

## Documentation

- [Showcase overview](./docs/SHOWCASE_OVERVIEW.md)
- [Recruiter walkthrough](./docs/RECRUITER_WALKTHROUGH.md)
- [Technical skills map](./docs/TECHNICAL_SKILLS_MAP.md)
- [Productionisation plan](./docs/PRODUCTIONISATION_PLAN.md)
- [Agent runtime](./docs/AGENT_RUNTIME.md)
- [Workflow engine](./docs/WORKFLOW_ENGINE.md)
- [Governance model](./docs/GOVERNANCE_MODEL.md)
- [Human approval flow](./docs/HUMAN_APPROVAL_FLOW.md)
- [Audit trail](./docs/AUDIT_TRAIL.md)
- [Observability](./docs/OBSERVABILITY.md)
- [API contracts](./docs/API_CONTRACTS.md)
- [Prompt registry](./docs/PROMPT_REGISTRY.md)
- [Prompt versioning](./docs/PROMPT_VERSIONING.md)
- [Evaluation strategy](./docs/EVALUATION_STRATEGY.md)
- [Human feedback loop](./docs/HUMAN_FEEDBACK_LOOP.md)
- [Quality regression checks](./docs/QUALITY_REGRESSION_CHECKS.md)
- [Tool execution sandbox](./docs/TOOL_EXECUTION_SANDBOX.md)
- [Tool registry](./docs/TOOL_REGISTRY.md)
- [Adapter boundary](./docs/ADAPTER_BOUNDARY.md)
- [Persistence boundary](./docs/PERSISTENCE_BOUNDARY.md)
- [Repository pattern](./docs/REPOSITORY_PATTERN.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Security and privacy](./docs/SECURITY_AND_PRIVACY.md)
- [Engineering decisions](./docs/ENGINEERING_DECISIONS.md)
- [Development](./docs/DEVELOPMENT.md)
- [Roadmap](./docs/ROADMAP.md)

## Roadmap

Stage 1 and Stage 2 are implemented first:

- Stage 1: README positioning and reviewer documentation.
- Stage 2: Dashboard prototype, workflow trace views, registries, mock data, and tests.
- Stage 3: Deterministic mock agent runtime, workflow execution engine, trace events, cost estimates, workflow-start API, docs, and tests.
- Stage 4: Human approval governance, audit events, approval decision API, and continuation paths for approved, rejected, and needs-changes decisions.
- Stage 5: Prompt registry v2, deterministic evaluation engine, human feedback loop, quality regression checks, API routes, UI pages, docs, and tests.
- Stage 6: Tool execution sandbox, mock adapters, permission checks, typed tool errors, audit events, API routes, UI pages, workflow integration, docs, and tests.
- Stage 7: Persistence boundary, repository interfaces, public-safe in-memory adapters, runtime/API integration, docs, and tests.

Future public-safe stages:

- Add screenshots and a short demo video.
- Add accessibility checks and visual regression coverage.
- Add OpenAPI-style schema documentation for the mock routes.
- Add example observability dashboards using fixture logs only.
- Add optional preview deployment with no secrets and no real integrations.

## Related Links

- Website: [https://www.promptlabtools.com](https://www.promptlabtools.com)
- Free Guide: [https://www.promptlabtools.com/free-guide](https://www.promptlabtools.com/free-guide)
- LinkedIn: [https://uk.linkedin.com/in/jesal-tailor-35bb5653](https://uk.linkedin.com/in/jesal-tailor-35bb5653)
