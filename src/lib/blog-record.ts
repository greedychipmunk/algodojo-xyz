/**
 * Pure helpers for reading `site.standard.document` records (published to our
 * PDS by blog-manager via social-cli) into a `Post` domain model.
 *
 * The record's `textContent` field carries the post's raw markdown, which the
 * reader renders directly — so there is no AT-Proto-specific rendering here and
 * this module stays free of `server-only` and of any `fetch`, making it
 * trivially unit-testable in Node. The network layer lives in `./atproto`;
 * orchestration in `./blog`; markdown rendering in `./markdown`.
 */

export interface Post {
  rkey: string;
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  site?: string;
  /** The post body as raw markdown (the record's `textContent`). */
  markdown: string;
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
    markdown: value.textContent ?? "",
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

/**
 * Drop a leading markdown heading that just repeats the post title, so the body
 * doesn't render a second `<h1>` beneath the page's own title. Leading blank
 * lines before the heading are tolerated; anything else is returned unchanged.
 */
export function stripTitleHeading(markdown: string, title: string): string {
  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  const heading = i < lines.length ? /^#{1,6}\s+(.*)$/.exec(lines[i].trim()) : null;
  if (heading && heading[1].trim().toLowerCase() === title.trim().toLowerCase()) {
    return lines.slice(i + 1).join("\n").replace(/^\n+/, "");
  }
  return markdown;
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
