interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTocItems(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    items.push({ id, text, level });
  }

  return items;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-navy-700 bg-navy-900/50 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
        On This Page
      </h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className="block text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
