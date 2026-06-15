# Governance Model

Stage 4 adds a deterministic, public-safe governance layer for human approval decisions.

## Why Human Approval Gates Exist

Agentic workflows can prepare useful artifacts, but some actions should not proceed without a human reviewer. This showcase models that control point without connecting to any real production system.

Human approval gates protect actions that could affect:

- Public content.
- Outbound communication.
- Spend.
- Pricing.
- Personal identity or profile use.
- Live website copy.

## Actions That Require Approval

The approval policy lives in `src/lib/approvals/approvalPolicy.ts`.

These actions require human approval:

- `publish_public_content`
- `send_outbound_email`
- `spend_money`
- `change_pricing`
- `use_personal_profile`
- `modify_live_website_copy`

## Auto-Allowed Mock Actions

These actions are auto-allowed in the mock showcase because they do not create external side effects:

- `draft_content`
- `analyse_metrics`
- `create_mock_publish_package`
- `score_content_quality`
- `generate_mock_utm_url`

Unknown actions are treated conservatively as medium risk and require review by default.

## Risk Levels

- `high`: explicit human approval required.
- `low`: safe mock action, auto-allowed.
- `medium`: unknown action, review by default.

## Production Differences

A production governance model would add:

- Authenticated reviewer identity.
- Role-based approval permissions.
- Durable policy configuration.
- Workspace or tenant scoping.
- Environment-specific policy decisions.
- Audit retention and export.
- Enforcement before real tool execution.
