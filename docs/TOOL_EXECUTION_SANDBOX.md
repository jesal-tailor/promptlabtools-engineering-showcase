# Tool Execution Sandbox

Stage 6 adds a deterministic mock tool execution sandbox. It demonstrates how agents can request tool actions through a controlled layer instead of calling integrations directly.

## Core Files

- `src/lib/tools/toolTypes.ts`
- `src/lib/tools/toolRegistry.ts`
- `src/lib/tools/toolPermissions.ts`
- `src/lib/tools/toolExecutor.ts`
- `src/lib/tools/toolAuditLog.ts`
- `src/lib/tools/toolErrors.ts`
- `src/lib/tools/adapters`

## Execution Flow

1. Agent requests a tool with run id, step id, agent id, tool id, and input payload.
2. Executor validates that the tool exists.
3. Permission helper checks whether the agent is allowed to use the tool.
4. Disabled tools fail closed.
5. High-risk or approval-required tools are blocked unless the call is marked approved.
6. The matching mock adapter returns deterministic output.
7. The executor records a mock audit event and trace event.

## Why Tools Are Permissioned

Agentic systems can become risky when agents freely call tools. Permissioning demonstrates:

- Least privilege by agent.
- Explicit tool ownership.
- High-risk action gating.
- Safe handling for unknown tools.
- Reviewable audit trails for tool calls.

## Public-Safe Boundary

The sandbox never calls real APIs, webhooks, GitHub, social publishing, analytics, storage, or model providers. All outputs are mock records with public-safe labels.

## Production Changes

Production would add durable audit storage, real adapter interfaces, idempotency keys, retries, rate limits, auth checks, payload redaction, environment separation, and signed webhook verification.
