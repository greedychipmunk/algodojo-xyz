import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg-primary px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-5xl rounded-full bg-gradient-to-r from-accent/20 via-accent-hover/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-10 animate-fade-in">
        <div className="max-w-3xl space-y-6">
          <p className="inline-flex items-center rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm font-medium text-text-secondary shadow-card">
            Agentic AI for modern business workflows
          </p>

          <h1 className="relative text-balance text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-7xl">
            <span className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-r from-accent/20 via-accent-hover/10 to-transparent blur-3xl" />
            Optimize Your Workflows with Agentic AI
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
            We examine business workflows and apply AI and ML to automate and
            optimize — delivering measurable results.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Get Started
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-primary shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            View Tutorials
          </Link>
        </div>
      </div>
    </section>
  );
}
