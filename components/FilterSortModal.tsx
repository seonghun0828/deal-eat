'use client';

import { useId } from 'react';

import { formatChainName } from '@/lib/format';
import type { FiltersState, SortMode } from '@/lib/filters';
import type { Chain } from '@/lib/schema';

const CHAINS: Chain[] = [
  "McDonald's",
  'Burger King',
  'KFC',
  'Lotteria',
  "Mom's Touch",
  'No Brand Burger',
];

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: 'highest_discount', label: '할인율 높은 순' },
  { value: 'hamburgers_first', label: '햄버거 먼저' },
  { value: 'new_first', label: '신규/재출시 먼저' },
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
  const titleId = useId();

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
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-2 text-sm font-semibold text-[color:var(--foreground)] shadow-[0_12px_32px_rgba(102,67,31,0.08)]"
        onClick={() => onOpenChange(true)}
        type="button"
      >
        <FilterSortIcon />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/35"
            onClick={() => onOpenChange(false)}
          />
          <section
            aria-labelledby={titleId}
            aria-modal="true"
            className="relative z-10 max-h-[min(80vh,720px)] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-[color:var(--line)] bg-[color:var(--panel)] p-5 shadow-[0_28px_80px_rgba(31,21,11,0.24)] backdrop-blur sm:p-6"
            role="dialog"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold" id={titleId}>
                필터와 정렬
              </h2>
              <button
                className="min-h-11 rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                닫기
              </button>
            </div>

            <div className="mt-5 space-y-6 border-t border-[color:var(--line)] pt-5">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    브랜드
                  </h3>
                  <button
                    aria-pressed={filters.selectedChains.length === 0}
                    className="min-h-11 rounded-full border border-[color:var(--line)] px-4 py-2 text-sm"
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        selectedChains: [],
                      })
                    }
                    type="button"
                  >
                    전체
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
                            ? 'bg-[color:var(--accent)] text-white'
                            : 'border border-[color:var(--line)] bg-white'
                        }`}
                        key={chain}
                        onClick={() => toggleChain(chain)}
                        type="button"
                      >
                        {formatChainName(chain)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    최대 가격
                  </h3>
                  <span className="text-sm font-semibold">
                    ₩{filters.maxPrice.toLocaleString('ko-KR')}
                  </span>
                </div>
                <input
                  aria-label="최대 가격"
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
                  정렬
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
          </section>
        </div>
      ) : null}
    </>
  );
}

function FilterSortIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h12M20 17h0.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="7" fill="currentColor" r="1.8" />
      <circle cx="9" cy="12" fill="currentColor" r="1.8" />
      <circle cx="18" cy="17" fill="currentColor" r="1.8" />
    </svg>
  );
}
