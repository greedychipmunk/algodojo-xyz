"use client";

import { useEffect, useMemo, useState } from "react";

interface TableOfContentsHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TableOfContentsHeading[];
}

function getIndentClass(level: number): string {
  if (level <= 2) {
    return "pl-0";
  }

  if (level === 3) {
    return "pl-4";
  }

  return "pl-8";
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const resolvedActiveId =
    headings.find((heading) => heading.id === activeId)?.id ?? headings[0]?.id ?? activeId;

  useEffect(() => {
    if (headingIds.length === 0) {
      return;
    }

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headingIds]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-xl border border-border bg-bg-card p-4 shadow-card lg:sticky lg:top-24 lg:p-6">
      <div className="flex items-center justify-between gap-3 lg:mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
          On this page
        </h2>
        <button
          aria-controls="table-of-contents-mobile"
          aria-expanded={isMobileOpen}
          className="rounded-full border border-border bg-bg-secondary px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary lg:hidden"
          type="button"
          onClick={() => setIsMobileOpen((current) => !current)}
        >
          {isMobileOpen ? "Hide" : "Show"}
        </button>
      </div>

      <nav aria-label="Table of contents">
        <ul className="hidden space-y-1 lg:block">
          {headings.map((heading) => {
            const isActive = resolvedActiveId === heading.id;

            return (
              <li key={heading.id} className={getIndentClass(heading.level)}>
                <a
                  aria-current={isActive ? "location" : undefined}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent/10 font-medium text-accent"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
                  ].join(" ")}
                  href={`#${heading.id}`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>

        <div
          id="table-of-contents-mobile"
          className={[
            "mt-4 lg:hidden",
            isMobileOpen ? "block" : "hidden",
          ].join(" ")}
        >
          <ul className="space-y-1">
            {headings.map((heading) => {
              const isActive = resolvedActiveId === heading.id;

              return (
                <li key={heading.id} className={getIndentClass(heading.level)}>
                  <a
                    aria-current={isActive ? "location" : undefined}
                    className={[
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
                    ].join(" ")}
                    href={`#${heading.id}`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
