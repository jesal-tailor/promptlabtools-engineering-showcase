import { describe, expect, it } from "vitest";
import {
  createHealthResponse,
  createReadinessResponse,
  publicSafeRuntimeStatement,
} from "../src/lib/deployment/deploymentMetadata";

describe("deployment metadata", () => {
  it("stays explicit about mock-only public-safe deployment readiness", () => {
    const health = createHealthResponse();
    const readiness = createReadinessResponse();

    expect(health.publicSafe).toBe(true);
    expect(health.externalCallsEnabled).toBe(false);
    expect(readiness.publicSafe).toBe(true);
    expect(readiness.externalIntegrationsEnabled).toBe(false);
    expect(publicSafeRuntimeStatement).toContain("does not call real AI providers");
    expect(publicSafeRuntimeStatement).toContain("databases");
    expect(publicSafeRuntimeStatement).toContain("production PromptLabTools systems");
  });
});
