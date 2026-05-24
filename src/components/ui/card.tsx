import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
};

const baseClasses =
  "rounded-xl border border-border bg-bg-card p-6 shadow-card transition-all duration-200";
const hoverClasses =
  "hover:-translate-y-0.5 hover:border-border-hover hover:bg-bg-card-hover hover:shadow-card-hover";
const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

export function Card({
  children,
  className,
  href,
  hover,
}: CardProps) {
  const isHoverable = hover ?? Boolean(href);
  const classes = [
    baseClasses,
    isHoverable ? hoverClasses : "",
    href ? focusClasses : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
