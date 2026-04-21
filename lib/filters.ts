import type { Chain, Deal } from "./schema";
import { isNew } from "./isNew";

export const HAMBURGERS_FIRST_ORDER = [
  "hamburger_single",
  "hamburger_set",
  "combo_other",
  "side",
  "drink",
] as const;

export type SortMode =
  | "highest_discount"
  | "hamburgers_first"
  | "new_first";

export type FiltersState = {
  selectedChains: Chain[];
  maxPrice: number;
  sortMode: SortMode;
};

const categoryOrder = new Map(
  HAMBURGERS_FIRST_ORDER.map((category, index) => [category, index]),
);

const byDiscountDesc = (left: Deal, right: Deal) =>
  right.discount_pct - left.discount_pct;

export const DEFAULT_MAX_PRICE = 13000;

export const getSliderMax = (deals: Deal[]): number => {
  const maxDealPrice = Math.max(0, ...deals.map((deal) => deal.deal_price));
  return Math.max(20000, Math.ceil(maxDealPrice / 1000) * 1000);
};

export const filterDeals = (
  deals: Deal[],
  selectedChains: Chain[],
  maxPrice: number,
): Deal[] =>
  deals.filter((deal) => {
    const matchesChain =
      selectedChains.length === 0 || selectedChains.includes(deal.chain);
    return matchesChain && deal.deal_price <= maxPrice;
  });

export const sortDeals = (
  deals: Deal[],
  sortMode: SortMode,
  now = new Date(),
): Deal[] => {
  const sorted = [...deals];

  switch (sortMode) {
    case "hamburgers_first":
      return sorted.sort((left, right) => {
        const leftOrder = categoryOrder.get(left.category) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = categoryOrder.get(right.category) ?? Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return byDiscountDesc(left, right);
      });
    case "new_first":
      return sorted.sort((left, right) => {
        const leftNew = isNew(left.launch_date, now);
        const rightNew = isNew(right.launch_date, now);

        if (leftNew !== rightNew) {
          return Number(rightNew) - Number(leftNew);
        }

        return byDiscountDesc(left, right);
      });
    case "highest_discount":
    default:
      return sorted.sort(byDiscountDesc);
  }
};

export const applyFiltersAndSort = (
  deals: Deal[],
  filters: FiltersState,
  now = new Date(),
): Deal[] =>
  sortDeals(
    filterDeals(deals, filters.selectedChains, filters.maxPrice),
    filters.sortMode,
    now,
  );

