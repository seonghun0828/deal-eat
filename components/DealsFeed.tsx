'use client';

import { useRef, useState } from 'react';

import { DealCard } from '@/components/DealCard';
import { DealBottomSheet } from '@/components/DealBottomSheet';
import { FilterSortModal } from '@/components/FilterSortModal';
import { UnavailableChainCard } from '@/components/UnavailableChainCard';
import {
  buildDealEventPayload,
  buildFilterEventPayload,
  trackEvent,
} from '@/lib/analytics';
import {
  applyFiltersAndSort,
  DEFAULT_MAX_PRICE,
  getSliderMax,
  type FiltersState,
} from '@/lib/filters';
import type { Deal, DealsFile } from '@/lib/schema';

type DealsFeedProps = {
  data: DealsFile;
};

export function DealsFeed({ data }: DealsFeedProps) {
  const sliderMax = getSliderMax(data.deals);
  const filterSnapshotRef = useRef<FiltersState | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    selectedChains: [],
    maxPrice: Math.min(DEFAULT_MAX_PRICE, sliderMax),
    sortMode: 'highest_discount',
  });

  const visibleDeals = applyFiltersAndSort(data.deals, filters);
  const hasResults = visibleDeals.length > 0;
  const selectedDealPosition =
    selectedDeal === null
      ? undefined
      : visibleDeals.findIndex(
          (deal) =>
            deal.chain === selectedDeal.chain &&
            deal.deal_name === selectedDeal.deal_name,
        ) + 1 || undefined;

  const handleFilterOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      filterSnapshotRef.current = {
        ...filters,
        selectedChains: [...filters.selectedChains],
      };
      setIsOpen(true);
      return;
    }

    if (isOpen) {
      const snapshot = filterSnapshotRef.current ?? {
        ...filters,
        selectedChains: [...filters.selectedChains],
      };
      const currentPayload = buildFilterEventPayload(filters);
      const snapshotPayload = buildFilterEventPayload(snapshot);
      const eventName =
        JSON.stringify(currentPayload) === JSON.stringify(snapshotPayload)
          ? 'filter_sort_close_unchanged'
          : 'filter_sort_commit';

      trackEvent(eventName, currentPayload);
    }

    setIsOpen(false);
  };

  const handleSeeMore = (deal: Deal) => {
    const position =
      visibleDeals.findIndex(
        (candidate) =>
          candidate.chain === deal.chain &&
          candidate.deal_name === deal.deal_name,
      ) + 1;

    trackEvent(
      'deal_view_more_click',
      buildDealEventPayload({
        deal,
        filters,
        position,
      }),
    );
    setSelectedDeal(deal);
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[color:var(--panel)]">
      <header className="px-4 pt-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg pl-1 pt-1 font-semibold uppercase tracking-[0.28em] text-[color:var(--foreground)]">
              Burger Deal
            </h1>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <FilterSortModal
            filters={filters}
            isOpen={isOpen}
            onFiltersChange={setFilters}
            onOpenChange={handleFilterOpenChange}
            sliderMax={sliderMax}
          />
        </div>
      </header>

      <section className="px-4 py-5 sm:px-6">
        {hasResults ? (
          <div className="grid gap-4">
            {visibleDeals.map((deal) => (
              <DealCard
                deal={deal}
                key={`${deal.chain}-${deal.deal_name}`}
                onSeeMore={handleSeeMore}
              />
            ))}
            {data.unavailable_chains.map((chain) => (
              <UnavailableChainCard chain={chain} key={chain} />
            ))}
          </div>
        ) : (
          <section className="rounded-[28px] border border-[color:var(--line)] bg-white/75 p-8 text-center">
            <p className="text-2xl font-semibold">
              이 조건에 맞는 할인이 없어요
            </p>
            <button
              className="mt-4 min-h-11 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              onClick={() =>
                setFilters({
                  selectedChains: [],
                  maxPrice: Math.min(DEFAULT_MAX_PRICE, sliderMax),
                  sortMode: 'highest_discount',
                })
              }
              type="button"
            >
              필터 초기화
            </button>
          </section>
        )}
      </section>
      <DealBottomSheet
        analyticsPayload={
          selectedDeal
            ? buildDealEventPayload({
                deal: selectedDeal,
                filters,
                position: selectedDealPosition,
              })
            : undefined
        }
        deal={selectedDeal}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDeal(null);
          }
        }}
        open={selectedDeal !== null}
      />
    </main>
  );
}
