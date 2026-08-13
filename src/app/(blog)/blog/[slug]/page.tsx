import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getPostBySlug, listPosts } from "@/lib/blog";
import { stripTitleHeading } from "@/lib/blog-record";
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdown(
    stripTitleHeading(post.markdown, post.title),
  );

  return (
    <>
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
          }),
        }}
      />
      <article className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span>By {AUTHOR.name}</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <div className="prose mt-12 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
