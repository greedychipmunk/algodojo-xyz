"use client";

import { useActionState } from "react";
import {
  initialContactState,
  submitContact,
} from "@/app/(marketing)/contact/actions";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactState,
  );

  if (state.status === "success") {
    return (
      <div className="border-success/20 bg-success/5 mt-12 rounded-xl border p-8 text-center">
        <h2 className="text-success text-xl font-semibold">Message Sent!</h2>
        <p className="text-text-secondary mt-2">
          Thanks for reaching out. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-12 space-y-6">
      {/* Honeypot: hidden from users, catches bots. Not announced to AT. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border-error/20 bg-error/5 text-error rounded-lg border px-4 py-3 text-sm"
        >
          {state.message}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="text-text-secondary block text-sm font-medium"
        >
          Name <span className="text-error">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-invalid={Boolean(state.fieldErrors?.name)}
          className="border-border bg-bg-secondary text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-accent mt-1 block w-full rounded-lg border px-4 py-3 focus:ring-1"
          placeholder="Your name"
        />
        {state.fieldErrors?.name && (
          <p className="text-error mt-1 text-sm">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-text-secondary block text-sm font-medium"
        >
          Email <span className="text-error">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
          className="border-border bg-bg-secondary text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-accent mt-1 block w-full rounded-lg border px-4 py-3 focus:ring-1"
          placeholder="you@company.com"
        />
        {state.fieldErrors?.email && (
          <p className="text-error mt-1 text-sm">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="company"
          className="text-text-secondary block text-sm font-medium"
        >
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="border-border bg-bg-secondary text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-accent mt-1 block w-full rounded-lg border px-4 py-3 focus:ring-1"
          placeholder="Company name"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-text-secondary block text-sm font-medium"
        >
          Message <span className="text-error">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          className="border-border bg-bg-secondary text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-accent mt-1 block w-full rounded-lg border px-4 py-3 focus:ring-1"
          placeholder="Tell us about your workflow challenges..."
        />
        {state.fieldErrors?.message && (
          <p className="text-error mt-1 text-sm">{state.fieldErrors.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
