const STATS = [
  {
    value: "50+",
    label: "Workflows Optimized",
  },
  {
    value: "3x",
    label: "Avg Efficiency Gain",
  },
  {
    value: "100+",
    label: "Tutorials Published",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
] as const;

export function StatsSection() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-xl border border-border bg-bg-secondary p-6 shadow-card sm:p-8 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-border bg-bg-card p-6 text-center shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover"
            >
              <div className="text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-text-secondary sm:text-base">
                {stat.label}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
