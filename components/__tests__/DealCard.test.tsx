import { render, screen } from "@testing-library/react";

import fixture from "@/deals.json";
import { DealCard } from "@/components/DealCard";

describe("DealCard", () => {
  it("renders the main fields", () => {
    render(<DealCard deal={fixture.deals[0]} now={new Date("2026-04-21T12:00:00+09:00")} />);

    expect(screen.getByText("빅맥 세트 할인")).toBeInTheDocument();
    expect(screen.getByText("24% off")).toBeInTheDocument();
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("shows the relaunch badge for relaunched items", () => {
    render(<DealCard deal={fixture.deals[4]} now={new Date("2026-04-21T12:00:00+09:00")} />);

    expect(screen.getByText("돌아왔어요")).toBeInTheDocument();
  });
});

