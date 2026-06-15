# Application Review Guide

## Why This Repo Exists

This project gives recruiters and hiring managers a fast way to evaluate AI Platform Engineering skill from a public repository. It turns private PromptLabTools-inspired workflow patterns into a safe, deterministic showcase that can be reviewed without secrets, customer data, or production integrations.

The point is not to claim production traffic or live automation. The point is to show how an AI workflow platform can be modelled, governed, tested, documented, and prepared for deployment.

## Live Preview

[https://promptlabtools-engineering-showcase.vercel.app](https://promptlabtools-engineering-showcase.vercel.app/)

## Five-Minute Review Path

1. Open `/dashboard`.
   - Look for workflow state, approval risk, prompt count, evaluation score, mock usage, repository boundary, and trace activity.
2. Open `/workflows`.
   - Review mock workflow runs and the deterministic workflow-start demo.
3. Open `/workflows/runtime_sample`.
   - Review ordered agent steps, tool calls, approval requirement, trace events, final package, and memory repository metadata.
4. Open `/approvals`.
   - Confirm pending, approved, rejected, and needs-changes states are represented.
5. Open `/prompts`.
   - Review prompt ownership, versions, lifecycle state, and evaluation criteria.
6. Open `/evaluations`.
   - Review deterministic quality scores and regression context.
7. Open `/tools` and `/tools/audit`.
   - Review permissioned tool execution, blocked high-risk actions, mock adapters, and audit records.
8. Open `/api/health` and `/api/readiness`.
   - Confirm platform-readiness signals explicitly report public-safe mock operation.

## Strongest Technical Signals

- Typed workflow state and deterministic agent runtime.
- Human-in-the-loop approval governance before high-risk actions.
- Prompt versioning and evaluation criteria as platform-managed configuration.
- Permissioned tool execution with risk levels and adapter boundaries.
- Repository-pattern persistence boundary that can later swap memory for durable storage.
- Trace-style observability and mock cost/token estimates.
- API contracts, validation, tests, and CI quality gates.
- Deployment readiness without secrets or paid infrastructure.

## Safety / Public-Safe Boundary

This repo deliberately avoids:

- Real AI provider calls.
- Real social publishing.
- Real GitHub, webhook, CRM, analytics, or database calls.
- Supabase/Postgres connections.
- Secrets, credentials, API keys, or webhook URLs.
- Customer data or production PromptLabTools analytics.
- Production PromptLabTools prompts, scoring rules, or automation scripts.
- Terraform apply or automatic infrastructure provisioning.

All data and integrations are deterministic mock fixtures.

## Role Mapping

| Role | What To Notice |
| --- | --- |
| AI Platform Engineer | Agent runtime, workflow state, approvals, evaluations, traces, tool governance |
| Platform Engineer | API contracts, health/readiness, CI/CD, deployment docs, repository boundaries |
| Developer Platform Engineer | Clear docs, runbooks, review paths, typed interfaces, release notes, local setup |
| Full-Stack Platform Engineer | Next.js UI, TypeScript models, API routes, tests, and app-level ergonomics |
| AI Governance Engineer | Approval gates, audit trails, prompt lifecycle, quality checks, public-safe design |

## What Is Not Being Claimed

- This is not the PromptLabTools production repository.
- This is not connected to real PromptLabTools systems.
- This is not a live AI automation service.
- This does not prove model quality from real providers.
- This does not publish content or call real third-party APIs.

The claim is narrower and stronger: it proves platform design, implementation discipline, governance thinking, and public-safe engineering judgement.
