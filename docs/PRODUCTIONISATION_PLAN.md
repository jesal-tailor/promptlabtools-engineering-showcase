# Productionisation Plan

This repository is intentionally a public-safe mock showcase. This plan explains what would need to change before a similar architecture could become a production AI workflow platform.

## Current Showcase Boundary

The current app has:

- Static typed fixtures for agents, workflows, prompts, tools, approvals, and evaluations.
- A mock lead-capture API route.
- Local validation and state-transition helpers.
- Deterministic prompt registry and evaluation engine fixtures.
- Deterministic mock tool registry, executor, adapter boundary, and audit events.
- No database.
- No authentication.
- No external API calls.
- No production webhook dispatch.
- No real prompt bodies or customer records.

## Phase 1: Secure Foundations

- Add authentication and role-based access control.
- Define tenant and workspace boundaries.
- Move run, prompt, tool, approval, and evaluation records into durable storage.
- Add migration tooling and seed data for local development.
- Add secret management through the deployment platform or a dedicated secret store.
- Add audit logging for every approval decision and tool execution.
- Add server-side tool permission enforcement for every adapter call.

## Phase 2: Workflow Execution Layer

- Replace fixture runs with a workflow-run API and persistence model.
- Introduce a queue or event bus for async steps.
- Add idempotency keys for retry-safe workflow execution.
- Add explicit run states for cancellation, timeout, retry, and manual override.
- Separate planner, executor, evaluator, and approval coordinator responsibilities.
- Store trace spans and artifacts with retention policies.
- Store tool call inputs and outputs with redaction, access control, and retention rules.

## Phase 3: Prompt And Tool Governance

- Store prompt bodies with version history, review metadata, and rollback support.
- Add prompt approval workflows before activation.
- Add prompt comparison, semantic diffing, and environment promotion checks.
- Add tool permissions by agent, user role, environment, and risk level.
- Enforce approval requirements server-side before high-risk tools can execute.
- Add sandbox and production tool environments.
- Add redaction and payload-shaping before external calls.
- Add typed adapter interfaces with idempotency keys, retries, rate limits, and circuit breakers.

## Phase 4: Evaluation And Observability

- Add automated evaluation suites with test sets, thresholds, and regression tracking.
- Support human scoring and adjudication for subjective outputs.
- Store human feedback with reviewer identity, artifact references, and prompt version links.
- Block prompt promotion when quality regression checks fail.
- Capture metrics for latency, token use, cost, approval wait time, retries, and failure causes.
- Export traces to an observability backend.
- Add alerting for stuck runs, failed evaluations, and unusual tool usage.

## Phase 5: External Integrations

- Add provider adapters behind typed interfaces.
- Add webhook signing and verification.
- Replace mock adapters with real integration clients only behind the executor boundary.
- Add per-integration rate limits, circuit breakers, and retry policies.
- Add integration-level audit logs.
- Add environment-specific configuration for local, staging, and production.

## Phase 6: Compliance And Operational Controls

- Document data retention and deletion rules.
- Add access reviews for prompt, tool, and workflow changes.
- Add incident response runbooks.
- Add backup and recovery plans.
- Add privacy review for any customer or user data.
- Add penetration testing and dependency review cadence.

## Public Repo Rule

Any future implementation that includes real credentials, real customer data, private PromptLabTools logic, production prompts, real analytics, production automation scripts, or real webhook URLs should stay out of this public repository.
