"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions";
import { initialNewsletterState } from "@/lib/form-state";
import { Container } from "@/components/ui/container";

export function NewsletterSection() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialNewsletterState,
  );

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="border-border from-bg-card via-bg-secondary to-bg-card shadow-glow mx-auto max-w-4xl overflow-hidden rounded-xl border bg-gradient-to-r p-8 sm:p-10 lg:p-12">
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase">
                Newsletter
              </p>
              <h2 className="text-text-primary text-3xl font-semibold tracking-tight sm:text-4xl">
                Stay updated on AI, ML, and automation
              </h2>
              <p className="text-text-secondary mx-auto max-w-2xl text-base leading-7 sm:text-lg">
                Get practical insights, new tutorials, and workflow optimization
                ideas delivered straight to your inbox.
              </p>
            </div>

            <form
              className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
              action={formAction}
            >
              {/* Honeypot: hidden from users, catches bots. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="newsletter-website">Website</label>
                <input
                  id="newsletter-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="border-border bg-bg-primary text-text-primary placeholder:text-text-muted shadow-card focus:border-border-hover min-h-12 flex-1 rounded-xl border px-4 py-3 transition-colors duration-200 focus:outline-none"
              />
              <button
                type="submit"
                disabled={pending}
                className="bg-accent text-bg-primary shadow-glow hover:bg-accent-hover focus-visible:ring-accent focus-visible:ring-offset-bg-primary inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
              >
                {pending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            <div aria-live="polite" className="min-h-5 text-sm">
              {state.status === "success" && (
                <p className="text-success">
                  Thanks for subscribing. We&apos;ll keep you posted.
                </p>
              )}
              {state.status === "error" && state.message && (
                <p className="text-error">{state.message}</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
