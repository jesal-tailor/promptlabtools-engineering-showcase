# CI/CD

GitHub Actions runs a quality gate on push and pull request.

## Current Checks

The workflow in `.github/workflows/ci.yml` runs:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Why These Checks Matter

- Lint catches style and framework issues.
- Typecheck protects strict TypeScript contracts.
- Tests protect workflow state, APIs, registries, tools, repositories, and mock runtime behavior.
- Build verifies the Next.js app can produce a production artifact.

## Deployment

No deployment secrets or automatic production deploy job are configured.

For a future production deployment, add a separate job after the quality gate that:

- Requires protected branch rules.
- Uses environment-specific secrets.
- Runs only after review.
- Deploys to a preview or production target.
- Keeps real credentials out of the public repository.

## Public-Safe Principle

CI validates the public-safe mock platform. It does not call real AI providers, webhooks, databases, social APIs, GitHub APIs, or production PromptLabTools systems.
