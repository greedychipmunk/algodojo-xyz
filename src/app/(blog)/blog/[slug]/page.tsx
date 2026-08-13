import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getPostBySlug, listPosts } from "@/lib/blog";
import { stripTitleHeading, type Contributor } from "@/lib/blog-record";
import { AUTHOR } from "@/lib/constants";
import { renderMarkdown } from "@/lib/markdown";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  generatePageMetadata,
} from "@/lib/metadata";

// Literal required for Next's static route-segment analysis; keep in sync with
// BLOG_REVALIDATE (900s).
export const revalidate = 900;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return generatePageMetadata({
    title: post.title,
    description: post.description ?? "",
    path: `/blog/${post.slug}`,
    ogEyebrow: "Blog",
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    author: { name: AUTHOR.name, url: AUTHOR.url },
  });
}

/**
 * Convert an AT-URI for a Bluesky post into a web URL.
 * `at://did:plc:abc/app.bsky.feed.post/rkey` → `https://bsky.app/profile/did:plc:abc/post/rkey`
 */
function bskyWebUrl(uri: string): string | null {
  const match = /^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/(.+)$/.exec(uri);
  if (!match) return null;
  return `https://bsky.app/profile/${match[1]}/post/${match[2]}`;
}

function ContributorList({ contributors }: { contributors: Contributor[] }) {
  return (
    <span>
      {" · with "}
      {contributors.map((c, i) => (
        <span key={c.did}>
          {c.displayName ?? c.did}
          {c.role ? ` (${c.role})` : ""}
          {i < contributors.length - 1 ? ", " : ""}
        </span>
      ))}
    </span>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdown(
    stripTitleHeading(post.markdown, post.title),
  );

  const bskyUrl = post.bskyPostRef ? bskyWebUrl(post.bskyPostRef.uri) : null;
  const showUpdated =
    post.updatedAt && post.updatedAt !== post.publishedAt;

  return (
    <>
      {/* Verification: link this page to its site.standard.document record */}
      <link rel="site.standard.document" href={post.uri} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: articleJsonLd({
            title: post.title,
            description: post.description ?? "",
            path: `/blog/${post.slug}`,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt ?? post.publishedAt,
            ...(post.coverImageUrl && { image: post.coverImageUrl }),
          }),
        }}
      />
      <article className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            {post.coverImageUrl && (
              <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg text-text-secondary">
                {post.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span>By {AUTHOR.name}</span>
              {post.contributors && post.contributors.length > 0 && (
                <ContributorList contributors={post.contributors} />
              )}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {showUpdated && (
                <time dateTime={post.updatedAt}>
                  (Updated{" "}
                  {new Date(post.updatedAt!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  )
                </time>
              )}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose mt-12 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>

            {bskyUrl && (
              <div className="mt-12 border-t border-border pt-6">
                <Link
                  href={bskyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  Discuss on Bluesky &rarr;
                </Link>
              </div>
            )}
          </div>
        </Container>
      </article>
    </>
  );
}
