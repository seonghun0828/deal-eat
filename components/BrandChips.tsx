'use client';

import { formatChainName } from '@/lib/format';
import { chainEnum, type Chain } from '@/lib/schema';

type BrandChipsProps = {
  selectedChains: Chain[];
  onSelectedChainsChange: (selectedChains: Chain[]) => void;
  onOpenFilterSort: () => void;
  isFilterSortOpen?: boolean;
};

export function BrandChips({
  selectedChains,
  onSelectedChainsChange,
  onOpenFilterSort,
  isFilterSortOpen = false,
}: BrandChipsProps) {
  const toggleChain = (chain: Chain) => {
    const nextSelectedChains = selectedChains.includes(chain)
      ? selectedChains.filter((selected) => selected !== chain)
      : [...selectedChains, chain];

    onSelectedChainsChange(nextSelectedChains);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        aria-label="브랜드 필터"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 pr-1"
        role="group"
      >
        <button
          aria-pressed={selectedChains.length === 0}
          className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
            selectedChains.length === 0
              ? 'bg-[color:var(--accent)] text-white'
              : 'border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--foreground)]'
          }`}
          onClick={() => onSelectedChainsChange([])}
          type="button"
        >
          전체
        </button>
        {chainEnum.options.map((chain) => {
          const selected = selectedChains.includes(chain);

          return (
            <button
              aria-pressed={selected}
              className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                selected
                  ? 'bg-[color:var(--accent)] text-white'
                  : 'border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--foreground)]'
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

      <button
        aria-label="필터/정렬"
        aria-expanded={isFilterSortOpen}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--panel-strong)] p-3 text-sm font-semibold text-[color:var(--foreground)] shadow-[0_12px_32px_rgba(102,67,31,0.08)]"
        onClick={onOpenFilterSort}
        type="button"
      >
        <FilterSortIcon />
      </button>
    </div>
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
