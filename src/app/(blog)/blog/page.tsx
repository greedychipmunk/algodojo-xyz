import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllBlogPosts } from "@/lib/content";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Blog",
  description:
    "Thought leadership and industry insights on AI, ML, and automation from the Algo Dojo team.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-text-secondary">
          Insights on AI, ML, and automation — from our team to your inbox.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-bg-card p-6 transition-all hover:border-border-hover hover:shadow-card-hover"
            >
              <h2 className="text-lg font-semibold group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                {post.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
                <span>{post.author}</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
