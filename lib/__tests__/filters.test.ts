import {
  applyFiltersAndSort,
  filterDeals,
  getSliderMax,
  sortDeals,
  type FiltersState,
} from "@/lib/filters";
import { testDeals as deals } from "@/lib/__tests__/fixtures";

describe("filters", () => {
  it("filters by selected chain", () => {
    const result = filterDeals(deals, ["KFC"], 20000);
    expect(result).toHaveLength(1);
    expect(result.every((deal) => deal.chain === "KFC")).toBe(true);
  });

  it("filters by max price", () => {
    const result = filterDeals(deals, [], 5000);
    expect(result.every((deal) => deal.deal_price <= 5000)).toBe(true);
    expect(result.some((deal) => deal.chain === "McDonald's")).toBe(true);
    expect(result.some((deal) => deal.chain === "Lotteria")).toBe(true);
  });

  it("hides expired deals based on KST date", () => {
    const now = new Date("2026-04-28T12:00:00+09:00");
    const result = filterDeals(deals, [], 20000, now);

    expect(result.some((deal) => deal.deal_name === "트위스터 콤보")).toBe(false);
    expect(result.some((deal) => deal.deal_name === "감자튀김")).toBe(true);
  });

  it("sorts by highest discount", () => {
    const result = sortDeals(deals, "highest_discount");
    expect(result[0].chain).toBe("KFC");
    expect(result[0].discount_pct).toBe(48);
  });

  it("sorts hamburgers first with single/combo/set treated as the same priority", () => {
    const result = sortDeals(deals, "hamburgers_first");
    const firstNonHamburgerIndex = result.findIndex(
      (deal) =>
        !["hamburger_single", "hamburger_combo", "hamburger_set"].includes(
          deal.category,
        ),
    );

    expect(firstNonHamburgerIndex).toBeGreaterThan(0);
    expect(
      result
        .slice(0, firstNonHamburgerIndex)
        .every((deal) =>
          ["hamburger_single", "hamburger_combo", "hamburger_set"].includes(
            deal.category,
          ),
        ),
    ).toBe(true);
    expect(result.slice(0, 5).map((deal) => deal.discount_pct)).toEqual([
      36,
      35,
      33,
      31,
      26,
    ]);
  });

  it("sorts new items first", () => {
    const now = new Date("2026-04-21T12:00:00+09:00");
    const result = sortDeals(deals, "new_first", now);

    expect(result[0].deal_name).toBe("빵치짜만원박스");
    expect(result[1].deal_name).toBe("트위스터 콤보");
  });

  it("applies filters and sort together", () => {
    const filters: FiltersState = {
      selectedChains: ["McDonald's", "Burger King"],
      maxPrice: 7000,
      sortMode: "highest_discount",
    };

    const result = applyFiltersAndSort(deals, filters);
    expect(result.every((deal) => deal.chain !== "KFC")).toBe(true);
    expect(result.every((deal) => deal.deal_price <= 7000)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].discount_pct).toBeGreaterThanOrEqual(result[1].discount_pct);
  });

  it("computes the slider max with the minimum floor", () => {
    expect(getSliderMax(deals)).toBe(20000);
  });
});
