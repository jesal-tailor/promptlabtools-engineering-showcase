# Observability

Stage 3 adds mock observability primitives for runtime execution.

## Trace Events

Trace event helpers live in `src/lib/observability/traceEvents.ts`.

The workflow runner emits:

- `workflow_started`
- `agent_started`
- `agent_completed`
- `approval_required`
- `evaluation_completed`
- `workflow_completed`

Trace events include:

- Event id.
- Run id.
- Sequence number.
- Event type.
- Timestamp.
- Message.
- Optional step id.
- Optional agent id.
- Public-safe metadata.

## Mock Cost And Token Estimates

Cost estimation lives in `src/lib/observability/costEstimator.ts`.

The estimator is deterministic. It uses:

- Agent-specific token baselines.
- A small input-length factor.
- A fixed mock cost per thousand tokens.

These estimates are illustrative only. They are not provider billing data.

## Why Fixture Observability

The repository is public, so observability data must not contain:

- Real logs.
- Customer payloads.
- API keys.
- Provider traces.
- Webhook bodies.
- Production run identifiers.

Fixture traces let reviewers see the platform thinking without exposing private systems.

## Production Differences

A production observability layer would add:

- Structured trace spans.
- Correlation ids across queue workers and external integrations.
- Error and retry events.
- Latency metrics.
- Token and cost metrics from provider adapters.
- Alerting for stuck approvals, failed runs, and unusual tool usage.
- Retention and redaction policies.
