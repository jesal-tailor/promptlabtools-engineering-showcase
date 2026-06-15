# Demo Script

Use this as a 5-minute walkthrough for recruiters, hiring managers, or technical interviewers.

## Opening Line

This is a public-safe AI workflow control-plane showcase. It demonstrates the platform layer around agentic workflows without exposing real PromptLabTools production code, customer data, credentials, or external integrations.

## 0:00-0:45 Dashboard

Open `/dashboard`.

Point out:

- Workflow run totals.
- Pending approval count.
- Prompt version count.
- Average evaluation score.
- Mock cost and token estimate.
- Stage 7 persistence boundary panel.
- Recent trace-style activity.

Talk track:

> This is the operator view. It shows how an AI workflow platform can expose run state, approval risk, prompt governance, evaluation quality, mock cost, and trace activity in one place.

## 0:45-1:30 Runtime Sample

Open `/workflows/runtime_sample`.

Point out:

- Ordered runtime steps.
- Planner, drafting, QA, approval gate, and publish package phases.
- Tool calls.
- Evaluation score.
- Trace events.
- Repository-backed mock execution panel.

Talk track:

> The runtime is deterministic by design. It lets reviewers inspect the workflow engine, typed outputs, tool calls, approval requirement, and trace events without any real AI provider or production automation.

## 1:30-2:10 Approval Gate

Open `/approvals/gate_launch-a-public-safe-ai-workflow-showcase-for-cv_publish`.

Point out:

- Approval requirement.
- Reviewer comment.
- Approved, rejected, and needs-changes examples.
- Audit event metadata.
- Repository boundary label.

Talk track:

> High-risk actions are gated. Approval decisions map to workflow actions: continue, stop, or return to drafting. The audit event shape is explicit and testable.

## 2:10-2:50 Prompt Registry

Open `/prompts`, then `/prompts/prompt_campaign_planner_v2`.

Point out:

- Prompt owner agent.
- Version and lifecycle status.
- Template variables.
- Evaluation criteria.
- Human feedback.
- Version comparison.

Talk track:

> The prompt registry is treated as platform configuration, not loose text. Prompts have owners, versions, lifecycle state, evaluation criteria, and feedback loops.

## 2:50-3:30 Evaluation Quality Layer

Open `/evaluations/eval_hist_planner_v2`.

Point out:

- Deterministic score breakdown.
- Passing threshold.
- Human feedback summary.
- Regression check context.
- Repository-backed evaluation read.

Talk track:

> This simulates an LLM-as-judge quality layer, but the scoring is deterministic so CI stays stable. In production this could point to model-based or human evaluation workflows.

## 3:30-4:15 Tool Sandbox

Open `/tools`, then `/tools/audit`.

Point out:

- Allowed agents per tool.
- Risk level.
- Approval required flag.
- Enabled or disabled state.
- Blocked high-risk publish package example.
- Mock audit events.

Talk track:

> Agents cannot call integrations directly. They request tools through a permissioned executor. High-risk or disabled tools fail closed, and every result is represented as an audit record.

## 4:15-4:45 Repository Boundary

Open `/dashboard` or `/workflows/runtime_sample` and show the Stage 7 repository panel.

Point out:

- Repository interfaces.
- Memory adapters.
- No database connection.
- Production swap point for Supabase/Postgres.

Talk track:

> The repository boundary proves how persistence would be introduced without connecting this public repo to real services. The runtime can write workflow runs, step events, tool calls, approvals, audit events, and evaluations through the same interface.

## 4:45-5:00 Public-Safe Close

Close with:

> Everything here is intentionally mock-only: no real AI calls, no customer data, no webhooks, no production prompts, no secrets, and no real publishing. The real value is the architecture, modelling, tests, and governance thinking.

## Backup Technical Questions

- Where are agents defined? `src/lib/agents`.
- Where is the workflow runner? `src/lib/workflows/workflowRunner.ts`.
- Where are approval decisions handled? `src/lib/approvals/approvalStateMachine.ts`.
- Where is the tool sandbox? `src/lib/tools`.
- Where is the repository boundary? `src/lib/repositories`.
- What protects quality? Vitest tests, TypeScript strict checks, ESLint, build, and GitHub Actions CI.
