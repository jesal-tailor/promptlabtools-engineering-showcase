# API Contracts

This repository exposes public-safe mock API routes only.

## Start Workflow

`POST /api/workflows/start`

Starts a deterministic mock execution of the `campaign_publish_package` workflow.

### JSON Request

```json
{
  "campaignGoal": "Launch a public-safe AI workflow showcase for CV reviewers"
}
```

The route also accepts a simple form submission with a `campaignGoal` field.

### Validation

`campaignGoal` must:

- Be a string.
- Be at least 12 characters.
- Be 240 characters or fewer.

### Success Response

```json
{
  "ok": true,
  "workflow": {
    "runId": "mock_run_campaign_publish_package_launch-a-public-safe-ai-workflow-showcase-for-cv",
    "templateId": "campaign_publish_package",
    "status": "completed",
    "orderedSteps": [],
    "agentOutputs": {},
    "approvalRequirement": {
      "required": true,
      "status": "required_before_publish"
    },
    "finalPublishPackage": {
      "approvalRequiredBeforeUse": true,
      "mockDestination": "mock://publish-package-preview"
    },
    "traceEvents": [],
    "evaluationSummary": {}
  },
  "note": "Deterministic mock runtime execution only. No external AI API, webhook, or production automation was called."
}
```

The abbreviated arrays and objects above are documented shape examples. The actual route returns the full deterministic mock runtime payload.

### Error Response

```json
{
  "ok": false,
  "errors": [
    "campaignGoal must describe the mock campaign goal in at least 12 characters."
  ],
  "note": "Mock workflow start route only. No external service was called."
}
```

Invalid input returns HTTP 400.

## Existing Lead Capture Route

`POST /api/showcase-lead`

This existing route remains a mock lead-capture example. It validates input, creates typed workflow events, and returns JSON without calling external services.

## Decide Approval

`POST /api/approvals/[approvalId]/decide`

Applies a deterministic mock approval decision.

### JSON Request

```json
{
  "decision": "approved",
  "reviewerComment": "Approved for public-safe mock preview.",
  "decidedBy": "mock_reviewer@example.test",
  "runId": "mock_run_campaign_publish_package_launch-a-public-safe-ai-workflow-showcase-for-cv",
  "stepId": "approval_gate"
}
```

`runId` and `stepId` have safe mock defaults if omitted.

### Validation

- `decision` must be `approved`, `rejected`, or `needs_changes`.
- `reviewerComment` must explain the decision.
- `decidedBy` must identify the mock reviewer.
- `decidedAt`, if supplied, must be date-compatible.

### Success Response

```json
{
  "ok": true,
  "approvalId": "approval_test",
  "result": {
    "previousStatus": "pending_review",
    "newStatus": "approved",
    "workflowAction": "continue_workflow",
    "auditEvent": {
      "type": "approval_decision_recorded"
    }
  },
  "note": "Public-safe mock governance only. No database, identity provider, webhook, or production workflow was called."
}
```

### Error Response

Invalid input returns HTTP 400 with clear validation errors.

## Get Prompt

`GET /api/prompts/[promptId]`

Returns a mock prompt registry record, lifecycle explanation, evaluation trend, human feedback summary, and prompt improvement recommendation.

### Success Response

```json
{
  "ok": true,
  "prompt": {
    "id": "prompt_campaign_planner_v2",
    "status": "active",
    "version": "2.0.0-mock"
  },
  "lifecycle": "Campaign Planner 2.0.0-mock is active...",
  "evaluationTrend": [],
  "humanFeedback": {},
  "recommendation": "Recommended improvement...",
  "note": "Public-safe mock prompt metadata only. No production PromptLabTools prompt content was accessed."
}
```

Missing prompt IDs return HTTP 400 with a clear error message.

## Compare Prompt Versions

`POST /api/prompts/[promptId]/compare`

### JSON Request

```json
{
  "compareToPromptId": "prompt_campaign_planner_v2"
}
```

### Success Response

```json
{
  "ok": true,
  "comparison": {
    "versionChange": "1.0.0-mock -> 2.0.0-mock",
    "statusChange": "deprecated -> active",
    "addedCriteria": ["risk"]
  },
  "note": "Deterministic mock prompt version comparison only."
}
```

Invalid input returns HTTP 400.

## Get Evaluation Run

`GET /api/evaluations/[runId]`

Returns a deterministic mock evaluation run with human feedback summary and recommendation. Missing run IDs return HTTP 400.

## Check Evaluation Regression

`POST /api/evaluations/regression-check`

Accepts either historical run IDs:

```json
{
  "baselineRunId": "eval_hist_planner_v1",
  "candidateRunId": "eval_hist_planner_v2"
}
```

Or explicit scores:

```json
{
  "baselineScore": 91,
  "candidateScore": 80,
  "threshold": 5
}
```

The route returns a deterministic regression decision and does not call an external evaluator.

## Public-Safe API Boundary

The API routes do not:

- Call real AI providers.
- Send webhooks.
- Persist data.
- Use secrets.
- Execute production PromptLabTools automations.
- Process customer records.

## Production Differences

Production API contracts would add:

- Authentication and authorisation.
- Idempotency keys.
- Persistent run records.
- Async execution status endpoints.
- Approval decision endpoints.
- Prompt lifecycle and evaluation regression endpoints.
- Audit logs.
- OpenAPI or JSON Schema definitions.
- Rate limits and abuse protection.
