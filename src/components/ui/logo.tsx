/**
 * Algo Dojo brand mark — a stylized torii gate (the dojo threshold) whose
 * keystone is an amber decision-node diamond (the "algo").
 *
 * The gate is drawn with `currentColor`, so it inherits the surrounding text
 * color and adapts automatically to the light/dark design tokens. The node
 * always uses the brand accent. Keep both in sync with `app/icon.svg`,
 * `public/logo.svg`, and the OG image route if the geometry ever changes.
 */

type LogoMarkProps = {
  className?: string;
  /** Accessible label. Set to "" when the adjacent wordmark already names it. */
  title?: string;
};

export function LogoMark({ className, title = "Algo Dojo" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {/* Torii gate — inherits currentColor for theme adaptability */}
      <g fill="currentColor">
        <rect x="4.5" y="6.8" width="23" height="3" rx="0.9" />
        <rect x="8" y="12" width="16" height="2.4" rx="0.7" />
        <path d="M10 9.8 H12.2 L12.6 26 H9.2 Z" />
        <path d="M22 9.8 H19.8 L19.4 26 H22.8 Z" />
      </g>
      {/* Inference node — the keystone, in brand accent */}
      <path d="M16 9.2 L18 11 L16 12.8 L14 11 Z" className="fill-accent" />
    </svg>
  );
}

type LogoProps = {
  /** Extra classes for the wrapping element. */
  className?: string;
  /** Extra classes for the mark (e.g. size overrides). Defaults to h-7 w-7. */
  markClassName?: string;
};

/**
 * Full lockup: mark + "AlgoDojo" wordmark. Render inside your own <Link> so the
 * caller controls navigation and focus styles.
 */
export function Logo({ className, markClassName }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark
        title=""
        className={`text-text-primary ${markClassName ?? "h-7 w-7"}`}
      />
      <span className="text-xl font-bold leading-none tracking-tight">
        <span className="text-text-primary">Algo</span>
        <span className="text-accent">Dojo</span>
      </span>
    </span>
  );
}
