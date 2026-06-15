# Adapter Boundary

The adapter boundary keeps agent runtime logic separate from integration-specific behavior.

## Current Design

Each adapter is a deterministic function under `src/lib/tools/adapters`.

Adapters accept:

- A JSON input payload.
- Tool execution context.

Adapters return:

- A JSON output payload.
- A visible public-safe note.

## Why This Matters

In production, the adapter boundary is where external systems would be isolated behind typed contracts. The executor can enforce permission checks, approval gates, audit logging, trace events, and safe error handling before any adapter runs.

## Public-Safe Mock Adapters

The current adapters do not:

- Write files.
- Send webhooks.
- Call GitHub.
- Publish content.
- Query analytics.
- Call AI providers.
- Access PromptLabTools production systems.

## Production Changes

A production adapter layer would add provider clients, secrets from a managed secret store, timeout policies, retries, circuit breakers, typed schemas, redaction, structured errors, and per-environment configuration.
