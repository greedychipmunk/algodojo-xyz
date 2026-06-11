import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta-section";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "About",
  description:
    "Learn about Algo Dojo — our mission, values, and the team behind the AI/ML consulting and education platform.",
  path: "/about",
});

const VALUES = [
  {
    title: "Practical Over Theoretical",
    description:
      "We focus on solutions that ship. Every recommendation we make is grounded in real-world feasibility and measurable outcomes.",
  },
  {
    title: "Transparency First",
    description:
      "No black boxes. We explain our reasoning, share our methods, and make sure you understand what's happening under the hood.",
  },
  {
    title: "Continuous Learning",
    description:
      "AI moves fast. We stay on the cutting edge so you don't have to — and we teach what we learn along the way.",
  },
  {
    title: "Outcome-Driven",
    description:
      "Technology is a means, not an end. We measure success by the impact on your business, not by the sophistication of the model.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ]),
        }}
      />
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            title="About Algo Dojo"
            subtitle="AI/ML consulting and education — built on the belief that intelligent automation should be accessible to every business."
            centered
          />

          <div className="mt-16 max-w-3xl mx-auto space-y-6 text-text-secondary">
            <p>
              Algo Dojo was founded on a simple observation: most businesses
              have workflows that are ripe for AI-driven optimization, but
              lack the expertise to identify and implement the right
              solutions.
            </p>
            <p>
              We bridge that gap. Our team examines your existing processes,
              identifies where agentic AI and ML can deliver measurable
              improvements, and builds the automation systems that make it
              happen.
            </p>
            <p>
              Alongside consulting, we provide free and premium tutorials on
              AI, ML, and automation — serving as both a lead generation
              channel and a standalone educational platform for developers
              and technical leaders who want to build these capabilities
              themselves.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-bg-secondary">
        <Container>
          <SectionHeading title="Our Values" centered />
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-border bg-bg-card p-8"
              >
                <h3 className="text-xl font-semibold text-text-primary">
                  {value.title}
                </h3>
                <p className="mt-3 text-text-secondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Want to Work With Us?"
        description="We're always looking for interesting problems to solve."
        buttonText="Get in Touch"
        buttonHref="/contact"
      />
    </>
  );
}
