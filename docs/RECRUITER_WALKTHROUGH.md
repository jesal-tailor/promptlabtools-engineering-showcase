# Recruiter Walkthrough

This guide is for a non-deep-code review. It should take about five minutes.

## What This Project Shows

Jesal can design and implement a credible AI workflow platform surface:

- Agent runtime concepts.
- Prompt and tool registries.
- Human approval gates.
- Evaluation feedback.
- Workflow trace observability.
- API validation.
- Public-safe documentation.
- Automated quality checks.

The repo is deliberately safe for public viewing. It does not expose production PromptLabTools logic or secrets.

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

## What To Look For In The Code

| Area | Files |
| --- | --- |
| App pages | `src/app/dashboard`, `src/app/workflows`, `src/app/approvals`, `src/app/prompts`, `src/app/evaluations`, `src/app/tools` |
| Domain types | `src/types` |
| Mock fixtures | `src/lib/mockData` |
| Display helpers | `src/lib/workflowDisplay.ts` |
| API route | `src/app/api/showcase-lead/route.ts` |
| Tests | `tests` |
| CI | `.github/workflows/ci.yml` |

## Interview Talking Points

- Why public-safe boundaries matter when showcasing work from a private product.
- How approval gates reduce risk in agentic workflows.
- How approval decisions continue, stop, or return a workflow to drafting.
- Why audit trails matter for public-facing or high-risk agentic actions.
- Why prompt and tool registries matter for governance.
- How evaluation feedback can block or route workflow runs.
- How TypeScript models can make platform behaviour clearer before a real backend exists.
- How CI and tests protect a portfolio project from becoming only a visual demo.

## Public-Safe Statement

All example data is mocked. There are no live external calls, real customer records, real webhook URLs, credentials, production automation scripts, or private PromptLabTools prompts.
