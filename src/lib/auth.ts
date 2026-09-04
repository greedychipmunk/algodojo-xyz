import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { sendPasswordResetEmail } from "@/lib/email";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:local.db";
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Only initialize Stripe when the secret key is available.
// This prevents build-time crashes when env vars aren't set
// (e.g. Vercel preview deploys missing environment configuration).
const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : undefined;

export const auth = betterAuth({
  database: {
    dialect: new LibsqlDialect({
      url: dbUrl,
      authToken: dbAuthToken,
    }),
    type: "sqlite",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
  },
  plugins: [
    nextCookies(),
    ...(stripeClient
      ? [
          stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
            createCustomerOnSignUp: true,
            subscription: {
              enabled: true,
              plans: [
                {
                  name: "premium",
                  priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
                  annualDiscountPriceId:
                    process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || "",
                },
              ],
            },
          }),
        ]
      : []),
  ],
});
