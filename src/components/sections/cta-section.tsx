import Link from "next/link";
import { Container } from "@/components/ui/container";

interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export function CtaSection({
  title,
  description,
  buttonText,
  buttonHref,
}: CtaSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-r from-accent/20 via-accent-muted/20 to-accent-hover/10 p-8 shadow-glow sm:p-10 lg:p-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              {description}
            </p>
            <Link
              href={buttonHref}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg-primary shadow-glow transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
