import { createGoalSlug, normaliseCampaignGoal } from "@/lib/agents/agentTypes";
import { runApprovalAgent } from "@/lib/agents/approvalAgent";
import { runDraftingAgent } from "@/lib/agents/draftingAgent";
import { runPlannerAgent } from "@/lib/agents/plannerAgent";
import { runQaAgent } from "@/lib/agents/qaAgent";
import { applyApprovalDecision } from "@/lib/approvals/approvalStateMachine";
import { estimateWorkflowCost } from "@/lib/observability/costEstimator";
import { createTraceEvent } from "@/lib/observability/traceEvents";
import { campaignPublishPackageTemplate } from "@/lib/workflows/workflowTemplates";
import {
  transitionCampaignWorkflowState,
  type CampaignWorkflowState,
} from "@/lib/workflows/workflowStateMachine";
import type {
  CampaignApprovalRequirement,
  CampaignEvaluationSummary,
  CampaignPublishPackage,
  CampaignWorkflowAgentOutputs,
  CampaignWorkflowApprovalDecisionInput,
  CampaignWorkflowContinuationResult,
  CampaignWorkflowInput,
  CampaignWorkflowRunResult,
  CampaignWorkflowStepResult,
} from "@/lib/workflows/workflowTypes";

const defaultRunStartedAt = "2026-06-15T09:00:00.000Z";

export type CampaignWorkflowInputValidation =
  | { ok: true; data: CampaignWorkflowInput }
  | { ok: false; errors: string[] };

type ApprovalGateRun = {
  runId: string;
  campaignGoal: string;
  goalSlug: string;
  traceEvents: CampaignWorkflowRunResult["traceEvents"];
  nextSequence: number;
  timestampAt: (sequence: number) => string;
  agentOutputs: CampaignWorkflowAgentOutputs;
  approvalRequirement: CampaignApprovalRequirement;
  evaluationSummary: CampaignEvaluationSummary;
  orderedStepsToApproval: CampaignWorkflowStepResult[];
};

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

function buildFinalPublishPackage({
  approvalGateId,
  campaignGoal,
  goalSlug,
  outputs,
}: {
  approvalGateId: string;
  campaignGoal: string;
  goalSlug: string;
  outputs: CampaignWorkflowAgentOutputs;
}): CampaignPublishPackage {
  return {
    id: `package_${goalSlug}`,
    title: "Mock Campaign Publish Package",
    campaignGoal,
    headline: outputs.drafting.headline,
    body: outputs.drafting.body,
    callToAction: outputs.drafting.callToAction,
    qualityScore: outputs.qa.score,
    approvalGateId,
    approvalRequiredBeforeUse: true,
    mockDestination: "mock://publish-package-preview",
    publicSafetyNote:
      "Preview-only mock package. It must not be treated as approved until the human gate is resolved.",
  };
}

function runCampaignWorkflowToApprovalGate({
  campaignGoal,
  runStartedAt = defaultRunStartedAt,
}: CampaignWorkflowInput & { runStartedAt?: string }): ApprovalGateRun {
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

  const agentOutputs = {
    planner,
    drafting,
    qa,
    approval,
  };
  const cost = estimateWorkflowCost([planner.tokens, drafting.tokens, qa.tokens, approval.tokens]);
  const orderedStepsToApproval: CampaignWorkflowStepResult[] = [
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
  ];

  return {
    runId,
    campaignGoal: normalisedGoal,
    goalSlug,
    traceEvents,
    nextSequence: sequence,
    timestampAt,
    agentOutputs,
    approvalRequirement: {
      required: true,
      gateId: approval.gateId,
      status: "required_before_publish",
      reviewerRole: approval.reviewerRole,
      reason: approval.reason,
    },
    evaluationSummary: {
      score: qa.score,
      passed: qa.passed,
      recommendation: qa.recommendation,
      findings: qa.findings,
      cost,
    },
    orderedStepsToApproval,
  };
}

export function runCampaignPublishPackageWorkflow({
  campaignGoal,
  runStartedAt = defaultRunStartedAt,
}: CampaignWorkflowInput & { runStartedAt?: string }): CampaignWorkflowRunResult {
  const gateRun = runCampaignWorkflowToApprovalGate({ campaignGoal, runStartedAt });
  const finalPublishPackage = buildFinalPublishPackage({
    approvalGateId: gateRun.approvalRequirement.gateId,
    campaignGoal: gateRun.campaignGoal,
    goalSlug: gateRun.goalSlug,
    outputs: gateRun.agentOutputs,
  });
  let state: CampaignWorkflowState = "waiting_for_approval";

  state = transitionCampaignWorkflowState(state, "approval_required");
  state = transitionCampaignWorkflowState(state, "publish_package_prepared");
  state = transitionCampaignWorkflowState(state, "workflow_completed");
  gateRun.traceEvents.push(
    createTraceEvent({
      createdAt: gateRun.timestampAt(gateRun.nextSequence),
      message: "Workflow completed with a preview-only publish package.",
      metadata: {
        approvalGateId: gateRun.approvalRequirement.gateId,
        approvalRequiredBeforeUse: finalPublishPackage.approvalRequiredBeforeUse,
        packageId: finalPublishPackage.id,
        state,
      },
      runId: gateRun.runId,
      sequence: gateRun.nextSequence,
      stepId: "publish_package",
      type: "workflow_completed",
    }),
  );

  return {
    runId: gateRun.runId,
    templateId: campaignPublishPackageTemplate.id,
    status: "completed",
    campaignGoal: gateRun.campaignGoal,
    orderedSteps: [
      ...gateRun.orderedStepsToApproval,
      {
        id: "publish_package",
        name: "Prepare preview-only publish package",
        status: "completed",
        outputSummary: "Created a preview-only package that remains blocked by the approval gate.",
      },
    ],
    agentOutputs: gateRun.agentOutputs,
    approvalRequirement: gateRun.approvalRequirement,
    finalPublishPackage,
    traceEvents: gateRun.traceEvents,
    evaluationSummary: gateRun.evaluationSummary,
    publicSafetyNote:
      "Deterministic mock runtime result only. No external AI APIs, webhooks, credentials, production data, or private PromptLabTools logic were used.",
  };
}

export function runCampaignWorkflowWithApprovalDecision({
  approvalDecision,
  campaignGoal,
  decidedAt = "2026-06-15T10:30:00.000Z",
  decidedBy,
  reviewerComment,
  runStartedAt = defaultRunStartedAt,
}: CampaignWorkflowApprovalDecisionInput): CampaignWorkflowContinuationResult {
  const gateRun = runCampaignWorkflowToApprovalGate({ campaignGoal, runStartedAt });
  const approvalDecisionPayload = {
    approvalId: gateRun.approvalRequirement.gateId,
    runId: gateRun.runId,
    stepId: "approval_gate",
    decision: approvalDecision,
    reviewerComment,
    decidedBy,
    decidedAt,
  };
  const approvalDecisionResult = applyApprovalDecision({
    payload: approvalDecisionPayload,
  });
  const nextSequence = gateRun.nextSequence;

  if (approvalDecision === "approved") {
    const finalPublishPackage = buildFinalPublishPackage({
      approvalGateId: gateRun.approvalRequirement.gateId,
      campaignGoal: gateRun.campaignGoal,
      goalSlug: gateRun.goalSlug,
      outputs: gateRun.agentOutputs,
    });

    gateRun.traceEvents.push(
      createTraceEvent({
        createdAt: gateRun.timestampAt(nextSequence),
        message: "Human approval approved the mock publish package.",
        metadata: { auditEventId: approvalDecisionResult.auditEvent.id },
        runId: gateRun.runId,
        sequence: nextSequence,
        stepId: "approval_gate",
        type: "approval_approved",
      }),
      createTraceEvent({
        createdAt: gateRun.timestampAt(nextSequence + 1),
        message: "Workflow completed after approval with a preview-only publish package.",
        metadata: { packageId: finalPublishPackage.id, workflowAction: approvalDecisionResult.workflowAction },
        runId: gateRun.runId,
        sequence: nextSequence + 1,
        stepId: "publish_package",
        type: "workflow_completed",
      }),
    );

    return createContinuationResult({
      gateRun,
      approvalDecisionPayload,
      approvalDecisionResult,
      finalPublishPackage,
      orderedSteps: [
        ...gateRun.orderedStepsToApproval,
        {
          id: "publish_package",
          name: "Prepare approved mock publish package",
          status: "completed",
          outputSummary: "Created the final preview package after mock human approval.",
        },
      ],
      status: "completed",
    });
  }

  if (approvalDecision === "rejected") {
    gateRun.traceEvents.push(
      createTraceEvent({
        createdAt: gateRun.timestampAt(nextSequence),
        message: "Human approval rejected the mock publish package.",
        metadata: { auditEventId: approvalDecisionResult.auditEvent.id },
        runId: gateRun.runId,
        sequence: nextSequence,
        stepId: "approval_gate",
        type: "approval_rejected",
      }),
      createTraceEvent({
        createdAt: gateRun.timestampAt(nextSequence + 1),
        message: "Workflow stopped after rejection. No final publish package was generated.",
        metadata: { workflowAction: approvalDecisionResult.workflowAction },
        runId: gateRun.runId,
        sequence: nextSequence + 1,
        stepId: "approval_gate",
        type: "workflow_stopped",
      }),
    );

    return createContinuationResult({
      gateRun,
      approvalDecisionPayload,
      approvalDecisionResult,
      finalPublishPackage: null,
      orderedSteps: gateRun.orderedStepsToApproval,
      status: "stopped",
    });
  }

  const revisionInstruction =
    "Revise the mock campaign package to make public-safe boundaries and approval rationale more explicit.";
  gateRun.traceEvents.push(
    createTraceEvent({
      createdAt: gateRun.timestampAt(nextSequence),
      message: "Human approval requested changes to the mock publish package.",
      metadata: { auditEventId: approvalDecisionResult.auditEvent.id },
      runId: gateRun.runId,
      sequence: nextSequence,
      stepId: "approval_gate",
      type: "approval_needs_changes",
    }),
    createTraceEvent({
      createdAt: gateRun.timestampAt(nextSequence + 1),
      message: "Workflow returned to drafting with deterministic mock revision instructions.",
      metadata: { revisionInstruction, workflowAction: approvalDecisionResult.workflowAction },
      runId: gateRun.runId,
      sequence: nextSequence + 1,
      stepId: "drafting_agent",
      type: "workflow_returned_to_drafting",
    }),
  );

  return createContinuationResult({
    gateRun,
    approvalDecisionPayload,
    approvalDecisionResult,
    finalPublishPackage: null,
    orderedSteps: gateRun.orderedStepsToApproval,
    revisionInstruction,
    status: "returned_to_drafting",
  });
}

function createContinuationResult({
  approvalDecisionPayload,
  approvalDecisionResult,
  finalPublishPackage,
  gateRun,
  orderedSteps,
  revisionInstruction,
  status,
}: {
  approvalDecisionPayload: CampaignWorkflowContinuationResult["approvalDecisionPayload"];
  approvalDecisionResult: CampaignWorkflowContinuationResult["approvalDecisionResult"];
  finalPublishPackage: CampaignWorkflowContinuationResult["finalPublishPackage"];
  gateRun: ApprovalGateRun;
  orderedSteps: CampaignWorkflowStepResult[];
  revisionInstruction?: string;
  status: CampaignWorkflowContinuationResult["status"];
}): CampaignWorkflowContinuationResult {
  return {
    runId: gateRun.runId,
    templateId: campaignPublishPackageTemplate.id,
    status,
    campaignGoal: gateRun.campaignGoal,
    orderedSteps,
    agentOutputs: gateRun.agentOutputs,
    approvalRequirement: gateRun.approvalRequirement,
    approvalDecisionPayload,
    approvalDecisionResult,
    workflowAction: approvalDecisionResult.workflowAction,
    finalPublishPackage,
    traceEvents: gateRun.traceEvents,
    evaluationSummary: gateRun.evaluationSummary,
    revisionInstruction,
    publicSafetyNote:
      "Deterministic mock approval-continuation result only. No external AI APIs, webhooks, credentials, production data, or private PromptLabTools logic were used.",
  };
}
