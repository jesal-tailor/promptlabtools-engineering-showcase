import type { ToolDefinition, ToolId } from "@/lib/tools/toolTypes";

export const toolRegistry: ToolDefinition[] = [
  {
    id: "generate_mock_utm_url",
    name: "Generate Mock UTM URL",
    description:
      "Creates a deterministic mock tracking URL for preview packages without contacting analytics services.",
    allowedAgentIds: ["drafting_agent", "approval_agent"],
    actionName: "generateUtmUrl",
    riskLevel: "low",
    requiresApproval: false,
    inputSchemaName: "GenerateMockUtmUrlInput",
    outputSchemaName: "GenerateMockUtmUrlOutput",
    adapterType: "mock",
    enabled: true,
  },
  {
    id: "create_mock_publish_package",
    name: "Create Mock Publish Package",
    description:
      "Creates a preview-only publish package after approval. It never posts to social, email, or production systems.",
    allowedAgentIds: ["approval_agent"],
    actionName: "createPublishPackage",
    riskLevel: "high",
    requiresApproval: true,
    inputSchemaName: "CreateMockPublishPackageInput",
    outputSchemaName: "CreateMockPublishPackageOutput",
    adapterType: "mock",
    enabled: true,
  },
  {
    id: "score_content_quality",
    name: "Score Content Quality",
    description:
      "Scores mock content quality using deterministic local rules instead of external model providers.",
    allowedAgentIds: ["qa_agent"],
    actionName: "scoreContentQuality",
    riskLevel: "medium",
    requiresApproval: false,
    inputSchemaName: "ScoreContentQualityInput",
    outputSchemaName: "ScoreContentQualityOutput",
    adapterType: "mock",
    enabled: true,
  },
  {
    id: "write_mock_markdown_artifact",
    name: "Write Mock Markdown Artifact",
    description:
      "Returns an in-memory markdown artifact record. It does not write to disk or external storage.",
    allowedAgentIds: ["drafting_agent"],
    actionName: "writeMarkdownArtifact",
    riskLevel: "low",
    requiresApproval: false,
    inputSchemaName: "WriteMockMarkdownArtifactInput",
    outputSchemaName: "WriteMockMarkdownArtifactOutput",
    adapterType: "mock",
    enabled: true,
  },
  {
    id: "fetch_mock_metrics",
    name: "Fetch Mock Metrics",
    description:
      "Returns deterministic fixture metrics from local code rather than analytics, CRM, or product systems.",
    allowedAgentIds: ["planner_agent", "qa_agent"],
    actionName: "fetchMetrics",
    riskLevel: "low",
    requiresApproval: false,
    inputSchemaName: "FetchMockMetricsInput",
    outputSchemaName: "FetchMockMetricsOutput",
    adapterType: "mock",
    enabled: true,
  },
  {
    id: "create_mock_github_issue",
    name: "Create Mock GitHub Issue",
    description:
      "Creates a fake issue payload for review. It never calls the GitHub API or creates real issues.",
    allowedAgentIds: ["approval_agent"],
    actionName: "createGithubIssue",
    riskLevel: "medium",
    requiresApproval: true,
    inputSchemaName: "CreateMockGithubIssueInput",
    outputSchemaName: "CreateMockGithubIssueOutput",
    adapterType: "mock",
    enabled: true,
  },
  {
    id: "send_mock_webhook",
    name: "Send Mock Webhook",
    description:
      "Disabled high-risk webhook example. It demonstrates fail-closed handling for outbound integrations.",
    allowedAgentIds: ["approval_agent"],
    actionName: "sendWebhook",
    riskLevel: "high",
    requiresApproval: true,
    inputSchemaName: "SendMockWebhookInput",
    outputSchemaName: "SendMockWebhookOutput",
    adapterType: "mock",
    enabled: false,
  },
];

export function getToolById(toolId: ToolId | string): ToolDefinition | undefined {
  return toolRegistry.find((tool) => tool.id === toolId);
}
