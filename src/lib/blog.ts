import "server-only";

import { blobUrl, getRecord, listRecords, resolvePds } from "./atproto";
import {
  dedupeBySlug,
  isPublishable,
  rkeyOf,
  slugOf,
  sortPosts,
  toPost,
  type Post,
} from "./blog-record";

/**
 * Domain layer for the blog: fetches `site.standard.document` records and maps
 * them into sorted, filtered, de-duplicated `Post`s ready to render.
 */

/**
 * The publication whose posts we surface. Defaults to the algodojo.xyz
 * `site.standard.publication`; posts published under any other `site` (e.g.
 * stray debugging test-copies) are filtered out. Override via env.
 */
const PUBLICATION_URI =
  process.env.BLOG_PUBLICATION_URI ??
  "at://did:plc:bvjokteh6hd2e3blqavus3qj/site.standard.publication/3mprecrhiyg25";

/** Attach resolved cover-image URLs to posts that have a cover image blob. */
function withCoverImageUrls(posts: Post[], pds: string): Post[] {
  return posts.map((post) =>
    post.coverImage
      ? { ...post, coverImageUrl: blobUrl(pds, post.coverImage.cid) }
      : post,
  );
}

/** All publishable posts, newest first, de-duplicated by slug. */
export async function listPosts(): Promise<Post[]> {
  const [records, pds] = await Promise.all([listRecords(), resolvePds()]);
  const posts = records
    .map(toPost)
    .filter((post) => isPublishable(post, PUBLICATION_URI));
  return withCoverImageUrls(dedupeBySlug(sortPosts(posts)), pds);
}

/**
 * Look up one post by its canonical slug. Slugs usually equal the rkey, so we
 * try a direct `getRecord` first, then fall back to a list scan for the case
 * where the slug came from a post's `path` rather than its rkey.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const direct = await getRecord(slug);
  if (direct) {
    const post = toPost(direct);
    if (
      isPublishable(post, PUBLICATION_URI) &&
      slugOf(direct.value, rkeyOf(direct.uri)) === slug
    ) {
      if (post.coverImage) {
        const pds = await resolvePds();
        return { ...post, coverImageUrl: blobUrl(pds, post.coverImage.cid) };
      }
      return post;
    }
  }
  return (await listPosts()).find((post) => post.slug === slug) ?? null;
}
