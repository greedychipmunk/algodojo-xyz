import { MDXRemote } from 'next-mdx-remote/rsc';

const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof props.children === 'string' ? props.children : '';
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return <h2 id={id} className="mt-12 mb-4 text-2xl font-bold text-white scroll-mt-20" {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof props.children === 'string' ? props.children : '';
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return <h3 id={id} className="mt-8 mb-3 text-xl font-semibold text-white scroll-mt-20" {...props} />;
  },
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-6 mb-2 text-lg font-semibold text-white" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed text-slate-300" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 space-y-2 pl-6 list-disc text-slate-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 space-y-2 pl-6 list-decimal text-slate-300" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-cyan-400 underline decoration-cyan-400/30 hover:decoration-cyan-400 transition-colors" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = typeof props.className === 'string' && props.className.includes('language-');
    if (isBlock) {
      return <code {...props} />;
    }
    return (
      <code className="rounded bg-navy-800 px-1.5 py-0.5 text-sm text-cyan-300 font-mono" {...props} />
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mb-4 overflow-x-auto rounded-xl border border-navy-700 bg-navy-900 p-4 text-sm font-mono text-slate-300" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mb-4 border-l-4 border-cyan-500 pl-4 italic text-slate-400" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-sm text-slate-300" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-navy-700 px-4 py-2 text-left font-semibold text-white" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-navy-800 px-4 py-2" {...props} />
  ),
  hr: () => <hr className="my-8 border-navy-700" />,
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-custom">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
