# Interview Talk Track

Use these notes to explain the project clearly in technical interviews.

## 30-Second Pitch

This is a public-safe AI workflow control-plane showcase. It models the platform layer around agentic automation: deterministic agents, workflow orchestration, approval gates, prompt and tool registries, evaluation checks, trace events, repository boundaries, tests, and docs. It does not call real AI providers or production systems.

## Design Choices

### Deterministic Agents

The agents are deterministic so reviewers can run the project locally and tests can assert exact behavior. In production, the agent interface would call model providers or internal services behind the same runtime contract.

### Human Approval Gates

The workflow pauses before publish-like actions. Approval decisions map to workflow actions:

- `approved` continues the workflow.
- `rejected` stops the workflow.
- `needs_changes` returns the workflow to drafting.

This shows how agentic systems can avoid unreviewed high-risk actions.

### Tool Sandbox

Agents do not call integrations directly. They request tools through a permissioned executor that checks:

- Registered tool ID.
- Allowed agent IDs.
- Enabled state.
- Risk level.
- Approval requirement.

High-risk or disabled tools fail closed.

### Evaluation Layer

The evaluation engine mimics LLM-as-judge and human feedback workflows but uses deterministic scoring. This keeps the repo public-safe and CI-stable while proving the quality-control architecture.

### Repository Boundary

The repository layer shows where production persistence would live. The public repo only uses in-memory adapters, but the same interfaces could be backed by Supabase/Postgres in production.

## What PromptLabTools Inspired

PromptLabTools inspired the need for safe workflow orchestration, prompt governance, approval gates, and platform visibility. The code and data here are synthetic examples built for a public showcase.

## What Is Not Claimed

- This is not production PromptLabTools code.
- It does not include private production prompts or business logic.
- It does not call real model providers.
- It does not send webhooks or publish content.
- It does not connect to real databases.

## Good Technical Questions To Invite

- How would you replace deterministic agents with model-backed agents?
- Where would you add idempotency and retries?
- How would you persist trace spans and artifacts?
- How would RBAC change approval decisions?
- How would prompt promotion work across environments?
- How would you test real tool adapters without making real external calls?
