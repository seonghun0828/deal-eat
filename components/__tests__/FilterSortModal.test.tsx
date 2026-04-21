import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FilterSortModal } from "@/components/FilterSortModal";
import type { FiltersState } from "@/lib/filters";

const baseFilters: FiltersState = {
  selectedChains: [],
  maxPrice: 13000,
  sortMode: "highest_discount",
};

describe("FilterSortModal", () => {
  it("opens and allows selecting a brand", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <FilterSortModal
        filters={baseFilters}
        isOpen={false}
        onFiltersChange={onFiltersChange}
        onOpenChange={onOpenChange}
        sliderMax={20000}
      />,
    );

    await user.click(screen.getByRole("button", { name: "필터 열기" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders options when open and changes sort mode", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    render(
      <FilterSortModal
        filters={baseFilters}
        isOpen
        onFiltersChange={onFiltersChange}
        onOpenChange={vi.fn()}
        sliderMax={20000}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "햄버거 먼저" }));
    expect(onFiltersChange).toHaveBeenCalledWith({
      ...baseFilters,
      sortMode: "hamburgers_first",
    });
  });

  it("marks All as active when no brand filter is applied", () => {
    render(
      <FilterSortModal
        filters={baseFilters}
        isOpen
        onFiltersChange={vi.fn()}
        onOpenChange={vi.fn()}
        sliderMax={20000}
      />,
    );

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
