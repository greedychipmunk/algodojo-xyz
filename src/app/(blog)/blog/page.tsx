import Link from "next/link";
import { Container } from "@/components/ui/container";
import { listPosts } from "@/lib/blog";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Thought leadership and industry insights on AI, ML, and automation from the Algo Dojo team.",
  path: "/blog",
});

// Read-mostly: statically generate and revalidate on an interval so new posts
// published to the PDS appear without a redeploy. Must be a literal for Next's
// static route-segment analysis; keep in sync with BLOG_REVALIDATE (900s).
export const revalidate = 900;

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-text-secondary">
          Insights on AI, ML, and automation — from our team to your inbox.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 text-text-muted">
            No posts yet — check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.rkey}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-bg-card p-6 transition-all hover:border-border-hover hover:shadow-card-hover"
              >
                <h2 className="text-lg font-semibold group-hover:text-accent">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-text-secondary">
                    {post.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
