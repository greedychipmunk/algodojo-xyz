import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getAllTutorials } from "@/lib/content";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import type { Tutorial } from "@/lib/types";

export const metadata = generatePageMetadata({
  title: "Choosing an AI Agent Framework",
  description:
    "CrewAI vs. AutoGen vs. LangGraph vs. Pydantic AI vs. Letta — how five leading agent frameworks differ, when to reach for each, and the hands-on tutorials to get started with all of them.",
  path: "/tutorials/frameworks",
  ogEyebrow: "Guide",
});

type Framework = {
  key: string;
  name: string;
  slugPrefix: string;
  tagline: string;
  mentalModel: string;
  bestFor: string;
  control: string;
  multiAgent: string;
  stateMemory: string;
  learningCurve: string;
  watchOut: string;
  /** Short "reach for it when…" prompt for the decision guide. */
  chooseWhen: string;
};

const FRAMEWORKS: Framework[] = [
  {
    key: "crewai",
    name: "CrewAI",
    slugPrefix: "crewai-",
    tagline: "Role-based agents that collaborate as a crew.",
    mentalModel: "Agents + Tasks + Process",
    bestFor: "A crew of role-specialized agents running a mostly linear process.",
    control: "Convenience-first — sensible defaults, little wiring.",
    multiAgent: "Role-based; sequential or hierarchical.",
    stateMemory: "Automatic task-to-task context; optional memory.",
    learningCurve: "Gentle — productive in minutes.",
    watchOut: "Less explicit control over branching and custom state.",
    chooseWhen: "You want the quickest path to a working multi-agent system.",
  },
  {
    key: "autogen",
    name: "AutoGen",
    slugPrefix: "autogen-",
    tagline: "Conversational agents that message one another.",
    mentalModel: "Agents + Teams (group chat)",
    bestFor: "Chat-style collaboration and reflection loops between agents.",
    control: "Balanced — orchestration is conversation-driven.",
    multiAgent: "Message-passing; round-robin or model-selected speaker.",
    stateMemory: "Stateful agents; shared conversation per team.",
    learningCurve: "Moderate — async-first API.",
    watchOut: "The 0.4 rewrite changed everything; ignore old pyautogen guides.",
    chooseWhen: "Your agents need to converse, critique, and iterate together.",
  },
  {
    key: "langgraph",
    name: "LangGraph",
    slugPrefix: "langgraph-",
    tagline: "Agents modeled as explicit state-machine graphs.",
    mentalModel: "State + Nodes + Edges",
    bestFor: "Custom control flow, durable state, and human-in-the-loop.",
    control: "Control-first — you wire the graph yourself.",
    multiAgent: "Compose nodes and subgraphs however you like.",
    stateMemory: "First-class: checkpointers, threads, persistence.",
    learningCurve: "Steeper — the lowest-level of the four.",
    watchOut: "More boilerplate than you need for simple agents.",
    chooseWhen: "You need fine-grained control, durability, or approval steps.",
  },
  {
    key: "pydantic-ai",
    name: "Pydantic AI",
    slugPrefix: "pydantic-ai-",
    tagline: "Type-safe agents with validated, structured output.",
    mentalModel: "Agent + typed output (Pydantic)",
    bestFor: "Agents whose output feeds real code — extraction, structured decisions.",
    control: "Convenience with strong typing — a FastAPI-like feel.",
    multiAgent: "Single-agent focus; compose agents in plain Python.",
    stateMemory: "Message history; type-safe dependency injection for context.",
    learningCurve: "Gentle if you already know Pydantic.",
    watchOut: "Less built-in multi-agent orchestration than CrewAI or AutoGen.",
    chooseWhen: "Your agent's output must be a validated, typed object.",
  },
  {
    key: "letta",
    name: "Letta",
    slugPrefix: "letta-",
    tagline: "Stateful agents with long-term memory, run as a server.",
    mentalModel: "Stateful agents + memory blocks",
    bestFor: "Agents that must remember users across sessions and run as a service.",
    control: "Convenience-first SDK over a managed server.",
    multiAgent: "Shared memory blocks across agents.",
    stateMemory: "First-class: server-persisted core + archival memory.",
    learningCurve: "Gentle SDK — though you do run a Letta server.",
    watchOut: "It's a server + SDK, not an in-process library — you run a Letta server.",
    chooseWhen: "Your agent must remember users across sessions.",
  },
];

const COMPARISON_ROWS: { label: string; key: keyof Framework }[] = [
  { label: "Mental model", key: "mentalModel" },
  { label: "Best for", key: "bestFor" },
  { label: "Control vs. convenience", key: "control" },
  { label: "Multi-agent style", key: "multiAgent" },
  { label: "State & memory", key: "stateMemory" },
  { label: "Learning curve", key: "learningCurve" },
];

function difficultyVariant(
  difficulty: Tutorial["difficulty"],
): "success" | "warning" | "error" {
  if (difficulty === "beginner") return "success";
  if (difficulty === "intermediate") return "warning";
  return "error";
}

export default async function FrameworksPage() {
  const all = await getAllTutorials();

  // Group each framework's tutorials and order them as a learning path (oldest first).
  const tutorialsFor = (prefix: string) =>
    all
      .filter((t) => t.slug.startsWith(prefix))
      .sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
      );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Tutorials", href: "/tutorials" },
            { name: "Choosing a Framework", href: "/tutorials/frameworks" },
          ]),
        }}
      />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60rem 30rem at 80% -10%, rgba(245,158,11,0.12), transparent 60%)",
          }}
        />
        <Container className="relative py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Guide
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Choosing an AI Agent Framework
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            CrewAI, AutoGen, LangGraph, Pydantic AI, and Letta all build
            agentic systems — but they sit at different levels of abstraction.
            Here&apos;s how they compare, when to reach for each, and where to
            start with hands-on tutorials.
          </p>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            At a glance
          </h2>
          {/* Scroll hint — shown only where the 920px table overflows (below lg). */}
          <p className="mt-2 flex items-center gap-2 text-sm text-text-muted lg:hidden">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3"
              />
            </svg>
            Swipe to compare all five frameworks
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-bg-card shadow-card lg:mt-8">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-44 p-5" />
                  {FRAMEWORKS.map((f) => (
                    <th key={f.key} className="p-5 align-bottom">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-accent"
                        />
                        <span className="text-lg font-bold text-text-primary">
                          {f.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-normal leading-6 text-text-secondary">
                        {f.tagline}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={i % 2 === 1 ? "bg-bg-secondary/40" : undefined}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap p-5 align-top text-sm font-semibold text-text-primary"
                    >
                      {row.label}
                    </th>
                    {FRAMEWORKS.map((f) => (
                      <td
                        key={f.key}
                        className="p-5 align-top text-sm leading-6 text-text-secondary"
                      >
                        {f[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Framework cards with tutorials */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Start building
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
            Each framework has a hands-on learning path, from your first agent
            to production patterns.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FRAMEWORKS.map((f) => {
              const tutorials = tutorialsFor(f.slugPrefix);
              return (
                <article
                  key={f.key}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-card"
                >
                  <div aria-hidden="true" className="h-1 bg-accent" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold tracking-tight text-text-primary">
                      {f.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {f.tagline}
                    </p>

                    <dl className="mt-5 space-y-3 text-sm">
                      <div>
                        <dt className="font-semibold text-text-primary">
                          Best for
                        </dt>
                        <dd className="mt-0.5 text-text-secondary">
                          {f.bestFor}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-text-primary">
                          Watch out for
                        </dt>
                        <dd className="mt-0.5 text-text-secondary">
                          {f.watchOut}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                        Learning path
                      </p>
                      <ol className="mt-3 space-y-1.5">
                        {tutorials.map((t, idx) => (
                          <li key={t.slug}>
                            <Link
                              href={`/tutorials/${t.slug}`}
                              className="group flex items-start gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-0.5 text-sm font-semibold tabular-nums text-text-muted"
                              >
                                {idx + 1}
                              </span>
                              <span className="flex-1">
                                <span className="text-sm font-medium leading-6 text-text-primary group-hover:text-accent">
                                  {t.title}
                                  <span
                                    aria-hidden="true"
                                    className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                                  >
                                    →
                                  </span>
                                </span>
                                <span className="mt-1 flex items-center gap-2">
                                  <Badge
                                    variant={difficultyVariant(t.difficulty)}
                                    size="sm"
                                  >
                                    {t.difficulty}
                                  </Badge>
                                  <span className="text-xs text-text-muted">
                                    {t.estimatedReadTime} min
                                  </span>
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Decision guide */}
      <section className="border-t border-border bg-bg-secondary py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Still not sure? Start here
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {FRAMEWORKS.map((f) => (
              <div
                key={f.key}
                className="rounded-2xl border border-border bg-bg-card p-6 shadow-card"
              >
                <p className="text-base leading-7 text-text-secondary">
                  <span className="text-text-primary">{f.chooseWhen}</span>
                </p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-accent">
                  → {f.name}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-7 text-text-muted">
            The good news: the concepts transfer. Once you understand agents,
            tools, and orchestration in one framework, the others are mostly a
            matter of syntax — which is exactly why it&apos;s worth trying more
            than one.
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Browse every tutorial
            </h2>
            <p className="mt-2 text-base leading-7 text-text-secondary">
              All of our hands-on guides on AI, ML, and automation in one place.
            </p>
          </div>
          <Link
            href="/tutorials"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg-primary shadow-glow transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            View all tutorials
          </Link>
        </Container>
      </section>
    </>
  );
}
