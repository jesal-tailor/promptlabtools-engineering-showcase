# Development

## Prerequisites

- Node.js 20.18 or newer.
- npm 10 or newer.
- Optional: `nvm` using `.nvmrc`.

## Install

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Typecheck

```bash
npm run typecheck
```

## Test

```bash
npm run test
```

## Full Check

```bash
npm run check
```

This runs linting, TypeScript checks, tests, and production build.

## Environment Variables

Copy the example file if needed:

```bash
cp .env.example .env.local
```

The app does not require real secrets. Keep all real credentials out of this public repository.

## Troubleshooting

### Build fails after dependency changes

```bash
rm -rf node_modules .next
npm install
npm run check
```

### API route returns validation errors

Check the submitted fields:

- `name`
- `email`
- `role`
- `useCase`
- `consent`

### CI fails but local build works

Confirm Node version compatibility and rerun:

```bash
npm ci
npm run check
```
