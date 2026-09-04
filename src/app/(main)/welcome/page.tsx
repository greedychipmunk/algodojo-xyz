import Link from "next/link";
import type Stripe from "stripe";
import { Container } from "@/components/ui/container";
import { stripe } from "@/lib/stripe";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Welcome",
  description: "Your Algo Dojo account is ready.",
  path: "/welcome",
});

interface SearchParams {
  session_id?: string;
}

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let email: string | null = null;

  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["customer"],
      });
      const customer = session.customer as Stripe.Customer | null;
      email = customer?.email ?? null;
    } catch {
      // Session ID invalid or Stripe not reachable — still show the page
    }
  }

  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-border bg-bg-card p-8 text-center shadow-card">
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Your account is ready
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Your subscription is active. We&apos;ve created an account for you
            {email ? (
              <>
                {" "}
                using <span className="font-medium text-text-primary">{email}</span>
              </>
            ) : null}
            .
          </p>

          {email && (
            <div className="mt-6 rounded-lg border border-border bg-bg-secondary p-4 text-left">
              <p className="text-xs text-text-secondary">
                You&apos;ll need to set a password to sign in. Use the
                &ldquo;Forgot Password&rdquo; link on the sign-in page —
                we&apos;ll send a reset link to your email.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/tutorials"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover"
            >
              Browse Tutorials
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-bg-secondary px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
