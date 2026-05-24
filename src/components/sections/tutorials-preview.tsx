import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { Tutorial } from "@/lib/types";

interface TutorialsPreviewProps {
  tutorials: Tutorial[];
}

function getTutorialMeta(tutorial: Tutorial) {
  return [
    tutorial.category.toUpperCase(),
    tutorial.difficulty,
    `${tutorial.estimatedReadTime} min read`,
  ];
}

export function TutorialsPreview({ tutorials }: TutorialsPreviewProps) {
  const featuredTutorials = tutorials.slice(0, 3);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Tutorials
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Featured tutorials to sharpen your skills
              </h2>
              <p className="text-base leading-7 text-text-secondary sm:text-lg">
                Explore practical guides and hands-on walkthroughs covering AI,
                machine learning, and automation.
              </p>
            </div>
          </div>

          {featuredTutorials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {featuredTutorials.map((tutorial) => (
                <article
                  key={tutorial.slug}
                  className="group flex h-full flex-col rounded-xl border border-border bg-bg-card p-6 shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover"
                >
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
                    {getTutorialMeta(tutorial).map((meta) => (
                      <span
                        key={meta}
                        className="rounded-full border border-border bg-bg-secondary px-3 py-1 text-text-secondary"
                      >
                        {meta}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-text-primary">
                    {tutorial.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-text-secondary">
                    {tutorial.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-text-muted">
                      By {tutorial.author}
                    </div>
                    <Link
                      href={`/tutorials/${tutorial.slug}`}
                      className="inline-flex items-center font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                      aria-label={`Read tutorial: ${tutorial.title}`}
                    >
                      Read Tutorial
                      <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-text-secondary shadow-card">
              Tutorials are coming soon.
            </div>
          )}

          <div className="flex justify-center">
            <Link
              href="/tutorials"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-primary shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              View All Tutorials
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
