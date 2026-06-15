# Tool Registry

The tool registry defines which tools exist, which agents may use them, and which actions require approval.

## Tool Definition Fields

Each tool includes:

- `id`
- `name`
- `description`
- `allowedAgentIds`
- `actionName`
- `riskLevel`
- `requiresApproval`
- `inputSchemaName`
- `outputSchemaName`
- `adapterType`
- `enabled`

All current adapters use `adapterType: "mock"`.

## Registered Mock Tools

- `generate_mock_utm_url`
- `create_mock_publish_package`
- `score_content_quality`
- `write_mock_markdown_artifact`
- `fetch_mock_metrics`
- `create_mock_github_issue`
- `send_mock_webhook`

`send_mock_webhook` is intentionally disabled to show fail-closed handling for outbound integrations.

## UI

The registry is visible at `/tools`. Detail pages are available at `/tools/[toolId]`, and mock audit records are visible at `/tools/audit`.
