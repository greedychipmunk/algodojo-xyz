import { Container } from "@/components/ui/container";

const TESTIMONIALS = [
  {
    quote:
      "Algo Dojo helped us identify automation opportunities we had overlooked for years. The impact was immediate and measurable.",
    name: "Maya Patel",
    role: "Operations Director",
    company: "Northstar Logistics",
  },
  {
    quote:
      "Their AI workflow analysis translated complex ideas into a clear implementation plan our team could actually execute.",
    name: "Jordan Lee",
    role: "Product Lead",
    company: "BrightPath Health",
  },
  {
    quote:
      "The tutorials are practical, well-structured, and grounded in real-world use cases. They made our team more confident with AI.",
    name: "Sofia Ramirez",
    role: "Engineering Manager",
    company: "Vector Forge",
  },
] as const;

export function TestimonialSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Testimonials
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Trusted by teams building better workflows
            </h2>
            <p className="text-base leading-7 text-text-secondary sm:text-lg">
              A few words from clients and readers who have worked with our
              strategy, implementation, and educational content.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex h-full flex-col rounded-xl border border-border bg-bg-card p-6 shadow-card transition-all duration-200 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover"
              >
                <blockquote className="flex-1 text-sm leading-7 text-text-secondary">
                  <span aria-hidden="true" className="mb-4 block text-4xl leading-none text-accent/40">
                    &ldquo;
                  </span>
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <div className="font-semibold text-text-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-text-muted">
                    {testimonial.company}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
