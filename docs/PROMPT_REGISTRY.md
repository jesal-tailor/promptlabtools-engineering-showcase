# Prompt Registry

The prompt registry is a public-safe demonstration of how an AI platform can manage prompt ownership, lifecycle, versioning, and evaluation metadata.

## What It Includes

- Typed prompt records in `src/lib/prompts/promptTypes.ts`.
- Versioned mock prompt fixtures in `src/lib/prompts/promptRegistry.ts`.
- Template rendering in `src/lib/prompts/promptRenderer.ts`.
- Lifecycle transition simulation in `src/lib/prompts/promptLifecycle.ts`.
- Version comparison in `src/lib/prompts/promptVersioning.ts`.
- UI pages at `/prompts` and `/prompts/[promptId]`.

## Lifecycle States

Prompt status is one of:

- `draft`: candidate prompt that must be evaluated before activation.
- `active`: currently available for deterministic mock runtime execution.
- `deprecated`: retained for audit and comparison, not selected as active.

The lifecycle helper is intentionally non-mutating. It returns the transition result that would occur in a real control plane, but it does not persist changes.

## Public-Safe Boundary

Prompt text in this repository is mock showcase text only. It does not contain production PromptLabTools prompts, private business logic, customer-specific prompt chains, provider configuration, or hidden automation instructions.

## Production Changes

A production registry would add durable storage, approval workflows before activation, rollback support, author and reviewer identity, prompt diffing, environment promotion, access control, and audit logs.
