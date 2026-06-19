import Link from "next/link";
import { Container } from "@/components/ui/container";
import { TutorialGrid } from "@/components/tutorials/tutorial-grid";
import { getAllTutorials } from "@/lib/content";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Tutorials",
  description:
    "Free and premium tutorials on AI, ML, and automation. Learn to build intelligent systems from scratch.",
  path: "/tutorials",
});

export default async function TutorialsPage() {
  const tutorials = await getAllTutorials();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <h1 className="text-3xl font-bold sm:text-4xl">Tutorials</h1>
        <p className="mt-4 max-w-2xl text-text-secondary">
          Hands-on guides for building with AI, ML, and automation. From
          beginner concepts to advanced implementations.
        </p>

        <Link
          href="/tutorials/frameworks"
          className="group mt-8 flex flex-col gap-1 rounded-xl border border-border bg-bg-card p-5 shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              New · Guide
            </span>
            <span className="mt-1 block text-lg font-semibold text-text-primary">
              Which AI agent framework should you use?
            </span>
            <span className="mt-1 block text-sm text-text-secondary">
              Compare CrewAI, AutoGen, LangGraph, and Pydantic AI — and find
              your starting point.
            </span>
          </span>
          <span className="shrink-0 font-semibold text-accent">
            Read the guide
            <span
              aria-hidden="true"
              className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>

        <div className="mt-12">
          <TutorialGrid tutorials={tutorials} />
        </div>
      </Container>
    </section>
  );
}
