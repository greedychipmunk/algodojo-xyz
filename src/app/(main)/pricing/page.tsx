import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing",
  description: "Unlock all premium tutorials on Algo Dojo with a single subscription.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Free tutorials are always free. Upgrade to premium for unlimited
            access to every tutorial on the site — monthly, annual, or lifetime.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <PricingCards />
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-sm text-text-secondary">
            All payments are securely processed by Stripe.
            You can cancel anytime from your account portal.
          </p>
        </div>
      </Container>
    </section>
  );
}
