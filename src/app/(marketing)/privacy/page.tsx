import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Privacy Policy",
  description:
    "How Algo Dojo collects, uses, and protects your information. We do not sell your personal data.",
  path: "/privacy",
});

const LAST_UPDATED = "June 11, 2026";

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-text-primary text-xl font-semibold">{title}</h2>
      <div className="text-text-secondary space-y-4">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Privacy Policy", href: "/privacy" },
          ]),
        }}
      />
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            title="Privacy Policy"
            subtitle="Your privacy matters. This policy explains what we collect, why, and the choices you have."
            centered
          />

          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-text-muted text-sm">
              Last updated: {LAST_UPDATED}
            </p>

            {/* Plain-language summary */}
            <div className="border-accent/20 bg-accent/5 mt-8 rounded-xl border p-6">
              <h2 className="text-text-primary text-base font-semibold">
                The short version
              </h2>
              <ul className="text-text-secondary mt-3 space-y-2">
                <li>
                  <strong className="text-text-primary">
                    We do not sell your personal data
                  </strong>{" "}
                  — ever, to anyone.
                </li>
                <li>
                  We only collect what you choose to send us through our contact
                  and newsletter forms.
                </li>
                <li>
                  We use that information solely to respond to you and, if you
                  opt in, to send you updates.
                </li>
                <li>
                  You can ask us to access or delete your information at any
                  time.
                </li>
              </ul>
            </div>

            <div className="mt-12 space-y-12">
              <PolicySection title="Who We Are">
                <p>
                  This site is operated by Algo Dojo, LLC (&ldquo;Algo
                  Dojo,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                  &ldquo;our&rdquo;). This policy applies to information we
                  collect through{" "}
                  <span className="text-text-primary">algodojo.xyz</span>.
                </p>
              </PolicySection>

              <PolicySection title="Information We Collect">
                <p>
                  We collect only the information you voluntarily provide. We do
                  not require you to create an account, and we do not use
                  third-party advertising trackers.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-text-primary">Contact form:</strong>{" "}
                    your name, email address, optional company name, and the
                    message you send us.
                  </li>
                  <li>
                    <strong className="text-text-primary">Newsletter:</strong>{" "}
                    the email address you submit to subscribe.
                  </li>
                  <li>
                    <strong className="text-text-primary">
                      Basic server logs:
                    </strong>{" "}
                    like most websites, our hosting provider automatically
                    records standard technical data (such as IP address and
                    request time) for security and reliability.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="How We Use Your Information">
                <p>We use the information you provide to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>respond to your inquiries and provide our services;</li>
                  <li>
                    send you newsletter updates, but only if you subscribed;
                  </li>
                  <li>operate, secure, and improve the website.</li>
                </ul>
                <p>
                  We do not use your information for automated decision-making
                  or profiling.
                </p>
              </PolicySection>

              <PolicySection title="How We Share Information">
                <p>
                  <strong className="text-text-primary">
                    We do not sell, rent, or trade your personal data.
                  </strong>{" "}
                  We share information only with the service providers that help
                  us run the site, and only as needed to deliver what you asked
                  for:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="text-text-primary">Telegram:</strong>{" "}
                    contact and newsletter submissions are delivered to us as
                    messages through the Telegram Bot API so we can read and
                    respond to them.
                  </li>
                  <li>
                    <strong className="text-text-primary">Vercel:</strong> our
                    hosting provider, which serves the website and processes the
                    associated server logs.
                  </li>
                </ul>
                <p>
                  We may also disclose information if required by law or to
                  protect our rights, but never for marketing purposes.
                </p>
              </PolicySection>

              <PolicySection title="Data Retention">
                <p>
                  We keep submissions only as long as needed to respond to you
                  and maintain our records, and we delete them when they are no
                  longer needed. You can ask us to delete your information
                  sooner at any time.
                </p>
              </PolicySection>

              <PolicySection title="Cookies & Analytics">
                <p>
                  We do not use advertising or cross-site tracking cookies. Our
                  forms rely only on the technical requests needed to submit
                  them. If we add privacy-friendly analytics in the future, we
                  will update this policy first.
                </p>
              </PolicySection>

              <PolicySection title="Your Rights & Choices">
                <p>
                  You have the right to access, correct, or delete the personal
                  information you have shared with us, and to unsubscribe from
                  our newsletter at any time. To exercise any of these rights,
                  just email us — we will respond promptly.
                </p>
              </PolicySection>

              <PolicySection title="Children's Privacy">
                <p>
                  Our services are intended for businesses and professionals.
                  The site is not directed at children under 13, and we do not
                  knowingly collect information from them.
                </p>
              </PolicySection>

              <PolicySection title="Changes to This Policy">
                <p>
                  We may update this policy from time to time. When we do, we
                  will revise the &ldquo;Last updated&rdquo; date above and, for
                  significant changes, provide a more prominent notice.
                </p>
              </PolicySection>

              <PolicySection title="Contact Us">
                <p>
                  If you have any questions about this policy or your
                  information, email us at{" "}
                  <a
                    href="mailto:hello@algodojo.xyz"
                    className="text-accent hover:text-accent-hover transition-colors"
                  >
                    hello@algodojo.xyz
                  </a>
                  .
                </p>
              </PolicySection>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
