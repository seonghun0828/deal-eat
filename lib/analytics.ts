'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import type { FiltersState } from '@/lib/filters';
import type { Deal } from '@/lib/schema';

type EventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(
  event: string,
  payload: EventPayload = {},
) {
  sendGTMEvent({
    event,
    ...payload,
  });
}

export function serializeSelectedChains(selectedChains: FiltersState['selectedChains']) {
  return [...selectedChains].sort().join('|');
}

export function buildFilterEventPayload(filters: FiltersState) {
  return {
    selected_chains: serializeSelectedChains(filters.selectedChains),
    selected_chain_count: filters.selectedChains.length,
    max_price: filters.maxPrice,
    sort_mode: filters.sortMode,
  };
}

export function buildDealEventPayload({
  deal,
  filters,
  position,
}: {
  deal: Deal;
  filters: FiltersState;
  position?: number;
}) {
  return {
    chain: deal.chain,
    deal_name: deal.deal_name,
    category: deal.category,
    discount_pct: deal.discount_pct,
    deal_price: deal.deal_price,
    usage_mode: deal.usage_mode,
    in_store_only: deal.in_store_only ?? false,
    position,
    sort_mode: filters.sortMode,
    selected_chains: serializeSelectedChains(filters.selectedChains),
    max_price: filters.maxPrice,
  };
}
