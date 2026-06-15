# What Is Real vs Mock

This project is intentionally public-safe. It demonstrates real engineering skill through mock domain data and deterministic runtime behavior.

## Real Skills Demonstrated

| Area | What is real |
| --- | --- |
| Next.js and TypeScript | App Router pages, API routes, strict TypeScript, reusable components, and typed domain models |
| API contracts | Validated mock routes for workflow start, approval decisions, prompt comparison, evaluation regression, tool execution, and audit reads |
| Workflow modelling | Runtime templates, ordered steps, state machines, trace events, continuation paths, and display helpers |
| Agent runtime design | Planner, drafting, QA, and approval agents with typed metadata, schemas, allowed tools, and deterministic outputs |
| Approval governance | Human approval requirements, decision state transitions, workflow actions, and audit event shape |
| Prompt governance | Prompt registry, lifecycle states, version comparison, render variables, criteria, and feedback |
| Evaluation quality | Deterministic scoring, history, human feedback summaries, regression checks, and API coverage |
| Tool governance | Permissioned executor, risk levels, approval checks, disabled tools, adapter boundary, and audit records |
| Repository pattern | Interfaces, memory adapters, factory, typed result shape, safe missing-record behavior, and integration tests |
| Testing | Vitest coverage for runtime, APIs, registries, state machines, adapters, repositories, and display helpers |
| Documentation and CI | Recruiter docs, architecture docs, public-safe boundary docs, and GitHub Actions checks |

## Mock / Public-Safe Simulation

| Area | What is mock |
| --- | --- |
| Agents | Outputs are deterministic fixtures, not real AI model responses |
| External tools | Tool adapters return local mock payloads only |
| Costs and tokens | Token counts and cost estimates are fake but shaped like platform telemetry |
| Metrics and traces | Trace events are deterministic examples, not production logs |
| Repositories | Memory adapters only; no Supabase, Postgres, or durable database connection |
| AI providers | No OpenAI, Anthropic, Google, or other model provider call is made |
| Publishing | No social, email, webhook, CRM, analytics, or GitHub action is sent |
| Prompt content | Prompt templates are safe examples, not private PromptLabTools production prompts |
| Customer data | No customer records, analytics exports, private lead data, or user data is included |

## Why Deterministic Mock Design Is Intentional

- Reviewers can run the project without secrets or accounts.
- Tests stay stable in CI.
- The public repo cannot leak private business logic.
- Platform architecture can be reviewed independently of production systems.
- The same interfaces show where production services would be introduced later.

## What Is Not Being Claimed

- This is not the PromptLabTools production codebase.
- This is not connected to real PromptLabTools infrastructure.
- This does not claim real model quality scores.
- This does not publish content or call real third-party APIs.
- This does not include customer data, credentials, or private automations.
