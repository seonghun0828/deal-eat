import { render, screen } from '@testing-library/react';

import fixture from '@/deals.json';
import { DealCard } from '@/components/DealCard';

const recentInStoreOnlyDeal = fixture.deals.find(
  (deal) => deal.deal_name === '빵치짜만원박스',
);

describe('DealCard', () => {
  it('renders the main fields', () => {
    render(
      <DealCard
        deal={fixture.deals[0]}
        now={new Date('2026-04-21T12:00:00+09:00')}
      />,
    );

    expect(screen.getByText('맥스파이시 상하이 버거')).toBeInTheDocument();
    expect(screen.getByText('36% 할인')).toBeInTheDocument();
    expect(screen.getByText('4. 27.까지')).toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('shows the new badge and in-store label for a recent in-store-only deal', () => {
    expect(recentInStoreOnlyDeal).toBeDefined();

    render(
      <DealCard
        deal={recentInStoreOnlyDeal!}
        now={new Date('2026-04-21T12:00:00+09:00')}
      />,
    );

    expect(screen.getByText('빵치짜만원박스')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByText('매장 방문')).toBeInTheDocument();
  });
});
