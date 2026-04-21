import fixture from "@/deals.json";
import {
  applyFiltersAndSort,
  filterDeals,
  getSliderMax,
  sortDeals,
  type FiltersState,
} from "@/lib/filters";

const deals = fixture.deals;

describe("filters", () => {
  it("filters by selected chain", () => {
    const result = filterDeals(deals, ["KFC"], 20000);
    expect(result).toHaveLength(1);
    expect(result[0].chain).toBe("KFC");
  });

  it("filters by max price", () => {
    const result = filterDeals(deals, [], 5000);
    expect(result.map((deal) => deal.chain)).toEqual([
      "Burger King",
      "Mom's Touch",
    ]);
  });

  it("sorts by highest discount", () => {
    const result = sortDeals(deals, "highest_discount");
    expect(result[0].chain).toBe("Burger King");
  });

  it("sorts hamburgers first using the approved category order", () => {
    const result = sortDeals(deals, "hamburgers_first");
    expect(result[0].category).toBe("hamburger_single");
    expect(result[1].category).toBe("hamburger_single");
  });

  it("sorts new items first", () => {
    const now = new Date("2026-04-21T12:00:00+09:00");
    const result = sortDeals(deals, "new_first", now);

    expect(result[0].chain).toBe("Burger King");
    expect(result[1].chain).toBe("No Brand Burger");
  });

  it("applies filters and sort together", () => {
    const filters: FiltersState = {
      selectedChains: ["McDonald's", "Burger King"],
      maxPrice: 7000,
      sortMode: "highest_discount",
    };

    const result = applyFiltersAndSort(deals, filters);
    expect(result.map((deal) => deal.chain)).toEqual([
      "Burger King",
      "McDonald's",
    ]);
  });

  it("computes the slider max with the minimum floor", () => {
    expect(getSliderMax(deals)).toBe(20000);
  });
});

