import { createGoalSlug, normaliseCampaignGoal } from "@/lib/agents/agentTypes";
import { runApprovalAgent } from "@/lib/agents/approvalAgent";
import { runDraftingAgent } from "@/lib/agents/draftingAgent";
import { runPlannerAgent } from "@/lib/agents/plannerAgent";
import { runQaAgent } from "@/lib/agents/qaAgent";
import { estimateWorkflowCost } from "@/lib/observability/costEstimator";
import { createTraceEvent } from "@/lib/observability/traceEvents";
import { campaignPublishPackageTemplate } from "@/lib/workflows/workflowTemplates";
import {
  transitionCampaignWorkflowState,
  type CampaignWorkflowState,
} from "@/lib/workflows/workflowStateMachine";
import type {
  CampaignPublishPackage,
  CampaignWorkflowInput,
  CampaignWorkflowRunResult,
  CampaignWorkflowStepResult,
} from "@/lib/workflows/workflowTypes";

const defaultRunStartedAt = "2026-06-15T09:00:00.000Z";

export type CampaignWorkflowInputValidation =
  | { ok: true; data: CampaignWorkflowInput }
  | { ok: false; errors: string[] };

export function validateCampaignWorkflowInput(input: unknown): CampaignWorkflowInputValidation {
  const errors: string[] = [];
  const rawGoal =
    typeof input === "object" && input !== null && "campaignGoal" in input
      ? (input as { campaignGoal?: unknown }).campaignGoal
      : undefined;

  if (typeof rawGoal !== "string") {
    errors.push("campaignGoal must be a string.");
  }

  const campaignGoal = typeof rawGoal === "string" ? normaliseCampaignGoal(rawGoal) : "";

  if (campaignGoal.length < 12) {
    errors.push("campaignGoal must describe the mock campaign goal in at least 12 characters.");
  }

  if (campaignGoal.length > 240) {
    errors.push("campaignGoal must be 240 characters or fewer.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { campaignGoal } };
}

export function runCampaignPublishPackageWorkflow({
  campaignGoal,
  runStartedAt = defaultRunStartedAt,
}: CampaignWorkflowInput & { runStartedAt?: string }): CampaignWorkflowRunResult {
  const normalisedGoal = normaliseCampaignGoal(campaignGoal);
  const goalSlug = createGoalSlug(normalisedGoal) || "campaign";
  const runId = `mock_run_campaign_publish_package_${goalSlug}`;
  const timestampAt = (sequence: number) =>
    new Date(Date.parse(runStartedAt) + sequence * 60_000).toISOString();
  let sequence = 1;
  let state: CampaignWorkflowState = "created";
  const traceEvents: CampaignWorkflowRunResult["traceEvents"] = [];

  const pushTrace = (event: Parameters<typeof createTraceEvent>[0]) => {
    traceEvents.push(createTraceEvent(event));
  };

  state = transitionCampaignWorkflowState(state, "workflow_started");
  pushTrace({
    createdAt: timestampAt(sequence),
    message: "Started deterministic mock campaign workflow.",
    metadata: { campaignGoal: normalisedGoal, templateId: campaignPublishPackageTemplate.id },
    runId,
    sequence,
    type: "workflow_started",
  });
  sequence += 1;

  const context = {
    runId,
    campaignGoal: normalisedGoal,
    timestamp: runStartedAt,
  };

  pushTrace({
    agentId: "planner_agent",
    createdAt: timestampAt(sequence),
    message: "Planner agent started.",
    metadata: { state },
    runId,
    sequence,
    stepId: "planner_agent",
    type: "agent_started",
  });
  sequence += 1;
  const planner = runPlannerAgent(context);
  state = transitionCampaignWorkflowState(state, "planner_completed");
  pushTrace({
    agentId: "planner_agent",
    createdAt: timestampAt(sequence),
    message: "Planner agent completed.",
    metadata: { channels: planner.channels.length, state },
    runId,
    sequence,
    stepId: "planner_agent",
    type: "agent_completed",
  });
  sequence += 1;

  pushTrace({
    agentId: "drafting_agent",
    createdAt: timestampAt(sequence),
    message: "Drafting agent started.",
    metadata: { state },
    runId,
    sequence,
    stepId: "drafting_agent",
    type: "agent_started",
  });
  sequence += 1;
  const drafting = runDraftingAgent({ context, plan: planner });
  state = transitionCampaignWorkflowState(state, "drafting_completed");
  pushTrace({
    agentId: "drafting_agent",
    createdAt: timestampAt(sequence),
    message: "Drafting agent completed.",
    metadata: { draftAssets: drafting.draftAssets.length, state },
    runId,
    sequence,
    stepId: "drafting_agent",
    type: "agent_completed",
  });
  sequence += 1;

  pushTrace({
    agentId: "qa_agent",
    createdAt: timestampAt(sequence),
    message: "QA agent started.",
    metadata: { state },
    runId,
    sequence,
    stepId: "qa_agent",
    type: "agent_started",
  });
  sequence += 1;
  const qa = runQaAgent({ context, draft: drafting, plan: planner });
  state = transitionCampaignWorkflowState(state, "qa_completed");
  pushTrace({
    agentId: "qa_agent",
    createdAt: timestampAt(sequence),
    message: "QA agent completed.",
    metadata: { passed: qa.passed, score: qa.score, state },
    runId,
    sequence,
    stepId: "qa_agent",
    type: "agent_completed",
  });
  sequence += 1;
  pushTrace({
    agentId: "qa_agent",
    createdAt: timestampAt(sequence),
    message: "Evaluation completed.",
    metadata: { passed: qa.passed, score: qa.score },
    runId,
    sequence,
    stepId: "qa_agent",
    type: "evaluation_completed",
  });
  sequence += 1;

  pushTrace({
    agentId: "approval_agent",
    createdAt: timestampAt(sequence),
    message: "Approval agent started.",
    metadata: { state },
    runId,
    sequence,
    stepId: "approval_gate",
    type: "agent_started",
  });
  sequence += 1;
  const approval = runApprovalAgent({ context, draft: drafting, evaluation: qa });
  state = transitionCampaignWorkflowState(state, "approval_required");
  pushTrace({
    agentId: "approval_agent",
    createdAt: timestampAt(sequence),
    message: "Human approval is required before the publish package can be used.",
    metadata: { gateId: approval.gateId, riskLevel: approval.riskLevel, state },
    runId,
    sequence,
    stepId: "approval_gate",
    type: "approval_required",
  });
  sequence += 1;
  pushTrace({
    agentId: "approval_agent",
    createdAt: timestampAt(sequence),
    message: "Approval gate metadata created.",
    metadata: { approvalRequired: approval.approvalRequired, reviewerRole: approval.reviewerRole },
    runId,
    sequence,
    stepId: "approval_gate",
    type: "agent_completed",
  });
  sequence += 1;

  const finalPublishPackage: CampaignPublishPackage = {
    id: `package_${goalSlug}`,
    title: "Mock Campaign Publish Package",
    campaignGoal: normalisedGoal,
    headline: drafting.headline,
    body: drafting.body,
    callToAction: drafting.callToAction,
    qualityScore: qa.score,
    approvalGateId: approval.gateId,
    approvalRequiredBeforeUse: true,
    mockDestination: "mock://publish-package-preview",
    publicSafetyNote:
      "Preview-only mock package. It must not be treated as approved until the human gate is resolved.",
  };

  state = transitionCampaignWorkflowState(state, "publish_package_prepared");
  state = transitionCampaignWorkflowState(state, "workflow_completed");
  pushTrace({
    createdAt: timestampAt(sequence),
    message: "Workflow completed with a preview-only publish package.",
    metadata: {
      approvalGateId: approval.gateId,
      approvalRequiredBeforeUse: finalPublishPackage.approvalRequiredBeforeUse,
      packageId: finalPublishPackage.id,
      state,
    },
    runId,
    sequence,
    stepId: "publish_package",
    type: "workflow_completed",
  });

  const cost = estimateWorkflowCost([planner.tokens, drafting.tokens, qa.tokens, approval.tokens]);
  const orderedSteps: CampaignWorkflowStepResult[] = [
    {
      id: "planner_agent",
      name: "Plan campaign package",
      status: "completed",
      agentId: "planner_agent",
      outputSummary: planner.summary,
    },
    {
      id: "drafting_agent",
      name: "Draft campaign package",
      status: "completed",
      agentId: "drafting_agent",
      outputSummary: drafting.summary,
    },
    {
      id: "qa_agent",
      name: "Evaluate campaign package",
      status: "completed",
      agentId: "qa_agent",
      outputSummary: qa.summary,
    },
    {
      id: "approval_gate",
      name: "Require human approval",
      status: "approval_required",
      agentId: "approval_agent",
      outputSummary: approval.summary,
    },
    {
      id: "publish_package",
      name: "Prepare preview-only publish package",
      status: "completed",
      outputSummary: "Created a preview-only package that remains blocked by the approval gate.",
    },
  ];

  return {
    runId,
    templateId: campaignPublishPackageTemplate.id,
    status: "completed",
    campaignGoal: normalisedGoal,
    orderedSteps,
    agentOutputs: {
      planner,
      drafting,
      qa,
      approval,
    },
    approvalRequirement: {
      required: true,
      gateId: approval.gateId,
      status: "required_before_publish",
      reviewerRole: approval.reviewerRole,
      reason: approval.reason,
    },
    finalPublishPackage,
    traceEvents,
    evaluationSummary: {
      score: qa.score,
      passed: qa.passed,
      recommendation: qa.recommendation,
      findings: qa.findings,
      cost,
    },
    publicSafetyNote:
      "Deterministic mock runtime result only. No external AI APIs, webhooks, credentials, production data, or private PromptLabTools logic were used.",
  };
}
