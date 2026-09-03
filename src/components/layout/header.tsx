"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { Navigation } from "@/components/layout/navigation";
import { Logo } from "@/components/ui/logo";
import { authClient } from "@/lib/auth-client";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data?.user));
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
          scrolled
            ? "border-border bg-bg-primary/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Algo Dojo — home"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <Logo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Navigation items={NAV_ITEMS} />
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  Account
                  <svg
                    className={`ml-1.5 h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-bg-secondary shadow-card">
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-t-lg px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await authClient.signOut();
                        window.location.href = "/";
                      }}
                      className="block w-full rounded-b-lg px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            aria-label="Mobile navigation"
            className="animate-slide-down border-t border-border bg-bg-primary px-4 pb-6 md:hidden"
          >
            <div className="flex flex-col gap-2 pt-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="mt-2 flex flex-col gap-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await authClient.signOut();
                      window.location.href = "/";
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-hover"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
