import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "children" | "className" | "href"
  > & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg-primary shadow-glow hover:bg-accent-hover hover:text-bg-primary",
  secondary:
    "border border-border bg-transparent text-text-primary hover:border-border-hover hover:bg-bg-tertiary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50";

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    const linkProps = props as ButtonAsLinkProps;
    const {
      href,
      variant = "primary",
      size = "md",
      className,
      children,
      ...rest
    } = linkProps;
    const classes = getButtonClasses(variant, size, className);

    return (
      <Link className={classes} href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonVariantProps = props as ButtonAsButtonProps;
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    type: rawButtonType,
    ...buttonProps
  } = buttonVariantProps;
  const resolvedButtonType: "button" | "submit" | "reset" =
    (rawButtonType as "button" | "submit" | "reset" | undefined) ?? "button";
  const classes = getButtonClasses(variant, size, className);
  const resolvedButtonProps = buttonProps as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className"
  >;

  return (
    <button className={classes} type={resolvedButtonType} {...resolvedButtonProps}>
      {children}
    </button>
  );
}
