import Link from "next/link";

import { SERVICES } from "@/lib/constants";

const SERVICE_EMOJIS: Record<string, string> = {
  search: "🔎",
  cpu: "⚙️",
  brain: "🧠",
  zap: "⚡",
};

export function FeaturesSection() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Services
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Strategy and implementation for AI-powered growth
          </h2>
          <p className="text-base leading-7 text-text-secondary sm:text-lg">
            Our core services help teams identify the right opportunities,
            deploy the right solutions, and measure the impact with clarity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group flex h-full flex-col rounded-xl border border-border bg-bg-card p-5 shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-2xl shadow-card transition-transform duration-200 group-hover:scale-105">
                <span aria-hidden="true">{SERVICE_EMOJIS[service.icon] ?? "✨"}</span>
              </div>

              <h3 className="text-base font-semibold text-text-primary sm:text-lg">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                {service.description}
              </p>

              <Link
                href="/services"
                className="mt-5 inline-flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                aria-label={`Learn more about ${service.title}`}
              >
                Learn More
                <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
