'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'ai', label: 'AI' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'automation', label: 'Automation' },
];

const difficulties = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const tiers = [
  { value: '', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
];

export function TutorialFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleFilter = (name: string, value: string) => {
    router.push(`/tutorials?${createQueryString(name, value)}`);
  };

  const selectStyles =
    'rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={searchParams.get('category') ?? ''}
        onChange={(e) => handleFilter('category', e.target.value)}
        className={selectStyles}
        aria-label="Filter by category"
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('difficulty') ?? ''}
        onChange={(e) => handleFilter('difficulty', e.target.value)}
        className={selectStyles}
        aria-label="Filter by difficulty"
      >
        {difficulties.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('tier') ?? ''}
        onChange={(e) => handleFilter('tier', e.target.value)}
        className={selectStyles}
        aria-label="Filter by access tier"
      >
        {tiers.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
