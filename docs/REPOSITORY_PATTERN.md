# Repository Pattern

The repository pattern keeps domain logic independent from the persistence mechanism. Stage 7 uses it to show clean architecture without adding a real database.

## Repository Contracts

The shared contracts live in `src/lib/repositories/repositoryTypes.ts` and are re-exported by domain files such as:

- `workflowRunRepository.ts`
- `approvalRepository.ts`
- `auditEventRepository.ts`
- `promptRepository.ts`
- `evaluationRepository.ts`
- `toolCallRepository.ts`

Each repository exposes only the methods needed by its domain, such as `list`, `getById`, `create`, `update`, `appendEvent`, or filtered list helpers.

## Result Shape

Lookups return typed results instead of throwing for missing records:

```ts
type RepositoryResult<T> =
  | { ok: true; record: T }
  | { ok: false; error: RepositoryError };
```

Missing records fail safely with a public-safe error message. No fallback external lookup is attempted.

## In-Memory Implementations

The memory adapters seed themselves from deterministic fixture data and keep changes in local arrays only. This makes tests stable and keeps the repository public-safe.

The adapters intentionally do not:

- Write to disk.
- Call Supabase, Postgres, or other databases.
- Call external APIs.
- Use secrets.
- Load production data.

## Runtime Integration

The workflow runner, approval state machine, and tool executor can optionally receive a `RepositoryContext`. If no context is supplied, existing deterministic runtime behavior still works. If a context is supplied, the runtime writes mock records through the repository boundary.

This keeps the showcase backwards-compatible while demonstrating how production persistence would be introduced.

## Tests

Stage 7 adds adapter tests and integration tests for:

- Seeded mock records.
- Safe missing-result behavior.
- Create and update behavior.
- Appended audit and workflow events.
- Workflow runner persistence.
- Approval decision audit persistence.
- Tool call persistence.

These tests verify the architecture without requiring any database service.
