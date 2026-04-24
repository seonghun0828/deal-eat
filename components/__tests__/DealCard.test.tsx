import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import fixture from '@/deals.json';
import { DealCard } from '@/components/DealCard';
import { dealsFileSchema } from '@/lib/schema';

const parsedFixture = dealsFileSchema.parse(fixture);

function getDealByName(dealName: string) {
  const deal = parsedFixture.deals.find(
    (candidate) => candidate.deal_name === dealName,
  );

  if (!deal) {
    throw new Error(`Fixture deal not found: ${dealName}`);
  }

  return deal;
}

describe('DealCard', () => {
  it('renders the main fields', () => {
    render(
      <DealCard
        deal={parsedFixture.deals[0]!}
        now={new Date('2026-04-21T12:00:00+09:00')}
      />,
    );

    expect(screen.getByText('맥스파이시 상하이 버거')).toBeInTheDocument();
    expect(screen.getByText('36% 할인')).toBeInTheDocument();
    expect(screen.getByText('4. 27.까지')).toBeInTheDocument();
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('shows the new badge and in-store label for a recent in-store-only deal', () => {
    render(
      <DealCard
        deal={getDealByName('빵치짜만원박스')}
        now={new Date('2026-04-21T12:00:00+09:00')}
      />,
    );

    expect(screen.getByText('빵치짜만원박스')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '자세히 보기' })).toBeInTheDocument();
  });

  it('calls onSeeMore when the button is clicked', async () => {
    const user = userEvent.setup();
    const onSeeMore = vi.fn();

    render(
      <DealCard
        deal={parsedFixture.deals[0]!}
        now={new Date('2026-04-21T12:00:00+09:00')}
        onSeeMore={onSeeMore}
      />,
    );

    await user.click(screen.getByRole('button', { name: '자세히 보기' }));
    expect(onSeeMore).toHaveBeenCalledWith(parsedFixture.deals[0]);
  });
});
