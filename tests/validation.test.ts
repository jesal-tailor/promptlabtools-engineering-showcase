import { describe, expect, it } from "vitest";
import { validateShowcaseLead } from "../src/lib/validation";

describe("validateShowcaseLead", () => {
  it("accepts a complete public-safe lead payload", () => {
    const result = validateShowcaseLead({
      name: "Alex Operator",
      email: "Alex@Example.com",
      role: "Platform Engineer",
      useCase: "I want to automate a repeatable workflow with review checkpoints.",
      consent: "true",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe("alex@example.com");
      expect(result.data.source).toBe("engineering-showcase");
      expect(result.data.id).toMatch(/^lead_/);
    }
  });

  it("rejects missing consent and weak use-case detail", () => {
    const result = validateShowcaseLead({
      name: "Alex Operator",
      email: "alex@example.com",
      role: "Platform Engineer",
      useCase: "short",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Consent is required for this showcase example.");
      expect(result.errors).toContain("Use case must describe the workflow need in at least 12 characters.");
    }
  });

  it("rejects invalid email addresses", () => {
    const result = validateShowcaseLead({
      name: "Alex Operator",
      email: "not-an-email",
      role: "Platform Engineer",
      useCase: "A useful workflow automation example.",
      consent: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("A valid email is required.");
    }
  });
});
