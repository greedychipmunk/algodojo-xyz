import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Section } from '@/components/ui/section';
import { getAllTutorials } from '@/lib/tutorials';
import { TutorialCard } from '@/components/tutorials/tutorial-card';
import { TutorialFilters } from '@/components/tutorials/tutorial-filters';

export const metadata: Metadata = {
  title: 'Tutorials',
  description:
    'Free and premium tutorials on AI agents, machine learning, and automation. Learn from beginner to advanced with hands-on code examples.',
};

interface TutorialsPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    tier?: string;
  }>;
}

export default async function TutorialsPage({ searchParams }: TutorialsPageProps) {
  const params = await searchParams;
  const allTutorials = getAllTutorials();

  const filtered = allTutorials.filter((t) => {
    if (params.category && t.category !== params.category) return false;
    if (params.difficulty && t.difficulty !== params.difficulty) return false;
    if (params.tier && t.tier !== params.tier) return false;
    return true;
  });

  return (
    <main>
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Learn</p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Tutorials</h1>
          <p className="mt-4 text-lg text-slate-400">
            Practical guides on AI, machine learning, and automation — from fundamentals to
            production-ready patterns.
          </p>
        </div>
      </Section>

      <Section>
        <div className="mb-8">
          <Suspense fallback={null}>
            <TutorialFilters />
          </Suspense>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tutorial) => (
              <TutorialCard key={tutorial.slug} tutorial={tutorial} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-12 text-center">
            <p className="text-lg text-slate-400">
              No tutorials match your filters. Try adjusting your selection.
            </p>
          </div>
        )}
      </Section>
    </main>
  );
}
