"use client";

import type { Chain } from "@/lib/schema";
import type { FiltersState, SortMode } from "@/lib/filters";

const CHAINS: Chain[] = [
  "McDonald's",
  "Burger King",
  "KFC",
  "Lotteria",
  "Mom's Touch",
  "No Brand Burger",
];

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: "highest_discount", label: "Highest Discount" },
  { value: "hamburgers_first", label: "Hamburgers First" },
  { value: "new_first", label: "New/Re-released First" },
];

type FilterSortModalProps = {
  filters: FiltersState;
  sliderMax: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFiltersChange: (next: FiltersState) => void;
};

export function FilterSortModal({
  filters,
  sliderMax,
  isOpen,
  onOpenChange,
  onFiltersChange,
}: FilterSortModalProps) {
  const toggleChain = (chain: Chain) => {
    const selectedChains = filters.selectedChains.includes(chain)
      ? filters.selectedChains.filter((selected) => selected !== chain)
      : [...filters.selectedChains, chain];

    onFiltersChange({
      ...filters,
      selectedChains,
    });
  };

  return (
    <section className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] p-4 shadow-[0_18px_50px_rgba(102,67,31,0.10)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
            Controls
          </p>
          <h2 className="mt-1 text-lg font-semibold">Filter and sort deals</h2>
        </div>
        <button
          className="min-h-11 rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() => onOpenChange(!isOpen)}
          type="button"
        >
          {isOpen ? "Close" : "Open"} filters
        </button>
      </div>

      {isOpen ? (
        <div className="mt-5 space-y-6 border-t border-[color:var(--line)] pt-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Brand
              </h3>
              <button
                className="min-h-11 rounded-full border border-[color:var(--line)] px-4 py-2 text-sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    selectedChains: [],
                  })
                }
                type="button"
              >
                All
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHAINS.map((chain) => {
                const selected = filters.selectedChains.includes(chain);

                return (
                  <button
                    aria-pressed={selected}
                    className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium ${
                      selected
                        ? "bg-[color:var(--accent)] text-white"
                        : "border border-[color:var(--line)] bg-white"
                    }`}
                    key={chain}
                    onClick={() => toggleChain(chain)}
                    type="button"
                  >
                    {chain}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Max Price
              </h3>
              <span className="text-sm font-semibold">₩{filters.maxPrice.toLocaleString("ko-KR")}</span>
            </div>
            <input
              aria-label="Max Price"
              className="mt-3 h-11 w-full"
              max={sliderMax}
              min={0}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  maxPrice: Number(event.target.value),
                })
              }
              step={1000}
              type="range"
              value={filters.maxPrice}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Sort
            </legend>
            <div className="mt-3 grid gap-2">
              {sortOptions.map((option) => (
                <label
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white px-4 py-3"
                  key={option.value}
                >
                  <input
                    checked={filters.sortMode === option.value}
                    name="sort-mode"
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        sortMode: option.value,
                      })
                    }
                    type="radio"
                    value={option.value}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}
    </section>
  );
}

