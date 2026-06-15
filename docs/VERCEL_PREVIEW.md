# Vercel Preview

The repo is ready for a public-safe Vercel preview deployment.

## Live Preview Status

Live Preview: [https://promptlabtools-engineering-showcase.vercel.app](https://promptlabtools-engineering-showcase.vercel.app/)

Use [LIVE_PREVIEW_CHECKLIST.md](./LIVE_PREVIEW_CHECKLIST.md) before sharing the preview externally.

## Configuration

`vercel.json` declares:

- Next.js framework.
- `npm ci` install command.
- `npm run build` build command.
- `npm run dev` local dev command.
- A public-safe response header.

## Environment Variables

No required secrets.

Optional public-safe values are documented in [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

## Preview Verification

Check these routes after deployment:

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

## Safety Notes

- Do not add AI provider keys.
- Do not add database URLs.
- Do not add webhook URLs.
- Do not add social API tokens.
- Do not add production PromptLabTools configuration.
- Do not connect this preview to production automation.
