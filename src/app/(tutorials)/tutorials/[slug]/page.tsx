import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/tutorials/table-of-contents";
import {
  AuthorByline,
  AuthorBio,
} from "@/components/tutorials/author-byline";
import { MermaidRenderer } from "@/components/tutorials/mermaid-renderer";
import { AUTHOR, SITE_METADATA } from "@/lib/constants";
import { getAllTutorials, getTutorialBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
} from "@/lib/metadata";

interface TutorialDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tutorials = await getAllTutorials();
  return tutorials.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TutorialDetailPageProps) {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);
  if (!tutorial) return {};

  return generatePageMetadata({
    title: tutorial.title,
    description: tutorial.description,
    path: `/tutorials/${tutorial.slug}`,
    ogEyebrow: "Tutorial",
    type: "article",
    publishedTime: tutorial.publishedAt,
    modifiedTime: tutorial.updatedAt,
    author: { name: AUTHOR.name, url: `${SITE_METADATA.siteUrl}${AUTHOR.url}` },
  });
}

export default async function TutorialDetailPage({
  params,
}: TutorialDetailPageProps) {
  const { slug } = await params;
  const tutorial = await getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  const contentHtml = await renderMarkdown(tutorial.content);

  const difficultyVariant =
    tutorial.difficulty === "beginner"
      ? "success"
      : tutorial.difficulty === "intermediate"
        ? "warning"
        : "error";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Tutorials", href: "/tutorials" },
            { name: tutorial.title, href: `/tutorials/${tutorial.slug}` },
          ]),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: articleJsonLd({
            title: tutorial.title,
            description: tutorial.description,
            path: `/tutorials/${tutorial.slug}`,
            publishedAt: tutorial.publishedAt,
            updatedAt: tutorial.updatedAt,
          }),
        }}
      />
      <article className="py-20 sm:py-28">
        <Container>
          <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={difficultyVariant}>{tutorial.difficulty}</Badge>
                <Badge>{tutorial.category}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {tutorial.title}
              </h1>
              <p className="text-text-secondary mt-4 text-lg">
                {tutorial.description}
              </p>
              <AuthorByline
                publishedAt={tutorial.publishedAt}
                estimatedReadTime={tutorial.estimatedReadTime}
              />

              <div className="prose mt-12 max-w-none">
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </div>

              <MermaidRenderer />

              <AuthorBio />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents headings={extractHeadings(contentHtml)} />
              </div>
            </aside>
          </div>
        </Container>
      </article>
    </>
  );
}

function extractHeadings(
  html: string,
): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/g;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
    });
  }

  return headings;
}
