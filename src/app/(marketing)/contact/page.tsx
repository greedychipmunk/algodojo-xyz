import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/ui/contact-form";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Contact",
  description:
    "Get in touch with Algo Dojo. Tell us about your workflow challenges and we'll design a solution.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
          ]),
        }}
      />
      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold sm:text-4xl">Get in Touch</h1>
            <p className="mt-4 text-text-secondary">
              Tell us about your workflow challenges and we&apos;ll get back to
              you within one business day.
            </p>
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
