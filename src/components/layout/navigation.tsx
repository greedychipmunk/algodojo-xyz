import Link from "next/link";
import type { NavItem } from "@/lib/types";

interface NavigationProps {
  items: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="relative px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
