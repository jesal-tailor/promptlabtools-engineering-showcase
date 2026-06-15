# Live Preview Checklist

Live Preview: Pending final Vercel deployment URL

Use this checklist before sharing the public preview with recruiters, hiring managers, or interviewers.

## Pages To Open

- `/`
- `/dashboard`
- `/workflows`
- `/workflows/runtime_sample`
- `/approvals`
- `/prompts`
- `/evaluations`
- `/tools`
- `/tools/audit`
- `/api/health`
- `/api/readiness`

## API Endpoints To Test

| Endpoint | Expected result |
| --- | --- |
| `GET /api/health` | JSON response with `status: "ok"`, `publicSafe: true`, and `externalCallsEnabled: false` |
| `GET /api/readiness` | JSON response with `status: "ready"`, `publicSafe: true`, and `externalIntegrationsEnabled: false` |

## Expected Public-Safe Banner

Major pages should show a public-safe runtime banner explaining that the showcase uses deterministic mock data and does not call real AI providers, social APIs, databases, webhooks, or production PromptLabTools systems.

## Expected Mock Behaviour

- Workflow runs display deterministic mock data.
- Runtime sample always shows the same ordered workflow shape.
- Approval states are fixtures, not live reviewer actions.
- Prompt and evaluation records are fixture-backed.
- Tool execution is mock-only and high-risk actions fail closed.
- Repository records are backed by memory adapters only.
- Costs, tokens, metrics, and traces are fake platform telemetry examples.

## Browser Checks

- No console errors on the main review pages.
- No broken screenshot references in the README or screenshot docs.
- No missing route or 404 in the recommended review path.
- No UI copy suggesting real production integration.

## Public-Safety Checks

- No local file paths appear in the README.
- No secrets, credentials, API keys, tokens, or webhook URLs appear in the repo.
- No real external API calls are introduced.
- No real Supabase/Postgres connection is configured.
- No Terraform apply is run or required.
- No production PromptLabTools code, data, prompts, scoring logic, or automation scripts are included.

## Final Share Step

When the live preview is available, replace the README placeholder with the final Vercel URL and re-run:

```bash
npm run check
git diff --check
```
