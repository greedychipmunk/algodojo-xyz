import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on AI, machine learning, and automation from the Algo Dojo team. Industry trends, best practices, and practical guidance.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main>
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Insights</p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Blog</h1>
          <p className="mt-4 text-lg text-slate-400">
            Thoughts on AI, machine learning, automation, and the future of business technology.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="flex h-full flex-col group-hover:border-cyan-500/50">
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-slate-400">{post.description}</p>
                <div className="mt-4 text-xs text-slate-500">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
