import type { WorkflowTemplate } from "@/lib/workflows/workflowTypes";

export const campaignPublishPackageTemplate: WorkflowTemplate = {
  id: "campaign_publish_package",
  name: "Campaign Publish Package",
  description:
    "Deterministic mock workflow that plans, drafts, evaluates, gates, and prepares a preview-only publish package.",
  steps: [
    {
      id: "planner_agent",
      name: "Plan campaign package",
      description: "Create public-safe campaign plan metadata.",
      agentId: "planner_agent",
      requiresApprovalBeforeNextStep: false,
    },
    {
      id: "drafting_agent",
      name: "Draft campaign package",
      description: "Create deterministic mock campaign copy and asset notes.",
      agentId: "drafting_agent",
      requiresApprovalBeforeNextStep: false,
    },
    {
      id: "qa_agent",
      name: "Evaluate campaign package",
      description: "Score the draft for clarity, safety, and approval readiness.",
      agentId: "qa_agent",
      requiresApprovalBeforeNextStep: false,
    },
    {
      id: "approval_gate",
      name: "Require human approval",
      description: "Pause the publish-like step behind a human approval gate.",
      agentId: "approval_agent",
      requiresApprovalBeforeNextStep: true,
    },
    {
      id: "publish_package",
      name: "Prepare preview-only publish package",
      description: "Create a mock publish package that remains blocked until approval.",
      requiresApprovalBeforeNextStep: false,
    },
  ],
};

export const workflowTemplates = [campaignPublishPackageTemplate];
