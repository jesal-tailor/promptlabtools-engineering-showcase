# Environment Variables

The public-safe showcase does not require secrets.

## Optional Local Values

| Variable | Example | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | No | Used for documentation and local preview references |
| `NEXT_PUBLIC_PROMPTLABTOOLS_URL` | `https://www.promptlabtools.com` | No | Public website link only |
| `NEXT_PUBLIC_FREE_GUIDE_URL` | `https://www.promptlabtools.com/free-guide` | No | Public guide link only |
| `MOCK_WORKFLOW_DESTINATION` | `mock://workflow-intake` | No | Mock label only; not a real webhook |
| `NEXT_PUBLIC_DEPLOYMENT_ENV` | `local` | No | Public deployment label |
| `NEXT_PUBLIC_LIVE_PREVIEW_STATUS` | `not-deployed` | No | Public README/docs status label |
| `MOCK_EXTERNAL_CALLS_ENABLED` | `false` | No | Must remain false for public-safe preview |

## Forbidden In This Public Repo

Do not add:

- AI provider API keys.
- Database URLs.
- Supabase/Postgres credentials.
- Webhook URLs.
- GitHub tokens.
- Social publishing tokens.
- Customer data exports.
- Production PromptLabTools secrets or configuration.

## Vercel Preview

The Vercel preview can run with no environment variables. If optional values are added, keep them public-safe and non-secret.
