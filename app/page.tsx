"use client";

import { useState } from "react";

import dealsJson from "@/deals.json";
import { DealCard } from "@/components/DealCard";
import { FilterSortModal } from "@/components/FilterSortModal";
import {
  applyFiltersAndSort,
  DEFAULT_MAX_PRICE,
  getSliderMax,
  type FiltersState,
} from "@/lib/filters";
import { dealsFileSchema } from "@/lib/schema";

const parsedDeals = dealsFileSchema.parse(dealsJson);
const sliderMax = getSliderMax(parsedDeals.deals);

const initialFilters: FiltersState = {
  selectedChains: [],
  maxPrice: Math.min(DEFAULT_MAX_PRICE, sliderMax),
  sortMode: "highest_discount",
};

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const visibleDeals = applyFiltersAndSort(parsedDeals.deals, filters);
  const hasResults = visibleDeals.length > 0;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6">
      <section className="rounded-[36px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[0_28px_80px_rgba(102,67,31,0.13)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
          Weekly Korean fast food deals
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">
              One feed for this week&apos;s burger decisions.
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[color:var(--muted)] sm:text-lg">
              Compare discounts from six Korean fast food chains without opening each app.
            </p>
          </div>
          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
            마지막 업데이트: {parsedDeals.updated_at}
          </div>
        </div>

        <div className="mt-6">
          <FilterSortModal
            filters={filters}
            isOpen={isOpen}
            onFiltersChange={setFilters}
            onOpenChange={setIsOpen}
            sliderMax={sliderMax}
          />
        </div>

        {hasResults ? (
          <div className="mt-6 grid gap-4">
            {visibleDeals.map((deal) => (
              <DealCard deal={deal} key={`${deal.chain}-${deal.deal_name}`} />
            ))}
            {parsedDeals.unavailable_chains.map((chain) => (
              <article
                className="rounded-[28px] border border-dashed border-[color:var(--line)] bg-white/60 p-5 text-[color:var(--muted)]"
                key={chain}
              >
                <p className="text-xs uppercase tracking-[0.2em]">{chain}</p>
                <h2 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">
                  데이터 없음 이번 주
                </h2>
                <p className="mt-2 text-sm">
                  This chain has no confirmed deal data in the current weekly feed.
                </p>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-6 rounded-[28px] border border-[color:var(--line)] bg-white/75 p-8 text-center">
            <p className="text-2xl font-semibold">이 조건에 맞는 할인이 없어요</p>
            <button
              className="mt-4 min-h-11 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              onClick={() => setFilters(initialFilters)}
              type="button"
            >
              Reset filters
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

