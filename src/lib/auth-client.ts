import { createAuthClient } from "better-auth/client";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [stripeClient({ subscription: true })],
});
