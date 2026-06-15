# Infrastructure

This folder documents future cloud platform planning for the PromptLabTools Engineering Showcase.

This scaffold demonstrates cloud platform planning. It is not applied by default and is not required for the public-safe demo.

## Current Public Demo

The current app runs as:

- Local Next.js app.
- Optional Vercel preview.
- Mock-only data.
- In-memory repositories.
- No real external integrations.
- No secrets.

## Future Productionisation Areas

- App hosting.
- API/runtime service.
- Logging and monitoring.
- Secret management.
- Durable database.
- Background queue.
- Object storage.

No production infrastructure is created by this repository.

## Safety Rules

- Do not commit real account IDs.
- Do not commit secrets.
- Do not run `terraform apply` for the public showcase.
- Do not wire this scaffold to production PromptLabTools systems.
