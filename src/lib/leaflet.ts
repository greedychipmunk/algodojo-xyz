/**
 * Pure helpers for reading `site.standard.document` records (published to our
 * PDS by blog-manager) and their embedded `pub.leaflet.content` bodies.
 *
 * This module is intentionally free of `server-only` and of any `fetch` so it
 * stays trivially unit-testable in Node. The network layer lives in
 * `./atproto`; orchestration in `./blog`.
 */

// ---------------------------------------------------------------------------
// Rich text (facets)
// ---------------------------------------------------------------------------

/**
 * A facet feature. The union is *open* on the wire — we type the ones we render
 * and keep an index signature so an unknown feature never breaks the type.
 */
export type FacetFeature =
  | { $type: "pub.leaflet.richtext.facet#bold" }
  | { $type: "pub.leaflet.richtext.facet#italic" }
  | { $type: "pub.leaflet.richtext.facet#underline" }
  | { $type: "pub.leaflet.richtext.facet#strikethrough" }
  | { $type: "pub.leaflet.richtext.facet#code" }
  | { $type: "pub.leaflet.richtext.facet#link"; uri?: string }
  | { $type: string; [key: string]: unknown };

export interface Facet {
  index: { byteStart: number; byteEnd: number };
  features: FacetFeature[];
}

/** A contiguous run of text sharing the same set of features. */
export interface TextSegment {
  text: string;
  features: FacetFeature[];
}

/**
 * Return `uri` only if it uses a safe, navigational scheme, else `undefined`.
 *
 * Link targets come from AT Protocol records (external, publishable data).
 * Rendering an unvalidated `href` would let a `javascript:`, `data:`, or
 * `vbscript:` URI execute on click, so only http(s), mailto, and
 * relative/anchor links are allowed.
 */
export function safeHref(uri: string | undefined): string | undefined {
  if (!uri) return undefined;
  return /^(https?:|mailto:|\/|#)/i.test(uri.trim()) ? uri : undefined;
}

/**
 * Split `text` into styled segments using AT Protocol facets.
 *
 * Facet `index` offsets are UTF-8 **byte** ranges, not JS UTF-16 string
 * offsets. We encode once, slice on byte boundaries, and decode each slice so
 * multi-byte characters (emoji, accents) are never split mid-codepoint.
 *
 * Defensive: facets that are malformed, zero-width, or overlap an already
 * consumed range are skipped rather than throwing.
 */
export function segmentText(text: string, facets: Facet[] = []): TextSegment[] {
  const bytes = new TextEncoder().encode(text);
  const decoder = new TextDecoder();
  const cut = (start: number, end: number) => decoder.decode(bytes.slice(start, end));

  const sorted = [...(facets ?? [])]
    .filter(
      (facet) =>
        facet?.index &&
        Number.isFinite(facet.index.byteStart) &&
        Number.isFinite(facet.index.byteEnd) &&
        facet.index.byteEnd > facet.index.byteStart,
    )
    .sort((a, b) => a.index.byteStart - b.index.byteStart);

  const segments: TextSegment[] = [];
  let pos = 0;

  for (const facet of sorted) {
    const byteStart = Math.max(facet.index.byteStart, pos);
    const byteEnd = Math.min(facet.index.byteEnd, bytes.length);
    if (byteStart >= byteEnd) continue; // fully overlapped or out of range

    if (byteStart > pos) segments.push({ text: cut(pos, byteStart), features: [] });
    segments.push({ text: cut(byteStart, byteEnd), features: facet.features ?? [] });
    pos = byteEnd;
  }

  if (pos < bytes.length) segments.push({ text: cut(pos, bytes.length), features: [] });
  return segments;
}

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

export interface LeafletBlock {
  $type: string;
  level?: number;
  plaintext?: string;
  facets?: Facet[];
  [key: string]: unknown;
}

export interface LeafletPage {
  $type?: string;
  blocks?: Array<{ block?: LeafletBlock }>;
}

export interface LeafletContent {
  $type?: string;
  pages?: LeafletPage[];
}

/** Flatten `content.pages[].blocks[].block` into a single ordered list. */
export function flattenBlocks(content: LeafletContent | undefined): LeafletBlock[] {
  if (!content?.pages) return [];
  return content.pages.flatMap((page) =>
    (page.blocks ?? [])
      .map((entry) => entry?.block)
      .filter((block): block is LeafletBlock => Boolean(block?.$type)),
  );
}

export interface ParsedCodeBlock {
  code: string;
  lang?: string;
}

/**
 * Detect a text block that is really a fenced code block which blog-manager's
 * markdown→leaflet conversion collapsed onto a single line — leaving literal
 * fence backticks in the `plaintext` and a `#code` facet over the interior —
 * and recover it as a proper block-level snippet.
 *
 * Leaflet represents *inline* code with a `#code` facet and no literal
 * backticks, so a block whose trimmed text is wrapped in a backtick fence is
 * the unambiguous signal of a mangled fenced block (not ordinary prose). We
 * strip the fence and optional language tag, and pretty-print the payload when
 * it is valid JSON so one-liners become readable. Returns `null` for anything
 * that isn't a fenced code block (inline code stays inline).
 */
export function parseCodeBlock(block: LeafletBlock): ParsedCodeBlock | null {
  if (block.$type !== "pub.leaflet.blocks.text") return null;

  const hasCodeFacet = (block.facets ?? []).some((facet) =>
    (facet.features ?? []).some(
      (feature) => feature.$type === "pub.leaflet.richtext.facet#code",
    ),
  );
  if (!hasCodeFacet) return null;

  const text = (block.plaintext ?? "").trim();
  const fence = /^`{2,}([a-zA-Z0-9+#._-]*)[ \t]*\n?([\s\S]*?)\n?[ \t]*`{2,}$/.exec(text);
  if (!fence) return null;

  const lang = fence[1] ? fence[1].toLowerCase() : undefined;
  let code = fence[2].trim();

  if (!lang || lang === "json") {
    try {
      code = JSON.stringify(JSON.parse(code), null, 2);
      return { code, lang: "json" };
    } catch {
      // Not valid JSON — render the recovered text as-is.
    }
  }

  return { code, lang };
}

// ---------------------------------------------------------------------------
// Post domain model
// ---------------------------------------------------------------------------

export interface Post {
  rkey: string;
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  site?: string;
  content?: LeafletContent;
  textContent?: string;
}

export interface RepoRecord {
  uri: string;
  cid?: string;
  value: Record<string, unknown> & {
    title?: string;
    description?: string;
    site?: string;
    path?: string;
    tags?: string[];
    publishedAt?: string;
    updatedAt?: string;
    content?: LeafletContent;
    textContent?: string;
  };
}

/** Extract the rkey (last path segment) from an at:// URI. */
export const rkeyOf = (uri: string): string => uri.split("/").pop() ?? uri;

/**
 * Canonical slug for a post: the `path` field without its leading slash, else
 * the rkey. rkeys are mixed today (older posts are slug-keyed, newer ones are
 * TIDs), so `path` gives a stable human-readable slug across both.
 */
export const slugOf = (value: RepoRecord["value"], rkey: string): string =>
  (value.path ?? "").replace(/^\//, "") || rkey;

/** Map a raw `com.atproto.repo` record into our `Post` domain model. */
export function toPost(record: RepoRecord): Post {
  const value = record.value ?? {};
  const rkey = rkeyOf(record.uri);
  return {
    rkey,
    slug: slugOf(value, rkey),
    title: value.title ?? "",
    description: value.description,
    tags: Array.isArray(value.tags) ? value.tags : [],
    publishedAt: value.publishedAt ?? "",
    updatedAt: value.updatedAt,
    site: value.site,
    content: value.content,
    textContent: value.textContent,
  };
}

/**
 * Should a post be shown? Requires the fields we need to render and, when a
 * `publicationUri` is configured, restricts to posts belonging to that
 * publication — which excludes stray debugging test-copies published to other
 * `site` values.
 */
export function isPublishable(post: Post, publicationUri?: string): boolean {
  if (!post.title || !post.publishedAt) return false;
  if (publicationUri && post.site !== publicationUri) return false;
  return true;
}

/** Sort newest first by `publishedAt`, tie-broken by rkey (TIDs sort by time). */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.rkey.localeCompare(a.rkey),
  );
}

/** Keep the first post per slug. Assumes input is already newest-first. */
export function dedupeBySlug(posts: Post[]): Post[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}
