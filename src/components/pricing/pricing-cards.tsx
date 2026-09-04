"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const MONTHLY_PRICE = 9;
const ANNUAL_PRICE = 79;
const ANNUAL_MONTHLY_EQUIVALENT = (ANNUAL_PRICE / 12).toFixed(2);
const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100,
);

export function PricingCards() {
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    try {
      const { data: session } = await authClient.getSession();

      if (!session) {
        router.push("/sign-in");
        return;
      }

      const { error: checkoutError } = await authClient.subscription.upgrade({
        plan: "premium",
        annual,
        successUrl: "/account",
        cancelUrl: "/pricing",
      });

      if (checkoutError) {
        setError(checkoutError.message ?? "Checkout failed. Please try again.");
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
      <div className="mx-auto mb-10 flex w-fit items-center gap-3">
        <span
          className={`text-sm font-medium ${!annual ? "text-text-primary" : "text-text-secondary"}`}
        >
          Monthly
        </span>
        <Switch
          checked={annual}
          onCheckedChange={setAnnual}
          disabled={loading}
          aria-label="Toggle annual billing"
        />
        <span
          className={`text-sm font-medium ${annual ? "text-text-primary" : "text-text-secondary"}`}
        >
          Annual
        </span>
        <Badge variant="accent" size="sm">
          Save ~{ANNUAL_SAVINGS_PERCENT}%
        </Badge>
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
              ${annual ? ANNUAL_PRICE : MONTHLY_PRICE}
            </p>
            <p className="text-sm text-text-secondary">
              {annual ? "/year" : "/month"}
            </p>
          </div>
          <p
            className={`mt-1 text-xs text-text-secondary ${annual ? "visible" : "invisible"}`}
          >
            ≈ ${ANNUAL_MONTHLY_EQUIVALENT}/month, billed annually
          </p>
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
              {loading ? "Redirecting…" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
