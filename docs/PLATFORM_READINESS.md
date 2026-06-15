# Platform Readiness

Stage 9 adds lightweight deployment and operational proof without adding production integrations.

## Readiness Signals

- `vercel.json` declares a safe Next.js preview configuration.
- `.env.example` documents optional mock-only values.
- `/api/health` returns public-safe service metadata.
- `/api/readiness` verifies mock runtime dependencies are available.
- GitHub Actions runs lint, typecheck, tests, and build.
- Terraform scaffold documents future AWS planning without applying infrastructure.

## Health Endpoint

`GET /api/health`

Returns:

- `status: ok`
- service name
- timestamp
- `publicSafe: true`
- `externalCallsEnabled: false`

## Readiness Endpoint

`GET /api/readiness`

Checks:

- Mock repository factory available.
- Mock workflow runner available.
- Mock tool registry available.
- Mock evaluation engine available.
- No external integrations enabled.

## What This Proves

- The app can be deployed as a cloud preview.
- Runtime dependencies are mock-only and deterministic.
- Platform documentation explains how to verify the preview.
- Production architecture has been thought through without leaking private systems.

## What This Does Not Prove

- Real production scalability.
- Real database migrations.
- Real model-provider latency.
- Real webhook delivery.
- Real auth/RBAC.
- Real incident response.

Those would be production workstreams, not public showcase features.
