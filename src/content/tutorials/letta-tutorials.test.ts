// src/content/tutorials/letta-tutorials.test.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

const DIR = path.join(process.cwd(), "src/content/tutorials");

// The five Letta tutorials in intended learning-path order (ascending publishedAt).
const EXPECTED = [
  { slug: "letta-build-your-first-agent", difficulty: "beginner", publishedAt: "2026-06-15" },
  { slug: "letta-memory-blocks", difficulty: "intermediate", publishedAt: "2026-06-16" },
  { slug: "letta-agent-tools", difficulty: "intermediate", publishedAt: "2026-06-17" },
  { slug: "letta-telegram-bot", difficulty: "intermediate", publishedAt: "2026-06-18" },
  { slug: "letta-local-instance", difficulty: "advanced", publishedAt: "2026-06-19" },
];

const REQUIRED_FIELDS = [
  "title", "slug", "description", "tier", "category",
  "tags", "difficulty", "estimatedReadTime", "publishedAt", "updatedAt", "author",
];

function read(slug: string) {
  return matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8")).data as Record<string, unknown>;
}

describe("Letta tutorials", () => {
  it("has exactly the five expected files", () => {
    const lettaFiles = fs
      .readdirSync(DIR)
      .filter((f) => f.startsWith("letta-") && f.endsWith(".mdx"))
      .sort();
    expect(lettaFiles).toEqual(EXPECTED.map((e) => `${e.slug}.mdx`).sort());
  });

  it.each(EXPECTED)("$slug has complete, valid frontmatter", (entry) => {
    const fm = read(entry.slug);
    for (const field of REQUIRED_FIELDS) {
      expect(fm[field], `missing ${field}`).toBeDefined();
    }
    expect(fm.slug).toBe(entry.slug);
    expect(fm.tier).toBe("free");
    expect(fm.category).toBe("ai");
    expect(fm.author).toBe("Algo Dojo");
    expect(fm.difficulty).toBe(entry.difficulty);
    expect(fm.publishedAt).toBe(entry.publishedAt);
    expect(fm.updatedAt).toBe(entry.publishedAt);
    expect(Array.isArray(fm.tags)).toBe(true);
    expect((fm.tags as string[])).toContain("letta");
    expect(typeof fm.estimatedReadTime).toBe("number");
  });

  it("orders by ascending publishedAt matching the learning path", () => {
    const dates = EXPECTED.map((e) => read(e.slug).publishedAt as string);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });
});
