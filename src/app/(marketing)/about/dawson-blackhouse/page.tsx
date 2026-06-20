import Image from "next/image";
import { Container } from "@/components/ui/container";
import { CtaSection } from "@/components/sections/cta-section";
import { AUTHOR } from "@/lib/constants";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  authorProfileJsonLd,
} from "@/lib/metadata";

const EXPERTISE = [
  "Agentic AI systems",
  "Large language model applications",
  "Machine learning integration",
  "Business workflow automation",
  "AI tooling & orchestration",
  "Technical education & writing",
];

const FOCUS_AREAS = [
  {
    title: "Agentic AI Development",
    description:
      "Designing and shipping autonomous agents that execute multi-step work, call tools, and stay reliable in production — across frameworks like LangGraph, CrewAI, AutoGen, Pydantic AI, and Letta.",
  },
  {
    title: "ML Integration",
    description:
      "Bringing machine learning models into real products — from selecting and training the right model to deploying it inside existing systems with monitoring and retraining.",
  },
  {
    title: "Workflow Automation",
    description:
      "Mapping business processes end-to-end and replacing the repetitive, error-prone parts with intelligent automation that delivers measurable ROI.",
  },
  {
    title: "Education & Enablement",
    description:
      "Writing the free and premium Algo Dojo tutorials that teach developers and technical leaders how to build these capabilities themselves.",
  },
];

export const metadata = generatePageMetadata({
  title: `${AUTHOR.name} — ${AUTHOR.role}`,
  description: AUTHOR.bio,
  path: AUTHOR.url,
  ogEyebrow: AUTHOR.role,
  author: { name: AUTHOR.name },
});

export default function AuthorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: AUTHOR.name, href: AUTHOR.url },
          ]),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: authorProfileJsonLd(EXPERTISE),
        }}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
            <Image
              src={AUTHOR.image}
              alt={`${AUTHOR.name}, ${AUTHOR.role}`}
              width={144}
              height={144}
              priority
              className="h-36 w-36 shrink-0 rounded-full object-cover ring-2 ring-border"
            />
            <div>
              <p className="text-sm font-medium tracking-wide text-accent uppercase">
                {AUTHOR.role}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {AUTHOR.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">
                {AUTHOR.bio}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-6 text-text-secondary">
            <p>
              Dawson works at the intersection of applied AI and real business
              outcomes. Rather than chasing the latest model for its own sake,
              he focuses on the unglamorous parts that decide whether an AI
              project actually ships: scoping the right problem, wiring agents
              into existing tools, and building the guardrails that make
              automation trustworthy.
            </p>
            <p>
              At Algo Dojo, that work spans two tracks — consulting engagements
              that examine a company&apos;s workflows and automate the highest-leverage
              ones, and a growing library of hands-on tutorials that teach
              developers how to build agentic and ML-powered systems themselves.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <h2 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
              Areas of expertise
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {EXPERTISE.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-bg-secondary px-3 py-1 text-sm text-text-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-bg-secondary py-20">
        <Container>
          <h2 className="text-center text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What Dawson Works On
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.title}
                className="rounded-xl border border-border bg-bg-card p-8"
              >
                <h3 className="text-xl font-semibold text-text-primary">
                  {area.title}
                </h3>
                <p className="mt-3 text-text-secondary">{area.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Have a workflow worth automating?"
        description="Tell Dawson about the problem you're trying to solve — and where AI might fit."
        buttonText="Get in Touch"
        buttonHref="/contact"
      />
    </>
  );
}
