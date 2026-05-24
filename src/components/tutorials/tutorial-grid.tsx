"use client";

import { useMemo, useState } from "react";
import { TUTORIAL_CATEGORIES, TUTORIAL_DIFFICULTIES, TUTORIAL_TIERS } from "@/lib/constants";
import type { Tutorial } from "@/lib/types";
import { TutorialCard } from "./tutorial-card";

type CategoryFilter = "all" | Tutorial["category"];
type DifficultyFilter = "all" | Tutorial["difficulty"];
type TierFilter = "all" | Tutorial["tier"];

interface TutorialGridProps {
  tutorials: Tutorial[];
}

interface FilterButtonProps<T extends string> {
  label: string;
  value: T;
  selected: T;
  onSelect: (value: T) => void;
}

function FilterButton<T extends string>({
  label,
  value,
  selected,
  onSelect,
}: FilterButtonProps<T>) {
  const isSelected = selected === value;

  return (
    <button
      aria-pressed={isSelected}
      className={[
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        isSelected
          ? "border-accent bg-accent text-white"
          : "border-border bg-bg-secondary text-text-secondary hover:border-border-hover hover:text-text-primary",
      ].join(" ")}
      type="button"
      onClick={() => onSelect(value)}
    >
      {label}
    </button>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: Array<{ label: string; value: T }>;
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            selected={selected}
            value={option.value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function TutorialGrid({ tutorials }: TutorialGridProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [tier, setTier] = useState<TierFilter>("all");

  const filteredTutorials = useMemo(
    () =>
      tutorials.filter((tutorial) => {
        const categoryMatches = category === "all" || tutorial.category === category;
        const difficultyMatches =
          difficulty === "all" || tutorial.difficulty === difficulty;
        const tierMatches = tier === "all" || tutorial.tier === tier;

        return categoryMatches && difficultyMatches && tierMatches;
      }),
    [category, difficulty, tier, tutorials],
  );

  return (
    <section className="space-y-8">
      <div className="grid gap-6 rounded-xl border border-border bg-bg-card p-6 shadow-card">
        <FilterGroup<CategoryFilter>
          label="Category"
          options={[
            { label: "All", value: "all" },
            ...TUTORIAL_CATEGORIES.map((option) => ({
              label: option.label,
              value: option.value,
            })),
          ]}
          selected={category}
          onSelect={setCategory}
        />

        <FilterGroup<DifficultyFilter>
          label="Difficulty"
          options={[
            { label: "All", value: "all" },
            ...TUTORIAL_DIFFICULTIES.map((option) => ({
              label: option.label,
              value: option.value,
            })),
          ]}
          selected={difficulty}
          onSelect={setDifficulty}
        />

        <FilterGroup<TierFilter>
          label="Tier"
          options={[
            { label: "All", value: "all" },
            ...TUTORIAL_TIERS.map((option) => ({
              label: option.label,
              value: option.value,
            })),
          ]}
          selected={tier}
          onSelect={setTier}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          Showing {filteredTutorials.length} of {tutorials.length} tutorials
        </p>
      </div>

      {filteredTutorials.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.map((tutorial) => (
            <TutorialCard key={tutorial.slug} tutorial={tutorial} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-bg-card p-8 text-center shadow-card">
          <p className="text-sm text-text-secondary">
            No tutorials match the selected filters.
          </p>
        </div>
      )}
    </section>
  );
}
