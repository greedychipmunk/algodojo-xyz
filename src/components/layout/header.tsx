import Link from 'next/link';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';

const navItems = [
  { href: '/services', label: 'Services' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-800 bg-navy-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-navy-800 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
