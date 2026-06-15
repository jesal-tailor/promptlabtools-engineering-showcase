import { describe, expect, it } from "vitest";
import {
  explainApprovalRequirement,
  getActionRiskLevel,
  requiresHumanApproval,
} from "../src/lib/approvals/approvalPolicy";

describe("approval policy", () => {
  it("flags high-risk actions as requiring human approval", () => {
    expect(requiresHumanApproval("publish_public_content")).toBe(true);
    expect(requiresHumanApproval("send_outbound_email")).toBe(true);
    expect(requiresHumanApproval("spend_money")).toBe(true);
    expect(requiresHumanApproval("change_pricing")).toBe(true);
    expect(requiresHumanApproval("use_personal_profile")).toBe(true);
    expect(requiresHumanApproval("modify_live_website_copy")).toBe(true);
    expect(getActionRiskLevel("publish_public_content")).toBe("high");
  });

  it("auto-allows mock-safe actions", () => {
    expect(requiresHumanApproval("draft_content")).toBe(false);
    expect(requiresHumanApproval("analyse_metrics")).toBe(false);
    expect(requiresHumanApproval("create_mock_publish_package")).toBe(false);
    expect(requiresHumanApproval("score_content_quality")).toBe(false);
    expect(requiresHumanApproval("generate_mock_utm_url")).toBe(false);
    expect(getActionRiskLevel("create_mock_publish_package")).toBe("low");
  });

  it("explains unknown actions conservatively", () => {
    expect(requiresHumanApproval("unknown_action")).toBe(true);
    expect(getActionRiskLevel("unknown_action")).toBe("medium");
    expect(explainApprovalRequirement("unknown_action")).toContain("requires review by default");
  });
});
