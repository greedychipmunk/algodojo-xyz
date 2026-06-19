import Link from "next/link";
import { TUTORIAL_CATEGORIES, TUTORIAL_DIFFICULTIES } from "@/lib/constants";
import type { Tutorial } from "@/lib/types";

interface TutorialCardProps {
  tutorial: Tutorial;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function getLabel(value: Tutorial["category"] | Tutorial["difficulty"]) {
  const labels = [...TUTORIAL_CATEGORIES, ...TUTORIAL_DIFFICULTIES];
  return labels.find((item) => item.value === value)?.label ?? value;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const description = truncateText(tutorial.description, 140);
  const categoryLabel = getLabel(tutorial.category);
  const difficultyLabel = getLabel(tutorial.difficulty);

  return (
    <Link
      aria-label={`Read tutorial: ${tutorial.title}`}
      className="group block h-full focus-visible:outline-none"
      href={`/tutorials/${tutorial.slug}`}
    >
      <article className="flex h-full flex-col rounded-xl border border-border bg-bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
            {categoryLabel}
          </span>
          <span className="rounded-full border border-border bg-bg-secondary px-3 py-1 text-text-secondary">
            {difficultyLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
              {tutorial.title}
            </h3>
            <p className="text-sm leading-6 text-text-secondary">{description}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4 text-sm text-text-muted">
            <span>{tutorial.estimatedReadTime} min read</span>
            <span className="text-text-secondary">By {tutorial.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
