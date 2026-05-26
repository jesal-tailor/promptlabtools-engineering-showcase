# PromptLabTools Engineering Showcase

[![CI](https://github.com/jesal-tailor/promptlabtools-engineering-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/jesal-tailor/promptlabtools-engineering-showcase/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-d4af37.svg)](./LICENSE)

A public engineering showcase demonstrating how PromptLabTools approaches AI-assisted workflow systems, lead-capture automation, platform architecture, and operational tooling.

This is a curated proof-of-work repository, not a full copy of the private PromptLabTools product codebase.

## Overview

PromptLabTools Engineering Showcase is a safe public example of the engineering patterns behind an AI workflow platform:

- Product/workflow pages built with Next.js App Router.
- Typed API route for mock lead capture.
- Validation, honeypot handling, and typed workflow event payloads.
- Mock orchestration state transitions for human-in-the-loop automation.
- CI/CD quality gates for linting, type checking, tests, and builds.
- Documentation explaining architecture, security boundaries, and engineering decisions.

## Why This Exists

The private PromptLabTools product repository remains private because it may contain business-sensitive product logic, funnel implementation, production automation details, and deployment configuration.

This public repository provides a safe technical view of the engineering approach without exposing secrets, customer data, proprietary workflow logic, or commercially sensitive implementation details.

## What This Demonstrates

- Next.js App Router and modern React application structure.
- TypeScript domain types for workflow states, events, and lead payloads.
- API route design with request parsing, validation, honeypot checks, and safe JSON responses.
- Mock lead capture and mock workflow dispatch with no external service calls.
- Workflow orchestration patterns including state transitions and human review checkpoints.
- Developer tooling with ESLint, TypeScript checks, Vitest tests, and GitHub Actions CI.
- Documentation maturity suitable for engineering review and portfolio assessment.
- AI platform engineering thinking without claiming enterprise scale or production AI agents.

## Live Product

The live PromptLabTools product surface is available at:

- Website: [https://www.promptlabtools.com](https://www.promptlabtools.com)
- Free Guide: [https://www.promptlabtools.com/free-guide](https://www.promptlabtools.com/free-guide)

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS |
| Runtime | Node.js |
| API layer | Next.js Route Handlers |
| Tests | Vitest |
| CI/CD | GitHub Actions |
| Integrations | Mock webhook/event handling only |

## Architecture

```text
User
  ↓
Next.js Frontend
  ↓
Workflow/Product Pages
  ↓
Mock Lead Capture API
  ↓
Validation + Event Payload
  ↓
Mock Workflow Orchestration Layer
  ↓
Human Review / Automation Queue / Future AI Agents
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for more detail.

## Repository Structure

```text
.github/workflows/       GitHub Actions CI quality gate
docs/                    Architecture, development, roadmap, security, screenshots
src/app/                 Next.js App Router pages and API route examples
src/components/          Reusable UI components for the showcase app
src/lib/                 Validation, mock lead capture, workflow events/state
src/types/               Shared workflow and lead-capture TypeScript types
tests/                   Lightweight validation and state-transition tests
```

## Getting Started

Prerequisites:

- Node.js 20.18 or newer
- npm 10 or newer

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

This repo uses `.env.example` only and does not require real secrets.

```bash
cp .env.example .env.local
```

The mock API route does not make external calls. Any webhook-like values are placeholders for local experimentation only.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

`npm run check` runs the complete local quality gate.

## Screenshots

Screenshot placeholders and capture guidance are documented in [docs/SCREENSHOTS.md](./docs/SCREENSHOTS.md).

## Roadmap

The public-safe roadmap is documented in [docs/ROADMAP.md](./docs/ROADMAP.md). It focuses on engineering showcase improvements such as screenshots, demo video, richer tests, observability examples, and preview deployment.

## Security & Privacy

This repository intentionally excludes:

- Real secrets or `.env` files.
- Production webhook URLs.
- Customer or user data.
- Private PromptLabTools business strategy.
- Commercially sensitive funnel logic.
- Private OpenClaw credentials or configuration.
- Production automation scripts.

See [docs/SECURITY_AND_PRIVACY.md](./docs/SECURITY_AND_PRIVACY.md).

## Related Links

- Website: [https://www.promptlabtools.com](https://www.promptlabtools.com)
- Free Guide: [https://www.promptlabtools.com/free-guide](https://www.promptlabtools.com/free-guide)
- LinkedIn: [https://uk.linkedin.com/in/jesal-tailor-35bb5653](https://uk.linkedin.com/in/jesal-tailor-35bb5653)
