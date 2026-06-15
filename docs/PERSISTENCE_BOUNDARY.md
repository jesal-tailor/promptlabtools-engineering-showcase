# Persistence Boundary

Stage 7 adds a repository boundary to show how the mock workflow platform would move toward production-grade persistence without connecting this public repository to a real database.

## What Exists

- Repository interfaces under `src/lib/repositories`.
- Public-safe in-memory adapters under `src/lib/repositories/memory`.
- A repository factory in `src/lib/repositories/repositoryFactory.ts`.
- Runtime integration for workflow runs, workflow step events, approval decisions, audit events, tool calls, and evaluation results.
- API route metadata that reports the active adapter as `memory`.

The repositories never write to disk, connect to Supabase/Postgres, call external services, or read private PromptLabTools systems.

## Why Memory Adapters

The project is a CV showcase, not a production clone. Memory adapters prove the architecture while keeping the repository safe to publish:

- Deterministic tests.
- No secrets.
- No database credentials.
- No customer data.
- No production automations.
- No private business logic.

Every adapter includes a public-safety note so reviewers can see that persistence is simulated.

## Persisted Mock Domains

| Domain | Repository |
| --- | --- |
| Workflow runs and step events | `WorkflowRunRepository` |
| Approval records | `ApprovalRepository` |
| Approval, tool, workflow, and evaluation audit events | `AuditEventRepository` |
| Prompt registry records | `PromptRepository` |
| Evaluation runs | `EvaluationRepository` |
| Tool call records | `ToolCallRepository` |

## Production Adapter Slot

`createRepositoryContext()` is the single place where a production system would switch from memory adapters to durable adapters. A real implementation could return Supabase or Postgres-backed repositories behind the same interfaces.

```text
Runtime and API routes
  |
  v
RepositoryContext
  |
  +-- memory adapters in this public showcase
  |
  +-- Supabase/Postgres adapters in a production system
```

## Public-Safe Guarantee

The Stage 7 boundary demonstrates persistence design only. It does not introduce durable storage, external calls, real PromptLabTools data, real webhook targets, credentials, or production automation scripts.
