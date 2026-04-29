import { testDealsFile } from '@/lib/__tests__/fixtures';
import { dealsFileSchema } from '@/lib/schema';

const fixture = structuredClone(testDealsFile);

const dealWithOriginalPrice = fixture.deals.find(
  (deal) => deal.original_price !== undefined,
);

describe('dealsFileSchema', () => {
  it('parses a valid deals file', () => {
    expect(() => dealsFileSchema.parse(fixture)).not.toThrow();
  });

  it('requires usage_mode', () => {
    const invalid = {
      ...fixture,
      deals: fixture.deals.map(({ usage_mode, ...deal }, index) =>
        index === 0 ? deal : { ...deal, usage_mode },
      ),
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow();
  });

  it('rejects an invalid chain enum', () => {
    const invalid = {
      ...fixture,
      deals: [
        {
          ...fixture.deals[0],
          chain: 'Shake Shack',
        },
      ],
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow();
  });

  it("rejects discount percentages that do not match the original price", () => {
    expect(dealWithOriginalPrice).toBeDefined();

    const invalid = {
      ...fixture,
      deals: [
        {
          ...dealWithOriginalPrice!,
          discount_pct: 99,
        },
      ],
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow(
      /doesn't match computed/,
    );
  });

  it('rejects an invalid usage_mode', () => {
    const invalid = {
      ...fixture,
      deals: [
        {
          ...fixture.deals[0],
          usage_mode: 'coupon_book',
        },
      ],
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow();
  });

  it('rejects empty strings in included_items', () => {
    const invalid = {
      ...fixture,
      deals: [
        {
          ...fixture.deals[0],
          included_items: ['', '콜라'],
        },
      ],
    };

    expect(() => dealsFileSchema.parse(invalid)).toThrow();
  });
});
