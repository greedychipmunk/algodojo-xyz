import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogEyebrow: "Blog",
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdown(post.content);

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
      <article className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="text-text-secondary mt-4 text-lg">
              {post.description}
            </p>
            <div className="text-text-muted mt-4 flex items-center gap-4 text-sm">
              <span>By {post.author}</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
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
