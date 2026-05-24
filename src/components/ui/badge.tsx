import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";

type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "border border-border bg-bg-tertiary text-text-secondary",
  accent: "border border-transparent bg-accent/15 text-accent",
  success: "border border-transparent bg-success/15 text-success",
  warning: "border border-transparent bg-warning/15 text-warning",
  error: "border border-transparent bg-error/15 text-error",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

const baseClasses =
  "inline-flex items-center rounded-full font-medium leading-none";

export function Badge({
  variant = "default",
  size = "md",
  children,
  className,
}: BadgeProps) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
