import { describe, expect, test } from "vitest";
import {
  dedupeBySlug,
  isPublishable,
  slugOf,
  sortPosts,
  stripTitleHeading,
  toPost,
  type Post,
  type RepoRecord,
} from "./blog-record";

describe("stripTitleHeading", () => {
  test("removes a leading heading that repeats the title", () => {
    const md = "# My Post\n\nFirst paragraph.";
    expect(stripTitleHeading(md, "My Post")).toBe("First paragraph.");
  });

  test("tolerates leading blank lines and is case-insensitive", () => {
    const md = "\n\n#  my post \n\nBody";
    expect(stripTitleHeading(md, "My Post")).toBe("Body");
  });

  test("leaves the body untouched when the first heading differs", () => {
    const md = "## Section\n\nBody";
    expect(stripTitleHeading(md, "My Post")).toBe(md);
  });

  test("leaves the body untouched when it does not start with a heading", () => {
    const md = "Intro sentence.\n\n# My Post";
    expect(stripTitleHeading(md, "My Post")).toBe(md);
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
  test("maps a record's value into the Post model, using textContent as markdown", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/3mprg2hdytk23",
      value: {
        title: "A Post",
        description: "excerpt",
        path: "/a-post",
        tags: ["AI"],
        publishedAt: "2026-07-03T20:45:21.778Z",
        site: "at://did:plc:abc/site.standard.publication/pub1",
        textContent: "# A Post\n\nBody with a\n\n```json\n{}\n```\n",
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
      markdown: "# A Post\n\nBody with a\n\n```json\n{}\n```\n",
      uri: "at://did:plc:abc/site.standard.document/3mprg2hdytk23",
    });
  });

  test("defaults missing tags and markdown to empty", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: { title: "T", publishedAt: "2026-01-01T00:00:00Z" },
    };
    const post = toPost(record);
    expect(post.tags).toEqual([]);
    expect(post.markdown).toBe("");
    expect(post.uri).toBe("at://did:plc:abc/site.standard.document/rk");
  });

  test("parses a valid coverImage blob", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        coverImage: {
          $type: "blob",
          ref: { $link: "bafkreiexample123" },
          mimeType: "image/jpeg",
          size: 245678,
        },
      },
    };
    expect(toPost(record).coverImage).toEqual({
      cid: "bafkreiexample123",
      mimeType: "image/jpeg",
      size: 245678,
    });
  });

  test("returns undefined for coverImage missing required fields", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        coverImage: { $type: "blob", mimeType: "image/jpeg" },
      },
    };
    expect(toPost(record).coverImage).toBeUndefined();
  });

  test("parses contributors with did, role, and displayName", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        contributors: [
          { did: "did:plc:contrib1", role: "editor", displayName: "Jane" },
          { did: "did:plc:contrib2", displayName: "Bob" },
          { did: "did:plc:contrib3" },
        ],
      },
    };
    expect(toPost(record).contributors).toEqual([
      { did: "did:plc:contrib1", role: "editor", displayName: "Jane" },
      { did: "did:plc:contrib2", displayName: "Bob" },
      { did: "did:plc:contrib3" },
    ]);
  });

  test("filters out contributors missing a did", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        contributors: [
          { role: "editor" },
          { did: "did:plc:contrib1", displayName: "Jane" },
        ],
      },
    };
    expect(toPost(record).contributors).toEqual([
      { did: "did:plc:contrib1", displayName: "Jane" },
    ]);
  });

  test("returns undefined for empty contributors array", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        contributors: [],
      },
    };
    expect(toPost(record).contributors).toBeUndefined();
  });

  test("parses a valid bskyPostRef", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        bskyPostRef: {
          uri: "at://did:plc:abc/app.bsky.feed.post/3xyz123",
          cid: "bafyreiexample",
        },
      },
    };
    expect(toPost(record).bskyPostRef).toEqual({
      uri: "at://did:plc:abc/app.bsky.feed.post/3xyz123",
      cid: "bafyreiexample",
    });
  });

  test("returns undefined for bskyPostRef missing required fields", () => {
    const record: RepoRecord = {
      uri: "at://did:plc:abc/site.standard.document/rk",
      value: {
        title: "T",
        publishedAt: "2026-01-01T00:00:00Z",
        bskyPostRef: { uri: "at://did:plc:abc/app.bsky.feed.post/3xyz" },
      },
    };
    expect(toPost(record).bskyPostRef).toBeUndefined();
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
    markdown: "body",
    uri: "at://did:plc:abc/site.standard.document/rk",
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
    markdown: "",
    uri: `at://did:plc:abc/site.standard.document/${rkey}`,
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
