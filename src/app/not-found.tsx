import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-6xl font-bold text-accent">404</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </section>
  );
}
