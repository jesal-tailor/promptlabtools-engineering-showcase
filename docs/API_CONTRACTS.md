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
- Audit logs.
- OpenAPI or JSON Schema definitions.
- Rate limits and abuse protection.
