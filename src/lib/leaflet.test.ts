import { describe, expect, test } from "vitest";
import {
  dedupeBySlug,
  flattenBlocks,
  isPublishable,
  parseCodeBlock,
  safeHref,
  segmentText,
  slugOf,
  sortPosts,
  toPost,
  type LeafletBlock,
  type Post,
  type RepoRecord,
} from "./leaflet";

describe("parseCodeBlock", () => {
  const codeFacet = (byteStart: number, byteEnd: number) => ({
    index: { byteStart, byteEnd },
    features: [{ $type: "pub.leaflet.richtext.facet#code" }],
  });

  test("recovers and pretty-prints a collapsed JSON fenced block", () => {
    // The exact shape blog-manager produced: a one-line ``json { … } `` block
    // with literal fence backticks and a #code facet over the interior.
    const plaintext =
      '``json { "agent_loop": [ {"step": "plan"} ] } ``';
    const block: LeafletBlock = {
      $type: "pub.leaflet.blocks.text",
      plaintext,
      facets: [codeFacet(2, plaintext.length - 2)],
    };
    const result = parseCodeBlock(block);
    expect(result).not.toBeNull();
    expect(result?.lang).toBe("json");
    expect(result?.code).toBe(
      '{\n  "agent_loop": [\n    {\n      "step": "plan"\n    }\n  ]\n}',
    );
  });

  test("keeps a non-JSON fenced block verbatim with its language", () => {
    const plaintext = "``python print('hi') ``";
    const block: LeafletBlock = {
      $type: "pub.leaflet.blocks.text",
      plaintext,
      facets: [codeFacet(2, plaintext.length - 2)],
    };
    expect(parseCodeBlock(block)).toEqual({ code: "print('hi')", lang: "python" });
  });

  test("returns null for an inline code facet (no fence) so it stays inline", () => {
    const block: LeafletBlock = {
      $type: "pub.leaflet.blocks.text",
      plaintext: "use the foo helper",
      facets: [codeFacet(8, 11)],
    };
    expect(parseCodeBlock(block)).toBeNull();
  });

  test("returns null for prose without a code facet", () => {
    expect(
      parseCodeBlock({ $type: "pub.leaflet.blocks.text", plaintext: "just text" }),
    ).toBeNull();
  });
});

describe("safeHref", () => {
  test("allows http(s), mailto, and relative/anchor links", () => {
    expect(safeHref("https://example.com")).toBe("https://example.com");
    expect(safeHref("http://example.com")).toBe("http://example.com");
    expect(safeHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(safeHref("/blog/x")).toBe("/blog/x");
    expect(safeHref("#section")).toBe("#section");
  });

  test("rejects dangerous schemes", () => {
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref("  JavaScript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,<script>")).toBeUndefined();
    expect(safeHref("vbscript:msgbox")).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
  });
});

describe("segmentText", () => {
  test("returns a single plain segment when there are no facets", () => {
    expect(segmentText("hello world")).toEqual([
      { text: "hello world", features: [] },
    ]);
  });

  test("splits a facet range out of the surrounding text", () => {
    // bytes: "the code word" -> "code" is bytes 4..8
    const segments = segmentText("the code word", [
      { index: { byteStart: 4, byteEnd: 8 }, features: [{ $type: "pub.leaflet.richtext.facet#code" }] },
    ]);
    expect(segments).toEqual([
      { text: "the ", features: [] },
      { text: "code", features: [{ $type: "pub.leaflet.richtext.facet#code" }] },
      { text: " word", features: [] },
    ]);
  });

  test("slices on UTF-8 byte boundaries, not JS string indices", () => {
    // "🚀 boom" — the rocket emoji is 4 UTF-8 bytes, then a space (byte 4).
    // "boom" occupies bytes 5..9. A naive string-index slice (5..9) would be
    // "oom " and corrupt the emoji; byte-correct slicing yields "boom".
    const text = "🚀 boom";
    const segments = segmentText(text, [
      { index: { byteStart: 5, byteEnd: 9 }, features: [{ $type: "pub.leaflet.richtext.facet#bold" }] },
    ]);
    expect(segments).toEqual([
      { text: "🚀 ", features: [] },
      { text: "boom", features: [{ $type: "pub.leaflet.richtext.facet#bold" }] },
    ]);
    // The emoji survived intact.
    expect(segments[0].text).toContain("🚀");
  });

  test("skips malformed / zero-width facets without throwing", () => {
    const segments = segmentText("abc", [
      { index: { byteStart: 2, byteEnd: 2 }, features: [] }, // zero width
      // @ts-expect-error deliberately malformed
      { index: null, features: [] },
    ]);
    expect(segments).toEqual([{ text: "abc", features: [] }]);
  });

  test("orders unsorted facets and clamps overlaps to the remaining range", () => {
    const segments = segmentText("abcdef", [
      { index: { byteStart: 3, byteEnd: 5 }, features: [{ $type: "b" }] },
      { index: { byteStart: 0, byteEnd: 2 }, features: [{ $type: "a" }] },
      { index: { byteStart: 1, byteEnd: 4 }, features: [{ $type: "overlap" }] }, // clamped to 2..4
    ]);
    // No characters are ever lost — the overlapping facet is trimmed to what
    // hasn't already been consumed.
    expect(segments).toEqual([
      { text: "ab", features: [{ $type: "a" }] },
      { text: "cd", features: [{ $type: "overlap" }] },
      { text: "e", features: [{ $type: "b" }] },
      { text: "f", features: [] },
    ]);
    expect(segments.map((s) => s.text).join("")).toBe("abcdef");
  });
});

describe("slugOf", () => {
  test("prefers `path` with the leading slash stripped", () => {
    expect(slugOf({ path: "/handling-rate-limits" }, "3mpqxt4pfyd22")).toBe(
      "handling-rate-limits",
    );
  });

  test("falls back to the rkey when `path` is missing", () => {
    expect(slugOf({}, "3mpqxt4pfyd22")).toBe("3mpqxt4pfyd22");
  });

  test("falls back to the rkey when `path` is empty", () => {
    expect(slugOf({ path: "/" }, "3mpqxt4pfyd22")).toBe("3mpqxt4pfyd22");
  });
});

describe("toPost", () => {
  test("maps a record's value into the Post model", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/3mprg2hdytk23",
      value: {
        title: "A Post",
        description: "excerpt",
        path: "/a-post",
        tags: ["AI"],
        publishedAt: "2026-07-03T20:45:21.778Z",
        site: "at://did:plc:abc/site.standard.publication/pub1",
      },
    };
    expect(toPost(record)).toMatchObject({
      rkey: "3mprg2hdytk23",
      slug: "a-post",
      title: "A Post",
      description: "excerpt",
      tags: ["AI"],
      publishedAt: "2026-07-03T20:45:21.778Z",
      site: "at://did:plc:abc/site.standard.publication/pub1",
    });
  });

  test("defaults missing tags to an empty array", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: { title: "T", publishedAt: "2026-01-01T00:00:00Z" },
    };
    expect(toPost(record).tags).toEqual([]);
  });
});

describe("isPublishable", () => {
  const base: Post = {
    rkey: "rk",
    slug: "rk",
    title: "T",
    tags: [],
    publishedAt: "2026-01-01T00:00:00Z",
    site: "at://did:plc:abc/site.standard.publication/pub1",
  };

  test("requires a title and publishedAt", () => {
    expect(isPublishable({ ...base, title: "" })).toBe(false);
    expect(isPublishable({ ...base, publishedAt: "" })).toBe(false);
    expect(isPublishable(base)).toBe(true);
  });

  test("filters by publication uri when one is configured", () => {
    const pub = "at://did:plc:abc/site.standard.publication/pub1";
    expect(isPublishable(base, pub)).toBe(true);
    expect(
      isPublishable({ ...base, site: "https://algodojo.leaflet.pub/" }, pub),
    ).toBe(false);
  });
});

describe("sortPosts + dedupeBySlug", () => {
  const make = (rkey: string, slug: string, publishedAt: string): Post => ({
    rkey,
    slug,
    title: slug,
    tags: [],
    publishedAt,
  });

  test("sorts newest first", () => {
    const sorted = sortPosts([
      make("a", "a", "2026-01-01T00:00:00Z"),
      make("c", "c", "2026-03-01T00:00:00Z"),
      make("b", "b", "2026-02-01T00:00:00Z"),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(["c", "b", "a"]);
  });

  test("keeps the newest post per slug", () => {
    const deduped = dedupeBySlug(
      sortPosts([
        make("old", "shared", "2026-01-01T00:00:00Z"),
        make("new", "shared", "2026-05-01T00:00:00Z"),
        make("solo", "solo", "2026-02-01T00:00:00Z"),
      ]),
    );
    expect(deduped.map((p) => p.rkey)).toEqual(["new", "solo"]);
  });
});

describe("flattenBlocks", () => {
  test("flattens pages -> blocks and drops entries without a block type", () => {
    const blocks = flattenBlocks({
      pages: [
        {
          blocks: [
            { block: { $type: "pub.leaflet.blocks.header", level: 1, plaintext: "H" } },
            { block: { plaintext: "no type" } as never }, // dropped
            { block: { $type: "pub.leaflet.blocks.text", plaintext: "body" } },
          ],
        },
      ],
    });
    expect(blocks.map((b) => b.$type)).toEqual([
      "pub.leaflet.blocks.header",
      "pub.leaflet.blocks.text",
    ]);
  });

  test("returns an empty array for missing content", () => {
    expect(flattenBlocks(undefined)).toEqual([]);
  });
});
