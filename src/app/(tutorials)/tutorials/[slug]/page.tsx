import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MdxContent } from '@/components/tutorials/mdx-content';
import {
  TableOfContents,
  extractTocItems,
} from '@/components/tutorials/table-of-contents';
import { getTutorialBySlug, getTutorialSlugs } from '@/lib/tutorials';

interface TutorialPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTutorialSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);
  if (!tutorial) return {};

  return {
    title: tutorial.title,
    description: tutorial.description,
    openGraph: {
      title: tutorial.title,
      description: tutorial.description,
      type: 'article',
      publishedTime: tutorial.publishedAt,
      modifiedTime: tutorial.updatedAt,
      authors: [tutorial.author],
      tags: tutorial.tags,
    },
  };
}

const difficultyColor = {
  beginner: 'cyan' as const,
  intermediate: 'teal' as const,
  advanced: 'outline' as const,
};

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  const tocItems = extractTocItems(tutorial.content);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: tutorial.title,
      description: tutorial.description,
      datePublished: tutorial.publishedAt,
      dateModified: tutorial.updatedAt,
      author: {
        '@type': 'Organization',
        name: tutorial.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Algo Dojo, LLC',
        url: 'https://algodojo.xyz',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://algodojo.xyz',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tutorials',
          item: 'https://algodojo.xyz/tutorials',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tutorial.title,
          item: `https://algodojo.xyz/tutorials/${slug}`,
        },
      ],
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tutorials', href: '/tutorials' },
            { label: tutorial.title },
          ]}
        />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant={difficultyColor[tutorial.difficulty]}>{tutorial.difficulty}</Badge>
          <Badge>{tutorial.category.toUpperCase()}</Badge>
          {tutorial.tier === 'premium' && <Badge variant="outline">Premium</Badge>}
        </div>

        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {tutorial.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>By {tutorial.author}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{tutorial.estimatedReadTime} min read</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={tutorial.publishedAt}>
            {new Date(tutorial.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <article className="min-w-0">
            <MdxContent source={tutorial.content} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
