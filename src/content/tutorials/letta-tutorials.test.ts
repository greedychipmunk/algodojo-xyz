// src/content/tutorials/letta-tutorials.test.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, test } from "vitest";

const DIR = path.join(process.cwd(), "src/content/tutorials");

// The nineteen Letta tutorials in intended learning-path order (ascending publishedAt).
const EXPECTED = [
  { slug: "letta-build-your-first-agent", difficulty: "beginner", publishedAt: "2026-06-15" },
  { slug: "letta-memory-blocks", difficulty: "intermediate", publishedAt: "2026-06-16" },
  { slug: "letta-agent-tools", difficulty: "intermediate", publishedAt: "2026-06-17" },
  { slug: "letta-telegram-bot", difficulty: "beginner", publishedAt: "2026-06-18" },
  { slug: "letta-local-instance", difficulty: "advanced", publishedAt: "2026-06-19" },
  { slug: "letta-secure-cloud-server", difficulty: "advanced", publishedAt: "2026-06-25" },
  { slug: "letta-leaflet-blog-manager", difficulty: "advanced", publishedAt: "2026-06-26" },
  { slug: "letta-bluesky-mention-responder", difficulty: "advanced", publishedAt: "2026-06-27" },
  { slug: "letta-atproto-firehose-trends", difficulty: "advanced", publishedAt: "2026-06-28" },
  { slug: "letta-bluesky-cross-publisher", difficulty: "advanced", publishedAt: "2026-06-29" },
  { slug: "letta-homelab-security-agent", difficulty: "advanced", publishedAt: "2026-06-30" },
  { slug: "letta-backup-memory-github", difficulty: "intermediate", publishedAt: "2026-07-02" },
  { slug: "letta-durable-code-review", difficulty: "advanced", publishedAt: "2026-07-03" },
  { slug: "letta-durable-bluesky-digest", difficulty: "advanced", publishedAt: "2026-07-04" },
  { slug: "letta-durable-blog-publisher", difficulty: "advanced", publishedAt: "2026-07-05" },
  { slug: "letta-skill-learning", difficulty: "intermediate", publishedAt: "2026-07-22" },
  { slug: "letta-mods", difficulty: "intermediate", publishedAt: "2026-07-22" },
  { slug: "letta-companion-bot", difficulty: "intermediate", publishedAt: "2026-08-17" },
  { slug: "letta-orchestrate-codex", difficulty: "advanced", publishedAt: "2026-08-21" },
];

const REQUIRED_FIELDS = [
  "title", "slug", "description", "tier", "category",
  "tags", "difficulty", "estimatedReadTime", "publishedAt", "updatedAt", "author",
];

function read(slug: string) {
  return matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8")).data as Record<string, unknown>;
}

describe("Letta tutorials", () => {
  test("has exactly the nineteen expected files", () => {
    const lettaFiles = fs
      .readdirSync(DIR)
      .filter((f) => f.startsWith("letta-") && f.endsWith(".mdx"))
      .sort();
    expect(lettaFiles).toHaveLength(EXPECTED.length);
    expect(lettaFiles).toEqual(EXPECTED.map((e) => `${e.slug}.mdx`).sort());
  });

  test.each(EXPECTED)("$slug has complete, valid frontmatter", (entry) => {
    const fm = read(entry.slug);
    for (const field of REQUIRED_FIELDS) {
      expect(fm[field], `missing ${field}`).toBeDefined();
    }
    const tags = fm.tags as string[];
    expect(fm.slug).toBe(entry.slug);
    expect(fm.tier).toBe("free");
    expect(fm.category).toBe("ai");
    expect(fm.author).toBe("Algo Dojo");
    expect(fm.difficulty).toBe(entry.difficulty);
    expect(fm.publishedAt).toBe(entry.publishedAt);
    // updatedAt must be >= publishedAt (same day for new tutorials, later for revised ones)
    expect(fm.updatedAt >= entry.publishedAt).toBe(true);
    expect(Array.isArray(tags)).toBe(true);
    expect(tags).toContain("letta");
    expect(typeof fm.estimatedReadTime).toBe("number");
  });

  test("orders by ascending publishedAt matching the learning path", () => {
    const dates = EXPECTED.map((e) => read(e.slug).publishedAt as string);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });
});
