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

All integration examples are mocked. The API route returns JSON and does not call external services.

## Data Handling

The mock lead-capture route creates in-memory event payloads for the response only. It does not persist data and does not send data to third parties.

## Public Safety Principle

This repo should show engineering judgement without exposing commercial implementation details. If a future change might reveal product strategy, customer information, or production automation logic, keep it in the private product repository instead.
