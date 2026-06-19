import Image from "next/image";
import Link from "next/link";
import { AUTHOR } from "@/lib/constants";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface AuthorBylineProps {
  publishedAt: string;
  estimatedReadTime: number;
}

/**
 * Compact authored byline shown beneath the tutorial title: a circular avatar
 * plus the author's name, role, publish date, and read time.
 */
export function AuthorByline({
  publishedAt,
  estimatedReadTime,
}: AuthorBylineProps) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <Image
        src={AUTHOR.image}
        alt={`${AUTHOR.name}, ${AUTHOR.role}`}
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-border"
      />
      <div className="text-sm">
        <p className="font-medium text-text-primary">
          By{" "}
          <Link
            href={AUTHOR.url}
            className="transition-colors hover:text-accent"
            rel="author"
          >
            {AUTHOR.name}
          </Link>
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-text-muted">
          <span className="text-accent">{AUTHOR.role}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{estimatedReadTime} min read</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Richer "About the author" card rendered at the end of a tutorial. Reinforces
 * E-E-A-T by pairing the author's name and role with a short bio.
 */
export function AuthorBio() {
  return (
    <aside className="mt-16 rounded-xl border border-border bg-bg-card p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src={AUTHOR.image}
          alt={`${AUTHOR.name}, ${AUTHOR.role}`}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-border"
        />
        <div>
          <p className="text-xs font-medium tracking-wide text-text-muted uppercase">
            About the author
          </p>
          <h2 className="mt-1 text-lg font-semibold text-text-primary">
            {AUTHOR.name}
            <span className="ml-2 text-sm font-normal text-accent">
              {AUTHOR.role}
            </span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {AUTHOR.bio}
          </p>
        </div>
      </div>
    </aside>
  );
}
