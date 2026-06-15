import { evaluationHistory } from "@/lib/evaluations/evaluationHistory";
import { createRepositoryContext } from "@/lib/repositories/repositoryFactory";
import { toolRegistry } from "@/lib/tools/toolRegistry";
import { campaignPublishPackageTemplate } from "@/lib/workflows/workflowTemplates";
import { runCampaignPublishPackageWorkflow } from "@/lib/workflows/workflowRunner";

export const serviceName = "promptlabtools-engineering-showcase";

export const publicSafeRuntimeStatement =
  "This is a public-safe showcase environment using deterministic mock data. It does not call real AI providers, social APIs, databases, webhooks or production PromptLabTools systems.";

export type HealthResponse = {
  status: "ok";
  service: typeof serviceName;
  timestamp: string;
  publicSafe: true;
  externalCallsEnabled: false;
};

export type ReadinessCheck = {
  name: string;
  status: "pass";
  detail: string;
};

export type ReadinessResponse = {
  status: "ready";
  service: typeof serviceName;
  publicSafe: true;
  externalIntegrationsEnabled: false;
  checks: ReadinessCheck[];
  note: string;
};

export function createHealthResponse(timestamp = "2026-06-15T12:00:00.000Z"): HealthResponse {
  return {
    status: "ok",
    service: serviceName,
    timestamp,
    publicSafe: true,
    externalCallsEnabled: false,
  };
}

export function createReadinessResponse(): ReadinessResponse {
  const repositories = createRepositoryContext();
  const workflowRunnerAvailable = typeof runCampaignPublishPackageWorkflow === "function";

  return {
    status: "ready",
    service: serviceName,
    publicSafe: true,
    externalIntegrationsEnabled: false,
    checks: [
      {
        name: "mock repository factory available",
        status: "pass",
        detail: `Memory adapter returned ${repositories.workflowRunRepository.list().length} workflow records.`,
      },
      {
        name: "mock workflow runner available",
        status: "pass",
        detail: `Runner available: ${workflowRunnerAvailable}. Template has ${campaignPublishPackageTemplate.steps.length} steps.`,
      },
      {
        name: "mock tool registry available",
        status: "pass",
        detail: `${toolRegistry.length} mock tools registered; no real adapters enabled.`,
      },
      {
        name: "mock evaluation engine available",
        status: "pass",
        detail: `${evaluationHistory.length} deterministic evaluation records available.`,
      },
      {
        name: "no external integrations enabled",
        status: "pass",
        detail: "AI providers, social APIs, databases, webhooks, and production systems remain disabled.",
      },
    ],
    note: "Readiness is for the public-safe mock preview only. It does not verify real external infrastructure.",
  };
}
