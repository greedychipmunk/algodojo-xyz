import "server-only";

import Stripe from "stripe";

/**
 * Stripe client singleton for server-side use.
 * Reuses the secret key from environment — only initialized when available
 * to prevent build-time crashes on environments without Stripe configured.
 */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : undefined;

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || "";
export const PREMIUM_ANNUAL_PRICE_ID =
  process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || "";
