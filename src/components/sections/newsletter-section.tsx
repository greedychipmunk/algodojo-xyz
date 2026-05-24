"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/container";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-gradient-to-r from-bg-card via-bg-secondary to-bg-card p-8 shadow-glow sm:p-10 lg:p-12">
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Newsletter
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Stay updated on AI, ML, and automation
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                Get practical insights, new tutorials, and workflow optimization
                ideas delivered straight to your inbox.
              </p>
            </div>

            <form className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="min-h-12 flex-1 rounded-xl border border-border bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-muted shadow-card transition-colors duration-200 focus:border-border-hover focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg-primary shadow-glow transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Subscribe
              </button>
            </form>

            <div aria-live="polite" className="min-h-5 text-sm">
              {submitted ? (
                <p className="text-success">Thanks for subscribing. We&apos;ll keep you posted.</p>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
