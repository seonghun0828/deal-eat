import fixture from "@/deals.json";
import { dealsFileSchema } from "@/lib/schema";

describe("dealsFileSchema", () => {
  it("parses a valid deals file", () => {
    expect(() => dealsFileSchema.parse(fixture)).not.toThrow();
  });

  it("rejects an invalid chain enum", () => {
    const invalid = {
      ...fixture,
      deals: [
        {
          ...fixture.deals[0],
          chain: "Shake Shack",
        },
      ],
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow();
  });

  it("rejects discount percentages that do not match the original price", () => {
    const invalid = {
      ...fixture,
      deals: [
        {
          ...fixture.deals[0],
          discount_pct: 99,
        },
      ],
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow(
      /doesn't match computed/,
    );
  });
});

