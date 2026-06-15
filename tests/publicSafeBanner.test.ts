import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PublicSafeRuntimeBanner } from "../src/components/PublicSafeRuntimeBanner";
import { publicSafeRuntimeStatement } from "../src/lib/deployment/deploymentMetadata";

describe("PublicSafeRuntimeBanner", () => {
  it("renders the public-safe runtime statement", () => {
    const markup = renderToStaticMarkup(createElement(PublicSafeRuntimeBanner));

    expect(markup).toContain("Public-safe runtime");
    expect(markup).toContain(publicSafeRuntimeStatement);
    expect(markup).toContain("deterministic mock data");
  });
});
