import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Algo Dojo website and its content.",
  path: "/terms",
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

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Terms of Service", href: "/terms" },
          ]),
        }}
      />
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            title="Terms of Service"
            subtitle="The basic terms that apply when you use this website."
            centered
          />

          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-text-muted text-sm">
              Last updated: {LAST_UPDATED}
            </p>

            <div className="mt-12 space-y-12">
              <PolicySection title="Agreement to These Terms">
                <p>
                  This website is operated by Algo Dojo, LLC (&ldquo;Algo
                  Dojo,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                  &ldquo;our&rdquo;). By accessing or using{" "}
                  <span className="text-text-primary">algodojo.xyz</span> (the
                  &ldquo;Site&rdquo;), you agree to these Terms of Service. If
                  you do not agree, please do not use the Site.
                </p>
              </PolicySection>

              <PolicySection title="Use of the Site">
                <p>
                  You may use the Site for lawful purposes only. You agree not
                  to:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    use the Site in any way that violates applicable laws or
                    regulations;
                  </li>
                  <li>
                    attempt to gain unauthorized access to the Site, its
                    servers, or related systems;
                  </li>
                  <li>
                    interfere with or disrupt the Site, or introduce malicious
                    code; or
                  </li>
                  <li>
                    scrape, copy, or republish content except as permitted
                    below.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="Services & Engagements">
                <p>
                  The Site describes our consulting and educational offerings
                  and provides free and premium content. Browsing the Site does
                  not create a consulting relationship. Any paid engagement is
                  governed by a separate written agreement between you and Algo
                  Dojo, which controls in the event of any conflict with these
                  Terms.
                </p>
              </PolicySection>

              <PolicySection title="Intellectual Property">
                <p>
                  Unless otherwise noted, the content on this Site — including
                  text, tutorials, articles, graphics, and logos — is owned by
                  Algo Dojo and protected by intellectual-property laws. You may
                  view and share our content for personal, non-commercial,
                  educational use with attribution. You may not otherwise
                  reproduce, sell, or redistribute it without our permission.
                </p>
              </PolicySection>

              <PolicySection title="Your Submissions">
                <p>
                  When you submit information through our contact or newsletter
                  forms, you confirm that the information is accurate and that
                  you have the right to share it. Please do not submit unlawful,
                  infringing, or confidential third-party information. How we
                  handle the information you send is described in our{" "}
                  <a
                    href="/privacy"
                    className="text-accent hover:text-accent-hover transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </PolicySection>

              <PolicySection title="Third-Party Links & Services">
                <p>
                  The Site may link to or rely on third-party websites and
                  services that we do not control. We are not responsible for
                  their content, policies, or practices, and your use of them is
                  at your own risk.
                </p>
              </PolicySection>

              <PolicySection title="Disclaimer">
                <p>
                  The Site and its content are provided &ldquo;as is&rdquo; and
                  &ldquo;as available,&rdquo; without warranties of any kind,
                  whether express or implied. Our educational content is for
                  general informational purposes and is not professional, legal,
                  or financial advice. We do not warrant that the Site will be
                  uninterrupted, error-free, or secure.
                </p>
              </PolicySection>

              <PolicySection title="Limitation of Liability">
                <p>
                  To the fullest extent permitted by law, Algo Dojo will not be
                  liable for any indirect, incidental, special, or consequential
                  damages arising from your use of the Site or reliance on its
                  content. Nothing in these Terms limits liability that cannot
                  be limited under applicable law.
                </p>
              </PolicySection>

              <PolicySection title="Changes to These Terms">
                <p>
                  We may update these Terms from time to time. When we do, we
                  will revise the &ldquo;Last updated&rdquo; date above. Your
                  continued use of the Site after changes take effect means you
                  accept the updated Terms.
                </p>
              </PolicySection>

              <PolicySection title="Governing Law">
                <p>
                  These Terms are governed by the laws of the United States and
                  the state in which Algo Dojo, LLC is organized, without regard
                  to conflict-of-laws principles.
                </p>
              </PolicySection>

              <PolicySection title="Contact Us">
                <p>
                  Questions about these Terms? Email us at{" "}
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
