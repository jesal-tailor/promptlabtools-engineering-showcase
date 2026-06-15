# Security And Privacy

This repository is designed to be public.

## Intentionally Excluded

- Real secrets.
- `.env.local` or production `.env` files.
- Production webhook URLs.
- Production API keys.
- Customer/user data.
- Private PromptLabTools business logic.
- Private funnel implementation details.
- Internal automation scripts.
- Private OpenClaw credentials or configuration.

## Environment Files

Only `.env.example` is committed. It contains safe placeholder values.

Real values should live only in local development environments or deployment platform secret stores.

## Mock Integrations

All integration examples are mocked. API routes return JSON and do not call external services.

The Stage 6 tool sandbox keeps integration behavior behind `adapterType: "mock"` adapters. Tool execution:

- Checks agent permissions before execution.
- Blocks disabled tools.
- Blocks high-risk tools without approval.
- Returns typed safe errors for unknown tools.
- Records mock audit events only.
- Never calls webhooks, GitHub, analytics, publishing systems, storage APIs, or model providers.

## Data Handling

The mock lead-capture route creates in-memory event payloads for the response only. It does not persist data and does not send data to third parties.

Tool audit events are deterministic in-memory mock records. They are not production audit logs and do not contain customer payloads.

## Public Safety Principle

This repo should show engineering judgement without exposing commercial implementation details. If a future change might reveal product strategy, customer information, or production automation logic, keep it in the private product repository instead.
