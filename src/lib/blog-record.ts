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

/** Parsed `coverImage` blob from the record. */
export interface CoverImage {
  cid: string;
  mimeType: string;
  size: number;
}

/** A contributor to a document (`site.standard.document#contributor`). */
export interface Contributor {
  did: string;
  role?: string;
  displayName?: string;
}

/** Strong reference to a Bluesky post (`app.bsky.feed.post`). */
export interface BskyPostRef {
  uri: string;
  cid: string;
}

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
  coverImage?: CoverImage;
  /** Resolved URL for the cover image blob; set by the blog layer after PDS resolution. */
  coverImageUrl?: string;
  contributors?: Contributor[];
  bskyPostRef?: BskyPostRef;
  /** The full AT-URI of the record (`at://{DID}/site.standard.document/{rkey}`). */
  uri: string;
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
    coverImage?: {
      $type?: string;
      ref?: { $link?: string };
      mimeType?: string;
      size?: number;
    };
    contributors?: Array<{
      did?: string;
      role?: string;
      displayName?: string;
    }>;
    bskyPostRef?: {
      uri?: string;
      cid?: string;
    };
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

/** Parse a `coverImage` blob from the record, or `undefined` if invalid. */
function parseCoverImage(
  blob: RepoRecord["value"]["coverImage"],
): CoverImage | undefined {
  if (!blob?.ref?.$link || !blob.mimeType || typeof blob.size !== "number") {
    return undefined;
  }
  return { cid: blob.ref.$link, mimeType: blob.mimeType, size: blob.size };
}

/** Parse the `contributors` array, filtering entries missing a `did`. */
function parseContributors(
  raw: RepoRecord["value"]["contributors"],
): Contributor[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const parsed = raw
    .filter((c): c is { did: string; role?: string; displayName?: string } =>
      typeof c?.did === "string",
    )
    .map((c) => ({
      did: c.did,
      ...(c.role && { role: c.role }),
      ...(c.displayName && { displayName: c.displayName }),
    }));
  return parsed.length > 0 ? parsed : undefined;
}

/** Parse a `bskyPostRef`, or `undefined` if missing required fields. */
function parseBskyPostRef(
  ref: RepoRecord["value"]["bskyPostRef"],
): BskyPostRef | undefined {
  if (!ref?.uri || !ref.cid) return undefined;
  return { uri: ref.uri, cid: ref.cid };
}

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
    coverImage: parseCoverImage(value.coverImage),
    contributors: parseContributors(value.contributors),
    bskyPostRef: parseBskyPostRef(value.bskyPostRef),
    uri: record.uri,
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
