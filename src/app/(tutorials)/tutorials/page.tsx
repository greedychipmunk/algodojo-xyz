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
        <div className="mt-12">
          <TutorialGrid tutorials={tutorials} />
        </div>
      </Container>
    </section>
  );
}
