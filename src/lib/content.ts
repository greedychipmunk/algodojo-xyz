import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Tutorial } from "@/lib/types";

const TUTORIALS_DIRECTORY = path.join(process.cwd(), "src/content/tutorials");

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function isTutorialTier(value: unknown): value is Tutorial["tier"] {
  return value === "free" || value === "premium";
}

function isTutorialCategory(value: unknown): value is Tutorial["category"] {
  return value === "ai" || value === "ml" || value === "automation";
}

function isTutorialDifficulty(
  value: unknown,
): value is Tutorial["difficulty"] {
  return (
    value === "beginner" || value === "intermediate" || value === "advanced"
  );
}

function getMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory).filter((fileName) => fileName.endsWith(".mdx"));
}

function readMdxFile(filePath: string) {
  const fileContents = fs.readFileSync(filePath, "utf8");
  return matter(fileContents);
}

function parseTutorial(filePath: string): Tutorial | null {
  const slugFromFileName = path.basename(filePath, ".mdx");
  const { data, content } = readMdxFile(filePath);
  const frontmatter = data as Record<string, unknown>;

  const title = isString(frontmatter.title) ? frontmatter.title : null;
  const slug = isString(frontmatter.slug) ? frontmatter.slug : slugFromFileName;
  const description = isString(frontmatter.description)
    ? frontmatter.description
    : null;
  const tier = isTutorialTier(frontmatter.tier) ? frontmatter.tier : null;
  const category = isTutorialCategory(frontmatter.category)
    ? frontmatter.category
    : null;
  const difficulty = isTutorialDifficulty(frontmatter.difficulty)
    ? frontmatter.difficulty
    : null;
  const estimatedReadTime = parseNumber(frontmatter.estimatedReadTime);
  const publishedAt = isString(frontmatter.publishedAt)
    ? frontmatter.publishedAt
    : null;
  const updatedAt = isString(frontmatter.updatedAt)
    ? frontmatter.updatedAt
    : null;
  const author = isString(frontmatter.author) ? frontmatter.author : null;
  const tags = isStringArray(frontmatter.tags) ? frontmatter.tags : null;

  if (
    !title ||
    !slug ||
    !description ||
    !tier ||
    !category ||
    !difficulty ||
    estimatedReadTime === null ||
    !publishedAt ||
    !updatedAt ||
    !author ||
    !tags
  ) {
    return null;
  }

  return {
    title,
    slug,
    description,
    tier,
    category,
    tags,
    difficulty,
    estimatedReadTime,
    publishedAt,
    updatedAt,
    author,
    content,
  };
}

export function getAllTutorials(): Tutorial[] {
  return getMdxFiles(TUTORIALS_DIRECTORY)
    .map((fileName) => parseTutorial(path.join(TUTORIALS_DIRECTORY, fileName)))
    .filter((tutorial): tutorial is Tutorial => tutorial !== null)
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    );
}

export function getTutorialBySlug(slug: string): Tutorial | null {
  return getAllTutorials().find((tutorial) => tutorial.slug === slug) ?? null;
}
