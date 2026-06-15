# Deployment Guide

This project is deployment-ready for a public-safe Vercel preview. It does not need paid infrastructure, real secrets, databases, AI provider keys, webhooks, or production PromptLabTools systems.

## Local Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run check
```

`npm run check` runs lint, typecheck, tests, and a production build.

## Vercel Preview Steps

1. Fork or import the GitHub repository into Vercel.
2. Keep the framework preset as Next.js.
3. Use the default commands from `vercel.json`:
   - Install: `npm ci`
   - Build: `npm run build`
   - Dev: `npm run dev`
4. Do not add production secrets.
5. Deploy a preview.
6. Verify the pages listed below.

## Required Verification Pages

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

## Why No Secrets Are Needed

The app uses deterministic mock data and in-memory repositories only. It does not connect to:

- AI providers.
- Supabase/Postgres.
- GitHub APIs.
- Webhooks.
- Social publishing APIs.
- Analytics APIs.
- Production PromptLabTools systems.

## Post-Deploy Smoke Test

After deployment, check:

- The dashboard shows the public-safe runtime banner.
- `/api/health` returns `publicSafe: true` and `externalCallsEnabled: false`.
- `/api/readiness` returns passing mock readiness checks.
- Runtime sample pages show deterministic mock traces.
- Tool sandbox pages show blocked high-risk actions.
- No page requires login, secrets, or external service configuration.

## Rollback

Use Vercel's preview deployment history to roll back. There is no database migration or external state to revert because the public showcase uses memory-only data.
