import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AccountView } from "@/components/account/account-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Account",
  description: "Manage your Algo Dojo subscription.",
  path: "/account",
});

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  let activeSubscriptions: Array<{ name: string; status: string }> = [];
  let hasSubscription = false;

  try {
    const subscriptions = await auth.api.listActiveSubscriptions({
      headers: await headers(),
    });

    const active = subscriptions.filter(
      (sub) => sub.status === "active" || sub.status === "trialing",
    );

    hasSubscription = active.length > 0;

    activeSubscriptions = active.map((sub) => ({
      name: sub.plan || "Premium",
      status: sub.status,
    }));
  } catch {
    // Stripe not configured or subscription table doesn't exist yet
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Account</h1>
          <p className="mt-2 text-text-secondary">
            Manage your subscription and billing.
          </p>

          <AccountView
            user={{
              name: session.user.name,
              email: session.user.email,
            }}
            hasSubscription={hasSubscription}
            activeSubscriptions={activeSubscriptions}
          />
        </div>
      </Container>
    </section>
  );
}
