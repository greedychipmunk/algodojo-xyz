import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tutorial } from '@/lib/types';

const difficultyColor = {
  beginner: 'cyan' as const,
  intermediate: 'teal' as const,
  advanced: 'outline' as const,
};

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Link href={`/tutorials/${tutorial.slug}`} className="group">
      <Card className="flex h-full flex-col group-hover:border-cyan-500/50">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant={difficultyColor[tutorial.difficulty]}>{tutorial.difficulty}</Badge>
          <Badge>{tutorial.category.toUpperCase()}</Badge>
          {tutorial.tier === 'premium' && <Badge variant="outline">Premium</Badge>}
        </div>
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
          {tutorial.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-slate-400">{tutorial.description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span>{tutorial.estimatedReadTime} min read</span>
          <span>{new Date(tutorial.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </Card>
    </Link>
  );
}
