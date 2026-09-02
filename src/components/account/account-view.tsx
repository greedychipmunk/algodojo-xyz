"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

interface AccountViewProps {
  user: {
    name: string;
    email: string;
  };
  hasSubscription: boolean;
  activeSubscriptions: Array<{ name: string; status: string }>;
}

export function AccountView({
  user,
  hasSubscription,
  activeSubscriptions,
}: AccountViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePortalRedirect() {
    setError(null);
    setLoading(true);

    try {
      const { data, error: portalError } = await authClient.subscription.billingPortal({
        returnUrl: "/account",
      });

      if (portalError) {
        setError(portalError.message ?? "Failed to open billing portal.");
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

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Profile */}
      <div className="rounded-xl border border-border bg-bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Profile</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Name</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
        </dl>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-border bg-bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Subscription</h2>

        {hasSubscription ? (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-success" />
              <p className="text-sm font-medium text-success">Active</p>
            </div>
            {activeSubscriptions.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {activeSubscriptions.map((sub, i) => (
                  <li key={i}>
                    {sub.name} — {sub.status}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={handlePortalRedirect}
              disabled={loading}
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-border bg-bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Loading…" : "Manage Billing"}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-text-secondary">
              You don&apos;t have an active subscription.
            </p>
            <a
              href="/pricing"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover"
            >
              View Pricing
            </a>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="text-sm text-text-secondary underline transition-colors hover:text-text-primary"
      >
        Sign out
      </button>
    </div>
  );
}
