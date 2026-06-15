# Operations Runbook

This runbook is for the public-safe preview, not production PromptLabTools operations.

## Preview Smoke Test

After local build or Vercel preview deployment, verify:

1. `/` loads.
2. `/dashboard` shows the public-safe runtime banner.
3. `/workflows/runtime_sample` shows deterministic runtime output.
4. `/approvals` shows mock approval states.
5. `/prompts` shows prompt registry records.
6. `/evaluations` shows deterministic evaluation scores.
7. `/tools` shows tool sandbox records.
8. `/tools/audit` shows mock audit events.
9. `/api/health` returns `status: ok`.
10. `/api/readiness` returns all checks as `pass`.

## Common Issues

### Build Fails

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Fix the first failing command before continuing.

### Preview Missing Data

The app uses local fixtures and memory repositories. Missing data usually means a code import, build, or route issue rather than a database issue.

### Health Fails

`/api/health` should not depend on external services. If it fails, inspect the Next.js route or deployment build logs.

### Readiness Fails

`/api/readiness` checks mock modules only. If it fails, inspect repository factory, workflow runner, tool registry, or evaluation history imports.

## Incident Scope

For the public showcase:

- No customer data is at risk.
- No production system is connected.
- No real tool execution occurs.
- No rollback of external state is required.

## Production Difference

A production runbook would add alerting, escalation, tenant impact analysis, database rollback procedures, integration status pages, secret rotation, and incident review.
