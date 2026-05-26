# Engineering Decisions

## Why This Public Showcase Exists

The goal is to provide hiring managers with a clear technical signal: the candidate can structure, document, build, and explain modern AI/platform engineering systems.

The showcase is intentionally public-safe. It demonstrates engineering patterns while keeping the private PromptLabTools product repository private.

## Why The Private Product Repo Remains Private

The private repo may contain:

- Business-sensitive product and funnel implementation.
- Production deployment details.
- Automation workflows.
- Commercial roadmap details.
- Environment-specific configuration.

Those details are not required for portfolio review and should not be exposed publicly.

## Why Next.js

Next.js provides a pragmatic way to combine product surfaces, route-level metadata, API routes, server/client boundaries, and deployment-ready structure in one repository.

## Why TypeScript

TypeScript makes workflow events, lead payloads, state transitions, and API responses explicit. This is important for platform engineering work where systems need clear contracts.

## Why Mock Integrations

Mock integrations make the repository safe:

- No real webhook calls.
- No secrets.
- No production credentials.
- No customer data.
- No private automation logic.

The mock layer still demonstrates the integration boundary and event shape.

## Why Human-In-The-Loop Workflow Design

AI workflow systems should not default to blind automation. The showcase models human review as a first-class workflow state, which is important for trust, operational control, and safe automation.

## Why Simple Architecture First

The first version avoids databases, queues, auth, and production integrations. That keeps the repo easy to review in 60 seconds while still showing the architectural path toward a fuller platform.

## What Would Change In Production

Production would add:

- Persistent storage.
- Auth and user-level permissions.
- Durable job queues.
- Structured logging and tracing.
- Real webhook/email/analytics integrations.
- Human-review dashboard.
- Workflow execution history.
- Secret management through the deployment platform.
