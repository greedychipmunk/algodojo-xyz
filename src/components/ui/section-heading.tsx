type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
};

export function SectionHeading({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  const alignmentClasses = centered ? "text-center items-center" : "text-left";
  const subtitleClasses = centered ? "mx-auto" : "";

  return (
    <div className={[
      "flex w-full flex-col gap-4",
      alignmentClasses,
    ].join(" ")}
    >
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={[
            "max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg",
            subtitleClasses,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
