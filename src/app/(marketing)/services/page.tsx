import { ServiceCard } from "@/components/sections/service-card";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/constants";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Services",
  description:
    "Workflow analysis, agentic AI development, ML integration, and business process automation — tailored to your needs.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
          ]),
        }}
      />
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            title="Our Services"
            subtitle="We examine business workflows and apply agentic AI and ML to optimize those workflows through automation."
            centered
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </Container>
      </section>
      <CtaSection
        title="Let's Build Something Together"
        description="Tell us about your workflow challenges and we'll design a solution."
        buttonText="Start a Conversation"
        buttonHref="/contact"
      />
    </>
  );
}
