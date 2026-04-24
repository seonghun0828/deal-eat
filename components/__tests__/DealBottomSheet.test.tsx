import { render, screen } from '@testing-library/react';

import fixture from '@/deals.json';
import { DealBottomSheet } from '@/components/DealBottomSheet';
import { dealsFileSchema } from '@/lib/schema';

const parsedFixture = dealsFileSchema.parse(fixture);

describe('DealBottomSheet', () => {
  it('shows usage details and coupon CTA for an app coupon deal', () => {
    const deal = parsedFixture.deals.find(
      (candidate) => candidate.usage_mode === 'app_coupon',
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(screen.getByText('사용 정보')).toBeInTheDocument();
    expect(screen.getAllByText('앱 쿠폰').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: '앱에서 쿠폰 확인하기' }),
    ).toBeInTheDocument();
  });

  it('shows store-only info inside the sheet', () => {
    const deal = parsedFixture.deals.find(
      (candidate) => candidate.in_store_only === true,
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(screen.getAllByText('매장 전용').length).toBeGreaterThan(0);
  });

  it('shows included items in the header description when present', () => {
    const deal = parsedFixture.deals.find(
      (candidate) =>
        candidate.included_items !== undefined &&
        candidate.included_items.length > 0,
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(
      screen.getByText(deal!.included_items!.join(' · ')),
    ).toBeInTheDocument();
  });
});
