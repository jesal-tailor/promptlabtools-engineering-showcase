# Release Notes

## v1.0.0 — Public-safe AI Workflow Control Plane Showcase

## Overview

This release packages the repository as a recruiter-ready AI Platform Engineering showcase. It presents a public-safe mock control plane for agentic workflows with deterministic runtime behaviour, governance layers, quality checks, observability, deployment readiness, documentation, tests, and CI.

The project is inspired by PromptLabTools-style workflow needs, but it does not contain private production code, production prompts, customer data, credentials, or live integrations.

## Core Capabilities

- Deterministic mock agent runtime.
- Campaign workflow orchestration with ordered steps.
- Human-in-the-loop approval gates.
- Approval governance and audit trails.
- Prompt registry, lifecycle state, and versioning.
- Deterministic evaluation scoring and quality regression checks.
- Mock LLM-judge feedback and human feedback summaries.
- Permissioned tool execution sandbox.
- Mock adapter boundaries for external-style tools.
- Repository-pattern persistence boundary with memory adapters.
- Run trace observability and mock token/cost estimates.
- Typed API contracts and validation.
- Health and readiness endpoints.
- Dashboard and registry pages for recruiter review.

## Platform Engineering Signals

- Next.js App Router and TypeScript implementation.
- Strict typed domain models.
- State machines for workflow and approval behaviour.
- Testable deterministic agents and evaluators.
- Fail-closed tool permissions.
- Repository interfaces ready for durable storage replacement.
- Health/readiness endpoints for preview operations.
- Vercel deployment configuration.
- CI/CD quality gates with lint, typecheck, tests, and build.
- Cloud architecture docs, operations runbook, and Terraform/AWS productionisation scaffold.

## Public-Safe Boundaries

- No real AI provider calls.
- No real social publishing.
- No real GitHub, webhook, CRM, analytics, or external API calls.
- No Supabase/Postgres connection.
- No secrets, credentials, API keys, or webhook URLs.
- No customer data.
- No production PromptLabTools prompts, scoring rules, private business logic, or automation scripts.
- No Terraform apply.

## How To Review

Recommended review path:

1. `/dashboard`
2. `/workflows`
3. `/workflows/runtime_sample`
4. `/approvals`
5. `/prompts`
6. `/evaluations`
7. `/tools`
8. `/tools/audit`
9. `/api/health`
10. `/api/readiness`

For recruiter-facing guidance, see [APPLICATION_REVIEW_GUIDE.md](./APPLICATION_REVIEW_GUIDE.md).

## Known Limitations

- All agent outputs are deterministic fixtures.
- There is no durable database.
- There is no authentication or RBAC.
- There are no real model-provider integrations.
- Metrics, costs, token counts, traces, and tool results are mock examples.
- Terraform files are planning scaffolds only.
- Live preview URL is pending final Vercel deployment.

## Future Productionisation Path

- Add authentication, RBAC, and tenant boundaries.
- Replace memory repositories with durable Postgres/Supabase repositories.
- Introduce a secrets manager and environment-specific config.
- Route external integrations through audited adapter services.
- Add queue-backed workflow execution and retries.
- Add production observability dashboards and alerting.
- Add model-provider gateways, rate limiting, and evaluation review workflows.
