"use server";

import { headers } from "next/headers";
import {
  formatNewsletterMessage,
  isHoneypotTriggered,
  validateNewsletterForm,
} from "@/lib/forms";
import type { NewsletterFormState } from "@/lib/form-state";
import { sendTelegramMessage } from "@/lib/telegram";
import { stripe, PREMIUM_PRICE_ID, PREMIUM_ANNUAL_PRICE_ID, PREMIUM_LIFETIME_PRICE_ID } from "@/lib/stripe";

export async function subscribeNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  if (isHoneypotTriggered(formData.get("website") as string | null)) {
    return { status: "success" };
  }

  const email = String(formData.get("email") ?? "");

  const { success } = validateNewsletterForm({ email });
  if (!success) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  const delivered = await sendTelegramMessage(formatNewsletterMessage(email));
  if (!delivered) {
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  }

  return { status: "success" };
}

/**
 * Create a Stripe Checkout Session for guest (unauthenticated) users.
 * Stripe collects the email during checkout. The webhook handler creates
 * the account after payment completes.
 */
export async function createCheckoutSession(opts: {
  plan: string;
  annual: boolean;
  lifetime?: boolean;
  tutorialSlug?: string;
}): Promise<{ url: string } | { error: string }> {
  if (!stripe) {
    return { error: "Payments are not configured." };
  }

  const priceId = opts.lifetime
    ? PREMIUM_LIFETIME_PRICE_ID
    : opts.annual
      ? PREMIUM_ANNUAL_PRICE_ID
      : PREMIUM_PRICE_ID;
  if (!priceId) {
    return { error: "Pricing is not configured." };
  }

  const h = await headers();
  const origin = h.get("origin") || process.env.BETTER_AUTH_URL || "http://localhost:3000";

  try {
    const isLifetime = opts.lifetime === true;

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        guest_checkout: "true",
        plan: opts.plan,
        lifetime: isLifetime ? "true" : "",
        tutorial_slug: opts.tutorialSlug || "",
      },
      ...(isLifetime
        ? {}
        : {
            subscription_data: {
              metadata: {
                guest_checkout: "true",
                plan: opts.plan,
              },
            },
          }),
      customer_email: undefined,
    });

    if (!session.url) {
      return { error: "Failed to create checkout session." };
    }

    return { url: session.url };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return { error: "Failed to start checkout. Please try again." };
  }
}
