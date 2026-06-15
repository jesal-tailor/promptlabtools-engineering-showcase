# Cloud Architecture

Stage 9 documents how the public-safe showcase can run as a Vercel preview without connecting to production systems.

## Public-Safe Preview Architecture

```mermaid
flowchart LR
  Browser["User Browser"] --> Vercel["Vercel / Next.js App"]
  Vercel --> API["API Routes"]
  Vercel --> UI["Dashboard UI"]
  API --> Runner["Workflow Runner"]
  Runner --> Agents["Agent Registry"]
  Runner --> Approval["Approval Governance"]
  Runner --> Prompts["Prompt Registry"]
  Runner --> Evaluations["Evaluation Engine"]
  Runner --> Tools["Tool Sandbox"]
  Runner --> Repositories["Repository Boundary"]
  Tools --> MockAdapters["Mock External Adapters"]
  Repositories --> Memory["In-memory Public-Safe Adapter"]
```

## Preview Characteristics

- Hosted as a standard Next.js app.
- Uses static pages and API routes.
- Uses deterministic mock data.
- Uses in-memory repositories only.
- Does not require secrets.
- Does not call real external integrations.

## Future Production Architecture

```mermaid
flowchart LR
  Browser["User Browser"] --> Edge["Vercel / CDN / Edge"]
  Edge --> App["Next.js App"]
  App --> API["Authenticated API Routes"]
  API --> Queue["Background Queue"]
  API --> Auth["Auth / RBAC"]
  API --> Secrets["Secret Manager"]
  Queue --> Runtime["Workflow Runtime Service"]
  Runtime --> AIGateway["AI Provider Gateway"]
  Runtime --> Integrations["External Integrations"]
  Runtime --> Database["Supabase/Postgres"]
  Runtime --> Storage["Object Storage"]
  Runtime --> Observability["Real Observability"]
```

## Not Implemented In This Repo

- Supabase/Postgres.
- Object storage.
- Background queue.
- Real observability backend.
- Auth/RBAC.
- Secret manager.
- AI provider gateway.
- External integrations.

Those are documented as future productionisation points only.
