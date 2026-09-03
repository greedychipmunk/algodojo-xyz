import Link from "next/link";

interface PaywallProps {
  tutorialTitle: string;
  tutorialSlug: string;
  isAuthenticated: boolean;
}

export function Paywall({
  tutorialTitle,
  tutorialSlug,
  isAuthenticated,
}: PaywallProps) {
  return (
    <div className="mt-12 rounded-xl border border-border bg-bg-card p-8 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
        <svg
          className="h-6 w-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-text-primary">
        Premium Tutorial
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
        {tutorialTitle} is a premium tutorial. Subscribe to Algo Dojo&apos;s
        all-access plan to unlock this tutorial and every other premium
        tutorial on the site.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={`/pricing?tutorial=${tutorialSlug}`}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          View Pricing
        </Link>
        {!isAuthenticated && (
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
