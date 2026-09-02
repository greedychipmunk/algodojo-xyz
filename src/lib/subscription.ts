import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Check if the current user has an active Stripe subscription.
 *
 * Uses the Better Auth API to query subscription status from the
 * local database (the Stripe plugin persists subscription data).
 */
export async function getSubscriptionStatus() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { isAuthenticated: false, hasActiveSubscription: false };
  }

  try {
    const subscriptions = await auth.api.listActiveSubscriptions({
      headers: await headers(),
    });

    const hasActiveSubscription = subscriptions.some(
      (sub) => sub.status === "active" || sub.status === "trialing",
    );

    return {
      isAuthenticated: true,
      hasActiveSubscription,
      user: session.user,
    };
  } catch {
    // If Stripe isn't configured or the subscription table doesn't exist yet,
    // treat as no active subscription.
    return {
      isAuthenticated: true,
      hasActiveSubscription: false,
      user: session.user,
    };
  }
}
