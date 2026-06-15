# Recruiter Walkthrough

This guide is for a non-deep-code review. A hiring manager should understand the project in under 60 seconds, and a deeper walkthrough should take about five minutes.

## 60-Second Summary

This is a public-safe AI Platform Engineering showcase. It demonstrates the platform controls around agentic workflows: runtime orchestration, approvals, prompt governance, evaluation checks, tool permissions, observability, repository boundaries, tests, docs, and CI.

It is inspired by PromptLabTools-style workflow needs, but it is not production PromptLabTools code and does not include private business logic.

## What This Project Shows

Jesal can design and implement a credible AI workflow platform surface:

- Agent runtime concepts.
- Prompt and tool registries.
- Human approval gates.
- Evaluation feedback.
- Workflow trace observability.
- Repository pattern and persistence boundary.
- API validation.
- Public-safe documentation.
- Automated quality checks.

The repo is deliberately safe for public viewing. It does not expose production PromptLabTools logic or secrets.

## What This Proves For AI Platform Roles

- Jesal can model agent workflows beyond a single prompt or chatbot.
- Jesal understands human-in-the-loop controls for risky actions.
- Jesal can create typed platform boundaries for prompts, tools, evaluations, traces, and persistence.
- Jesal can make public-safe portfolio work that preserves confidentiality.
- Jesal can back the demo with tests, docs, and CI rather than only UI screenshots.

## Five-Minute Click Path

1. Start at `/dashboard`.
   - Look for workflow run totals, pending approvals, prompt count, evaluation score, mock token usage, and trace activity.
2. Open `/workflows`.
   - Review how each mock workflow run has status, priority, owner, agents, approvals, evaluations, token estimates, and public-safety notes.
3. Open `/workflows/run_101`.
   - This is the strongest technical demo path. It shows a step-by-step trace from intake through prompt compilation, evaluation, and a blocked approval gate.
4. Open `/approvals`.
   - Confirm the system models pending, approved, rejected, and needs-changes states.
5. Open `/approvals/gate_launch-a-public-safe-ai-workflow-showcase-for-cv_publish`.
   - Review the mock approval decisions, audit trail examples, and workflow action outcomes.
6. Open `/prompts`, `/evaluations`, and `/tools`.
   - These pages show registry thinking and platform governance.
7. Open `/prompts/prompt_campaign_planner_v2`.
   - Review prompt lifecycle, version comparison, evaluation criteria, and human feedback.
8. Open `/evaluations/eval_hist_planner_v2`.
   - Review deterministic judge feedback, dimension scores, and regression context.
9. Open `/tools` and `/tools/audit`.
   - Review the mock tool execution sandbox, blocked high-risk execution, adapter boundary, and audit trail.
10. Notice the Stage 7 repository labels on the dashboard, runtime sample, approval detail, tool audit, and evaluation detail pages.
   - These show how the same mock system could move toward durable storage through a repository factory.

## What To Look For In The Code

| Area | Files |
| --- | --- |
| App pages | `src/app/dashboard`, `src/app/workflows`, `src/app/approvals`, `src/app/prompts`, `src/app/evaluations`, `src/app/tools` |
| Domain types | `src/types` |
| Mock fixtures | `src/lib/mockData` |
| Display helpers | `src/lib/workflowDisplay.ts` |
| API route | `src/app/api/showcase-lead/route.ts` |
| Prompt registry v2 | `src/lib/prompts` and `src/app/prompts` |
| Evaluation engine v2 | `src/lib/evaluations` and `src/app/evaluations` |
| Tool execution sandbox | `src/lib/tools`, `src/app/tools`, and `/api/tools/execute` |
| Persistence boundary | `src/lib/repositories` and Stage 7 repository tests |
| Tests | `tests` |
| CI | `.github/workflows/ci.yml` |

## Interview Talking Points

- Why deterministic mocks are intentional for public-safe CI and recruiter review.
- Why public-safe boundaries matter when showcasing work from a private product.
- How approval gates reduce risk in agentic workflows.
- How approval decisions continue, stop, or return a workflow to drafting.
- Why audit trails matter for public-facing or high-risk agentic actions.
- Why prompt and tool registries matter for governance.
- How prompt lifecycle, version comparison, and evaluation thresholds reduce change risk.
- Why deterministic mock evaluators are useful in a public CV showcase.
- How a permissioned tool executor prevents agents from directly calling high-risk integrations.
- How adapter boundaries make later production integrations safer to add.
- How repository boundaries make later Supabase/Postgres persistence safer to add.
- How evaluation feedback can block or route workflow runs.
- How TypeScript models can make platform behaviour clearer before a real backend exists.
- How CI and tests protect a portfolio project from becoming only a visual demo.

## What Is Not Being Claimed

- This is not the private PromptLabTools production repository.
- It does not connect to real PromptLabTools infrastructure.
- It does not call live AI providers, webhooks, GitHub APIs, publishing APIs, social APIs, or databases.
- It does not contain customer data, production prompts, production scoring logic, credentials, or private automation scripts.

## Public-Safe Statement

All example data is mocked. There are no live external calls, real customer records, real webhook URLs, credentials, production automation scripts, or private PromptLabTools prompts.
