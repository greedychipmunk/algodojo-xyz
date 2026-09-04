"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { createCheckoutSession } from "@/app/actions";

const MONTHLY_PRICE = 9;
const ANNUAL_PRICE = 79;
const LIFETIME_PRICE = 149;
const ANNUAL_MONTHLY_EQUIVALENT = (ANNUAL_PRICE / 12).toFixed(2);
const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100,
);

type Billing = "monthly" | "annual" | "lifetime";

export function PricingCards() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLifetime = billing === "lifetime";
  const isAnnual = billing === "annual";

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    try {
      const { data: session } = await authClient.getSession();

      if (session && !isLifetime) {
        // Authenticated + recurring: use the better-auth plugin's upgrade endpoint
        const { error: checkoutError } = await authClient.subscription.upgrade({
          plan: "premium",
          annual: isAnnual,
          successUrl: "/account",
          cancelUrl: "/pricing",
        });

        if (checkoutError) {
          setError(
            checkoutError.message ?? "Checkout failed. Please try again.",
          );
        }
      } else {
        // Guest or lifetime: create a Stripe Checkout Session directly
        const result = await createCheckoutSession({
          plan: "premium",
          annual: isAnnual,
          lifetime: isLifetime,
        });

        if ("url" in result) {
          window.location.href = result.url;
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Billing toggle */}
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-lg border border-border bg-bg-secondary p-1">
        {(["monthly", "annual", "lifetime"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setBilling(option)}
            disabled={loading}
            className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors disabled:cursor-not-allowed ${
              billing === option
                ? "bg-accent text-bg-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

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
            <Link
              href="/tutorials"
              className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
            >
              Browse Free Tutorials
            </Link>
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
          <div className="mt-6 flex items-baseline gap-1">
            <p className="text-4xl font-bold">
              ${isLifetime ? LIFETIME_PRICE : isAnnual ? ANNUAL_PRICE : MONTHLY_PRICE}
            </p>
            <p className="text-sm text-text-secondary">
              {isLifetime ? "once" : isAnnual ? "/year" : "/month"}
            </p>
          </div>
          <p
            className={`mt-1 text-xs text-text-secondary ${
              isAnnual ? "visible" : "invisible"
            }`}
          >
            ≈ ${ANNUAL_MONTHLY_EQUIVALENT}/month, billed annually
          </p>
          <ul className="mt-8 space-y-3 text-sm text-text-secondary">
            <li>Access to all premium tutorials</li>
            <li>Unlock every future tutorial</li>
            <li>No ads, no distractions</li>
            {isLifetime ? (
              <li>Pay once, access forever</li>
            ) : (
              <li>Cancel anytime</li>
            )}
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
              {loading ? "Redirecting…" : isLifetime ? "Buy Lifetime" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
