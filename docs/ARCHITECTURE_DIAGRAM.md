# Architecture Diagram

This diagram shows the public-safe showcase architecture. Every external-looking integration is mocked.

```mermaid
flowchart LR
  UI["Dashboard UI and registry pages"] --> Runtime["Workflow runner"]
  UI --> API["Mock API routes"]

  API --> Runtime
  API --> Approval["Approval governance"]
  API --> Tools["Tool sandbox"]
  API --> Repositories["Repository boundary"]

  Runtime --> Agents["Agent registry and deterministic agents"]
  Runtime --> Prompts["Prompt registry"]
  Runtime --> Evaluations["Evaluation engine"]
  Runtime --> Approval
  Runtime --> Tools
  Runtime --> Traces["Trace events and mock cost estimates"]
  Runtime --> Repositories

  Approval --> Audit["Audit event shape"]
  Tools --> Audit
  Tools --> MockAdapters["Mock external adapters"]

  Repositories --> Memory["Public-safe memory adapters"]
  Prompts --> Repositories
  Evaluations --> Repositories
  Audit --> Repositories

  MockAdapters --> MockDestinations["mock:// destinations only"]
```

## Boundary Notes

- The UI is real Next.js App Router code.
- The runtime contracts and state transitions are real TypeScript.
- Agents, costs, traces, tools, evaluations, and repository records are deterministic mock examples.
- The repository boundary uses memory adapters only.
- Mock adapters never call external APIs.
- Production would replace memory adapters and mock tools behind the same interfaces.
