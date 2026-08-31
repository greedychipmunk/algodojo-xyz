"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const POLAR_PRODUCT_SLUG = process.env.NEXT_PUBLIC_POLAR_PRODUCT_SLUG || "";

export function PricingCards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    try {
      const { data, error: checkoutError } = await authClient.checkout({
        slug: POLAR_PRODUCT_SLUG,
      });

      if (checkoutError) {
        setError(checkoutError.message ?? "Checkout failed. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {/* Free tier */}
      <div className="flex flex-col rounded-xl border border-border bg-bg-card p-8 shadow-card">
        <h2 className="text-lg font-semibold">Free</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Get started with free tutorials.
        </p>
        <p className="mt-6 text-4xl font-bold">$0</p>
        <p className="mt-1 text-sm text-text-secondary">forever</p>
        <ul className="mt-8 space-y-3 text-sm text-text-secondary">
          <li>Access to all free tutorials</li>
          <li>No account required</li>
          <li>Community support</li>
        </ul>
        <div className="mt-auto pt-8">
          <a
            href="/tutorials"
            className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
          >
            Browse Free Tutorials
          </a>
        </div>
      </div>

      {/* Premium tier */}
      <div className="relative flex flex-col rounded-xl border-2 border-accent bg-bg-card p-8 shadow-card">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg-primary">
          Recommended
        </div>
        <h2 className="text-lg font-semibold">Premium</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Unlock every tutorial on Algo Dojo.
        </p>
        <p className="mt-6 text-4xl font-bold">$9</p>
        <p className="mt-1 text-sm text-text-secondary">per month</p>
        <ul className="mt-8 space-y-3 text-sm text-text-secondary">
          <li>Access to all premium tutorials</li>
          <li>Unlock every future tutorial</li>
          <li>No ads, no distractions</li>
          <li>Cancel anytime</li>
        </ul>
        {error && (
          <p className="mt-4 text-sm text-error">{error}</p>
        )}
        <div className="mt-auto pt-8">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Redirecting…" : "Subscribe with Polar"}
          </button>
        </div>
      </div>
    </div>
  );
}
