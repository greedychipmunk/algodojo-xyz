import "server-only";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { rehypeMermaid } from "./rehype-mermaid";
import { rehypeSafeLinks } from "./rehype-safe-links";

/**
 * Compile a markdown string into an HTML string.
 *
 * Runs at build time (inside server components during static generation), so
 * the result is fully static HTML with no client-side JavaScript:
 *   - `remark-gfm`     — GitHub-flavored markdown (tables, strikethrough, etc.)
 *   - `rehype-slug`    — adds `id` attributes to headings, which powers the
 *                        table-of-contents extraction and anchor links
 *   - `@shikijs/rehype`— syntax highlighting with inline styles baked in
 *
 * Content is authored by us (trusted), so raw HTML passthrough is intentionally
 * disabled — `remark-rehype` drops embedded HTML by default.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeSafeLinks)
    .use(rehypeMermaid as never)
    .use(rehypeShiki, { theme: "github-dark" })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
