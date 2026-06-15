# Agent Runtime

Stage 3 adds a typed mock agent runtime. It is intentionally deterministic and public-safe.

## Registered Agents

Agents live under `src/lib/agents`.

| Agent | Purpose |
| --- | --- |
| `planner_agent` | Turns a campaign goal into a public-safe execution plan |
| `drafting_agent` | Creates deterministic mock campaign copy and asset notes |
| `qa_agent` | Scores the draft for clarity, safety, and approval readiness |
| `approval_agent` | Creates the human approval gate before publish-like use |

Each agent definition includes:

- `id`
- `name`
- `role`
- `systemPrompt`
- `allowedTools`
- `riskLevel`
- `inputSchemaName`
- `outputSchemaName`

The registry is in `src/lib/agents/agentRegistry.ts`.

## Why Deterministic Mock Agents

The runtime does not call AI providers. Agent outputs are deterministic functions of the campaign goal and previous mock outputs.

This keeps the repository:

- Stable under tests and CI.
- Safe to publish publicly.
- Free from API keys, provider credentials, private prompts, and production data.
- Easy for reviewers to inspect without needing PromptLabTools internal systems.

## Public-Safe Boundaries

The mock agents must not:

- Call external AI APIs.
- Use real PromptLabTools production prompts.
- Encode private business logic.
- Process customer or lead data.
- Send webhooks or notifications.

The `systemPrompt` fields are descriptive mock instructions, not production prompts.

## Production Differences

A production runtime would add:

- Authenticated execution context.
- Durable input/output artifact storage.
- Real prompt version lookup with approvals.
- Provider adapters behind typed interfaces.
- Retry, timeout, rate-limit, and failure handling.
- Policy enforcement before tool execution.
- Full audit logs and trace export.
