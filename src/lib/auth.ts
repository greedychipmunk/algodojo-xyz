import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { createClient } from "@libsql/client";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { Polar } from "@polar-sh/sdk";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:local.db";
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
});

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
  },
  plugins: [
    nextCookies(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          authenticatedUsersOnly: true,
          successUrl: process.env.POLAR_SUCCESS_URL,
          returnUrl: process.env.POLAR_RETURN_URL,
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET || "",
        }),
      ],
    }),
  ],
});
