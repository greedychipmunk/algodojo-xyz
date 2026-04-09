import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

const tutorials = [
  {
    title: 'Introduction to Building AI Agents with Python',
    description: 'Learn the fundamentals of creating autonomous AI agents using Python and popular frameworks.',
    slug: 'intro-to-ai-agents-python',
    category: 'ai',
    difficulty: 'beginner',
    readTime: 12,
    tier: 'free',
  },
  {
    title: 'Automating Business Workflows with LangChain',
    description: 'Build practical workflow automation using LangChain agents and tool integrations.',
    slug: 'automating-workflows-langchain',
    category: 'automation',
    difficulty: 'intermediate',
    readTime: 18,
    tier: 'free',
  },
  {
    title: 'Building Custom ML Pipelines for Production',
    description: 'Design robust machine learning pipelines that scale from prototype to production.',
    slug: 'custom-ml-pipelines',
    category: 'ml',
    difficulty: 'advanced',
    readTime: 25,
    tier: 'premium',
  },
];

const difficultyColor = {
  beginner: 'cyan' as const,
  intermediate: 'teal' as const,
  advanced: 'outline' as const,
};

export function FeaturedTutorials() {
  return (
    <Section>
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Learn</p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          Featured Tutorials
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Free and premium tutorials on AI, machine learning, and automation —
          from beginner guides to advanced implementation patterns.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <Link key={tutorial.slug} href={`/tutorials/${tutorial.slug}`} className="group">
            <Card className="flex h-full flex-col group-hover:border-cyan-500/50">
              <div className="mb-4 flex items-center gap-2">
                <Badge variant={difficultyColor[tutorial.difficulty as keyof typeof difficultyColor]}>
                  {tutorial.difficulty}
                </Badge>
                {tutorial.tier === 'premium' && <Badge variant="outline">Premium</Badge>}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {tutorial.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">{tutorial.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span>{tutorial.readTime} min read</span>
                <span className="capitalize">{tutorial.category}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button href="/tutorials" variant="outline">
          Browse All Tutorials
        </Button>
      </div>
    </Section>
  );
}
