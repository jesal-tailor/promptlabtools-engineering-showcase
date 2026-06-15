import type { ApprovalGovernedAction, ApprovalRiskLevel } from "@/lib/approvals/approvalTypes";

const humanApprovalActions = new Set<string>([
  "publish_public_content",
  "send_outbound_email",
  "spend_money",
  "change_pricing",
  "use_personal_profile",
  "modify_live_website_copy",
]);

const autoAllowedActions = new Set<string>([
  "draft_content",
  "analyse_metrics",
  "create_mock_publish_package",
  "score_content_quality",
  "generate_mock_utm_url",
]);

export function requiresHumanApproval(actionName: string): boolean {
  if (humanApprovalActions.has(actionName)) {
    return true;
  }

  if (autoAllowedActions.has(actionName)) {
    return false;
  }

  return true;
}

export function getActionRiskLevel(actionName: string): ApprovalRiskLevel {
  if (humanApprovalActions.has(actionName)) {
    return "high";
  }

  if (autoAllowedActions.has(actionName)) {
    return "low";
  }

  return "medium";
}

export function explainApprovalRequirement(actionName: string): string {
  if (humanApprovalActions.has(actionName)) {
    return `${actionName} requires human approval because it can affect public content, spend, live commercial settings, outbound communication, or personal identity.`;
  }

  if (autoAllowedActions.has(actionName)) {
    return `${actionName} is auto-allowed in this public-safe mock because it does not create external side effects.`;
  }

  return `${actionName} is treated as medium risk and requires review by default because it is not in the explicit allow list.`;
}

export const governedApprovalActions: ApprovalGovernedAction[] = [
  "publish_public_content",
  "send_outbound_email",
  "spend_money",
  "change_pricing",
  "use_personal_profile",
  "modify_live_website_copy",
  "draft_content",
  "analyse_metrics",
  "create_mock_publish_package",
  "score_content_quality",
  "generate_mock_utm_url",
];
