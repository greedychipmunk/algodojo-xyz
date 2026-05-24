import type { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

const SERVICE_EMOJIS: Record<string, string> = {
  search: "🔎",
  cpu: "⚙️",
  brain: "🧠",
  zap: "⚡",
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-bg-card p-6 shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-secondary text-3xl shadow-card transition-transform duration-200 group-hover:scale-105">
        <span aria-hidden="true">{SERVICE_EMOJIS[service.icon] ?? "✨"}</span>
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-text-primary">
        {service.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-text-secondary">
        {service.description}
      </p>

      <ul className="mt-6 space-y-3 text-sm text-text-primary">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs text-accent"
            >
              ✓
            </span>
            <span className="leading-6 text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
