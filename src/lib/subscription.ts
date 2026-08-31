import "server-only";

import { auth, polarClient } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Check if the current user has an active Polar subscription
 * or has purchased specific content.
 *
 * Uses the Polar SDK directly to query customer state via the
 * external ID (which is the Better Auth user ID).
 */
export async function getSubscriptionStatus() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { isAuthenticated: false, hasActiveSubscription: false };
  }

  try {
    const state = await polarClient.customers.getStateExternal({
      externalId: session.user.id,
    });

    const hasActiveSubscription =
      state.activeSubscriptions && state.activeSubscriptions.length > 0;

    return {
      isAuthenticated: true,
      hasActiveSubscription: Boolean(hasActiveSubscription),
      user: session.user,
    };
  } catch {
    // If Polar isn't configured or the customer doesn't exist yet,
    // treat as no active subscription.
    return {
      isAuthenticated: true,
      hasActiveSubscription: false,
      user: session.user,
    };
  }
}
