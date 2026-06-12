import { describe, expect, test } from "vitest";
import { buildOgImageUrl } from "./metadata";

describe("buildOgImageUrl", () => {
  test("points at the dynamic OG route with an encoded title", () => {
    const url = buildOgImageUrl({ title: "Intro to AI Agents" });
    expect(url.startsWith("/api/og?")).toBe(true);
    expect(url).toContain("title=Intro+to+AI+Agents");
  });

  test("omits the eyebrow param when not provided", () => {
    expect(buildOgImageUrl({ title: "About" })).not.toContain("eyebrow=");
  });

  test("includes the eyebrow when provided", () => {
    const url = buildOgImageUrl({
      title: "Building ML Pipelines",
      eyebrow: "Tutorial",
    });
    expect(url).toContain("eyebrow=Tutorial");
  });

  test("truncates very long titles to keep the URL bounded", () => {
    const long = "A".repeat(300);
    const url = buildOgImageUrl({ title: long });
    const value = new URLSearchParams(url.split("?")[1]).get("title") ?? "";
    expect(value.length).toBeLessThanOrEqual(100);
  });

  test("encodes special characters safely", () => {
    const url = buildOgImageUrl({ title: "AI & ML: 2025 Trends?" });
    // the decoded value round-trips
    const value = new URLSearchParams(url.split("?")[1]).get("title");
    expect(value).toBe("AI & ML: 2025 Trends?");
  });
});
