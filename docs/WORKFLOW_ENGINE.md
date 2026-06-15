# Workflow Engine

Stage 3 adds a typed mock workflow engine for the `campaign_publish_package` template.

## Template

The template is defined in `src/lib/workflows/workflowTemplates.ts`.

```text
campaign_publish_package
  |
  v
planner_agent
  |
  v
drafting_agent
  |
  v
qa_agent
  |
  v
approval_gate
  |
  v
publish_package
```

## Runner

The runner lives in `src/lib/workflows/workflowRunner.ts`.

It accepts:

- `campaignGoal`

It returns:

- Workflow run id.
- Status.
- Ordered steps.
- Agent outputs.
- Approval requirement.
- Preview-only final publish package.
- Trace events.
- Evaluation summary.

## State Transitions

The state machine lives in `src/lib/workflows/workflowStateMachine.ts`.

```text
created
  |
  v
planning
  |
  v
drafting
  |
  v
evaluating
  |
  v
waiting_for_approval
  |
  v
publishing
  |
  v
package_prepared
  |
  v
completed
```

The publish package cannot be prepared before the approval gate is reached.

## Approval Gate Behaviour

The approval gate is required before the final package can be used.

The runner still returns a `finalPublishPackage`, but it is explicitly labelled:

- `approvalRequiredBeforeUse: true`
- `mockDestination: "mock://publish-package-preview"`
- Preview-only and not production approved.

This demonstrates how a control plane can prepare an artifact while still blocking any real publish-like side effect.

## Workflow Continuation After Approval

Stage 4 adds deterministic continuation behaviour:

| Decision | Workflow action | Result |
| --- | --- | --- |
| `approved` | `continue_workflow` | Appends `approval_approved` and `workflow_completed`; final package is generated |
| `rejected` | `stop_workflow` | Appends `approval_rejected` and `workflow_stopped`; no final package is generated |
| `needs_changes` | `return_to_drafting` | Appends `approval_needs_changes` and `workflow_returned_to_drafting`; includes a mock revision instruction |

This logic lives in `runCampaignWorkflowWithApprovalDecision` in `src/lib/workflows/workflowRunner.ts`.

## Production Differences

A production workflow engine would add:

- Persistent workflow run records.
- Queue-backed async step execution.
- Idempotency keys and retry policies.
- Real human approval decisions.
- Server-side approval enforcement.
- Artifact versioning and storage.
- Integration dispatch only after approval and policy checks.
