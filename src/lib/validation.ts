import type { ShowcaseLead } from "@/types/workflow";

type RawLeadInput = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  useCase?: unknown;
  consent?: unknown;
};

export type ValidationResult =
  | { ok: true; data: ShowcaseLead }
  | { ok: false; errors: string[] };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function validateShowcaseLead(input: RawLeadInput): ValidationResult {
  const name = readString(input.name);
  const email = readString(input.email).toLowerCase();
  const role = readString(input.role);
  const useCase = readString(input.useCase);
  const consent = input.consent === true || input.consent === "true" || input.consent === "on";
  const errors: string[] = [];

  if (!name) errors.push("Name is required.");
  if (!email || !emailPattern.test(email)) errors.push("A valid email is required.");
  if (!role) errors.push("Role or area of interest is required.");
  if (!useCase || useCase.length < 12) {
    errors.push("Use case must describe the workflow need in at least 12 characters.");
  }
  if (!consent) errors.push("Consent is required for this showcase example.");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      id: createId("lead"),
      name,
      email,
      role,
      useCase,
      consent: true,
      source: "engineering-showcase",
      submittedAt: new Date().toISOString(),
    },
  };
}
