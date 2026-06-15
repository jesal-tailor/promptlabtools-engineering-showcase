# Technical Skills Map

This document maps the showcase to the engineering skills it is intended to evidence.

## Platform And Product Engineering

| Skill | Evidence |
| --- | --- |
| Next.js App Router | Route groups under `src/app`, including static and dynamic pages |
| React composition | Reusable components such as `StatusBadge`, `SiteHeader`, `SiteFooter`, and architecture cards |
| TypeScript strict modelling | Domain types in `src/types` and typed fixture arrays in `src/lib/mockData` |
| API contract design | `src/app/api/showcase-lead/route.ts` accepts form or JSON, validates input, and returns typed mock events |
| UI information architecture | Dashboard, run list, run trace, approval queue, prompt registry, evaluation page, and tool registry |

## AI Platform Engineering

| Skill | Evidence |
| --- | --- |
| Agent runtime patterns | `src/types/agent.ts` and `src/lib/mockData/agents.ts` |
| Deterministic agent execution | `src/lib/agents` |
| Workflow orchestration | `src/types/workflow.ts`, `src/lib/workflowState.ts`, `src/lib/mockData/workflowRuns.ts` |
| Workflow execution engine | `src/lib/workflows` |
| Human-in-the-loop gates | `src/types/approval.ts`, `src/lib/mockData/approvals.ts`, `/approvals` |
| Approval governance | `src/lib/approvals`, `/api/approvals/[approvalId]/decide`, `/approvals/[approvalId]` |
| Prompt registry | `src/types/prompt.ts`, `src/lib/mockData/prompts.ts`, `/prompts` |
| Tool governance | `src/types/tool.ts`, `src/lib/mockData/tools.ts`, `/tools` |
| Evaluation engine shape | `src/types/evaluation.ts`, `src/lib/mockData/evaluations.ts`, `/evaluations` |
| Observability traces | Workflow detail pages and `getRecentTraceActivity` in `src/lib/workflowDisplay.ts` |

## Quality Engineering

| Skill | Evidence |
| --- | --- |
| Unit testing | Vitest tests in `tests` |
| State transition testing | `tests/workflowState.test.ts` |
| Runtime state-machine testing | `tests/workflowStateMachine.test.ts` |
| Input validation testing | `tests/validation.test.ts` |
| API contract testing | `tests/api.workflowStart.test.ts` |
| Approval decision testing | `tests/api.approvalDecision.test.ts`, `tests/workflowApprovalContinuation.test.ts` |
| Fixture integrity testing | `tests/mockData.test.ts` |
| Display helper testing | `tests/workflowDisplay.test.ts` |
| CI quality gate | `.github/workflows/ci.yml` |

## Security And Public-Safety Awareness

| Skill | Evidence |
| --- | --- |
| Secret hygiene | `.env.example` only; no real secrets required |
| Safe integrations | `mock://` destinations only |
| Data minimisation | Synthetic workflow traces and sample approval records |
| Boundary documentation | `README.md`, `docs/SECURITY_AND_PRIVACY.md`, and `docs/SHOWCASE_OVERVIEW.md` |
| Fail-closed thinking | Mock publish action blocked or rejected without approval |

## Production Readiness Thinking

| Skill | Evidence |
| --- | --- |
| Clear separation of demo and production | Explicit mock data layer and public-safe docs |
| Backlog planning | `docs/PRODUCTIONISATION_PLAN.md` and `docs/ROADMAP.md` |
| API evolution awareness | README roadmap and API route structure |
| Observability awareness | Dashboard trace activity and run detail trace records |
