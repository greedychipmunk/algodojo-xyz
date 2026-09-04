import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PREMIUM_PRICE_ID, PREMIUM_ANNUAL_PRICE_ID } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Kysely, sql } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";

export const runtime = "nodejs";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:local.db";
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

const db = new Kysely<unknown>({
  dialect: new LibsqlDialect({
    url: dbUrl,
    authToken: dbAuthToken,
  }),
});

/**
 * Generate a random password for guest-created accounts.
 * The user sets their own password later via the password reset flow.
 */
function generateRandomPassword(length = 32): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Stripe webhook handler.
 *
 * Handles:
 * - checkout.session.completed: Creates user account for guest checkouts,
 *   then records the subscription in the database.
 * - customer.subscription.updated: Updates subscription status.
 * - customer.subscription.deleted: Marks subscription as deleted.
 *
 * This replaces the better-auth stripe plugin's webhook endpoint.
 * Configure this URL (/api/stripe/webhook) in the Stripe dashboard.
 */
export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
  } catch (err) {
    console.error("Failed to verify Stripe webhook signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`Stripe webhook error (${event.type}):`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

interface UserRow {
  id: string;
  email: string;
  stripe_customer_id: string | null;
}

interface SubscriptionRow {
  id: string;
  stripe_subscription_id: string;
}

/**
 * Handle checkout.session.completed — create user account for guest
 * checkouts and record the subscription.
 */
async function handleCheckoutCompleted(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  if (checkoutSession.mode !== "subscription") return;

  const metadata = checkoutSession.metadata || {};
  const isGuestCheckout = metadata.guest_checkout === "true";
  const customerId = checkoutSession.customer as string;

  // Retrieve the subscription to get full details
  const subscription = await stripe!.subscriptions.retrieve(
    checkoutSession.subscription as string,
  );

  const planName = metadata.plan || "premium";

  // For guest checkouts, create the user account
  let userId: string | undefined;

  if (isGuestCheckout) {
    const customer = (await stripe!.customers.retrieve(
      customerId,
    )) as Stripe.Customer;
    const email = customer.email;

    if (email) {
      const existingUser = await sql<UserRow>`SELECT id FROM user WHERE email = ${email.toLowerCase()}`.execute(db);

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
        await sql`UPDATE user SET stripe_customer_id = ${customerId}, updated_at = ${new Date().toISOString()} WHERE id = ${userId} AND stripe_customer_id IS NULL`.execute(db);
      } else {
        try {
          const h = await headers();
          const result = await auth.api.signUpEmail({
            body: {
              name: customer.name || email.split("@")[0],
              email,
              password: generateRandomPassword(),
            },
            headers: h,
            asResponse: false,
          });

          if (result && "user" in result) {
            userId = (result as { user: { id: string } }).user.id;
            await sql`UPDATE user SET stripe_customer_id = ${customerId}, updated_at = ${new Date().toISOString()} WHERE id = ${userId}`.execute(db);
          }
        } catch (err) {
          console.error("Failed to create user via signUpEmail:", err);
          const retryUser = await sql<UserRow>`SELECT id FROM user WHERE email = ${email.toLowerCase()}`.execute(db);
          if (retryUser.rows.length > 0) {
            userId = retryUser.rows[0].id;
            await sql`UPDATE user SET stripe_customer_id = ${customerId}, updated_at = ${new Date().toISOString()} WHERE id = ${userId}`.execute(db);
          }
        }
      }
    }
  } else {
    const customerResult = await sql<UserRow>`SELECT id FROM user WHERE stripe_customer_id = ${customerId}`.execute(db);
    if (customerResult.rows.length > 0) {
      userId = customerResult.rows[0].id;
    }
  }

  if (!userId) {
    console.error(
      `Stripe webhook: Could not determine user for checkout session ${checkoutSession.id}`,
    );
    return;
  }

  const subItem = subscription.items.data[0];
  const periodStart = new Date(subItem.current_period_start * 1000).toISOString();
  const periodEnd = new Date(subItem.current_period_end * 1000).toISOString();
  const billingInterval = subItem.price.recurring?.interval || "month";

  const existingSub = await sql<SubscriptionRow>`SELECT id FROM subscription WHERE stripe_subscription_id = ${subscription.id}`.execute(db);

  if (existingSub.rows.length > 0) {
    await sql`UPDATE subscription SET
      plan = ${planName},
      status = ${subscription.status},
      stripe_customer_id = ${customerId},
      period_start = ${periodStart},
      period_end = ${periodEnd},
      billing_interval = ${billingInterval},
      updated_at = ${new Date().toISOString()}
    WHERE stripe_subscription_id = ${subscription.id}`.execute(db);
  } else {
    await sql`INSERT INTO subscription (
      id, plan, status, stripe_customer_id, stripe_subscription_id,
      reference_id, period_start, period_end, billing_interval,
      seats, created_at, updated_at
    ) VALUES (
      ${crypto.randomUUID()},
      ${planName},
      ${subscription.status},
      ${customerId},
      ${subscription.id},
      ${userId},
      ${periodStart},
      ${periodEnd},
      ${billingInterval},
      1,
      ${new Date().toISOString()},
      ${new Date().toISOString()}
    )`.execute(db);
  }
}

/**
 * Handle customer.subscription.updated — update subscription status.
 */
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const subItem = subscription.items.data[0];

  const periodStart = new Date(subItem.current_period_start * 1000).toISOString();
  const periodEnd = new Date(subItem.current_period_end * 1000).toISOString();
  const billingInterval = subItem.price.recurring?.interval || "month";

  await sql`UPDATE subscription SET
    status = ${subscription.status},
    period_start = ${periodStart},
    period_end = ${periodEnd},
    cancel_at_period_end = ${subscription.cancel_at_period_end},
    billing_interval = ${billingInterval},
    updated_at = ${new Date().toISOString()}
  WHERE stripe_subscription_id = ${subscription.id}`.execute(db);
}

/**
 * Handle customer.subscription.deleted — mark subscription as canceled.
 */
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  await sql`UPDATE subscription SET
    status = ${subscription.status},
    canceled_at = ${new Date().toISOString()},
    ended_at = ${new Date().toISOString()},
    updated_at = ${new Date().toISOString()}
  WHERE stripe_subscription_id = ${subscription.id}`.execute(db);
}
