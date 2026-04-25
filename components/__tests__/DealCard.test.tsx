import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DealCard } from '@/components/DealCard';
import type { Deal } from '@/lib/schema';

const baseDeal: Deal = {
  chain: "McDonald's",
  deal_name: '테스트 버거',
  deal_price: 3800,
  discount_pct: 36,
  category: 'hamburger_single',
  usage_mode: 'app_coupon',
  valid_through: '2026-04-27',
};

describe('DealCard', () => {
  it('renders the main fields', () => {
    render(
      <DealCard
        deal={baseDeal}
        now={new Date('2026-04-21T12:00:00+09:00')}
      />,
    );

    expect(screen.getByText('테스트 버거')).toBeInTheDocument();
    expect(screen.getByText('36% 할인')).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'SPAN' &&
          element.textContent?.includes('까지') === true,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('shows the new badge and in-store label for a recent in-store-only deal', () => {
    render(
      <DealCard
        deal={{
          ...baseDeal,
          chain: 'KFC',
          deal_name: '최근 출시 테스트 딜',
          launch_date: '2026-04-18',
          in_store_only: true,
        }}
        now={new Date('2026-04-21T12:00:00+09:00')}
      />,
    );

    expect(screen.getByText('최근 출시 테스트 딜')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '자세히 보기' })).toBeInTheDocument();
  });

  it('calls onSeeMore when the button is clicked', async () => {
    const user = userEvent.setup();
    const onSeeMore = vi.fn();

    render(
      <DealCard
        deal={baseDeal}
        now={new Date('2026-04-21T12:00:00+09:00')}
        onSeeMore={onSeeMore}
      />,
    );

    await user.click(screen.getByRole('button', { name: '자세히 보기' }));
    expect(onSeeMore).toHaveBeenCalledWith(baseDeal);
  });
});
