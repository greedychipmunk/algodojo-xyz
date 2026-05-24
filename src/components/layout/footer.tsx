import Link from "next/link";

const FOOTER_LINKS = {
  services: [
    { label: "Workflow Analysis", href: "/services" },
    { label: "Agentic AI Development", href: "/services" },
    { label: "ML Integration", href: "/services" },
    { label: "Process Automation", href: "/services" },
  ],
  resources: [
    { label: "Tutorials", href: "/tutorials" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold">
              <span className="text-text-primary">Algo</span>
              <span className="text-accent">Dojo</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-text-secondary">
              AI/ML consulting and education. We examine business workflows
              and apply agentic AI to optimize through automation.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@algodojo.xyz"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  hello@algodojo.xyz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {year} Algo Dojo, LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-text-muted transition-colors hover:text-text-secondary"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-text-muted transition-colors hover:text-text-secondary"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
