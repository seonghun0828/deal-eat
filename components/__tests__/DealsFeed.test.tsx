import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import fixture from '@/deals.json';
import { DealsFeed } from '@/components/DealsFeed';
import { dealsFileSchema } from '@/lib/schema';

const trackEvent = vi.fn();

vi.mock('@/lib/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/analytics')>();

  return {
    ...actual,
    trackEvent: (...args: unknown[]) => trackEvent(...args),
  };
});

const parsedFixture = dealsFileSchema.parse(fixture);

describe('DealsFeed', () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it('renders the Burger Deal top bar and filter/sort trigger', () => {
    render(<DealsFeed data={parsedFixture} />);

    const topBar = screen.getByRole('banner');

    expect(topBar).toHaveTextContent('Burger Deal');
    expect(
      screen.getByRole('button', { name: '필터/정렬' }),
    ).toBeInTheDocument();
  });

  it('tracks deal_view_more_click when opening a deal bottom sheet', async () => {
    const user = userEvent.setup();

    render(<DealsFeed data={parsedFixture} />);

    await user.click(screen.getAllByRole('button', { name: '자세히 보기' })[0]!);

    expect(trackEvent).toHaveBeenCalledWith(
      'deal_view_more_click',
      expect.objectContaining({
        chain: 'KFC',
        deal_name: '트위스터 콤보',
        position: 1,
        sort_mode: 'highest_discount',
        selected_chains: '',
      }),
    );
  });

  it('tracks filter_sort_close_unchanged when the modal closes without changes', async () => {
    const user = userEvent.setup();

    render(<DealsFeed data={parsedFixture} />);

    await user.click(screen.getByRole('button', { name: '필터/정렬' }));
    await user.click(screen.getByRole('button', { name: '닫기' }));

    expect(trackEvent).toHaveBeenCalledWith('filter_sort_close_unchanged', {
      selected_chains: '',
      selected_chain_count: 0,
      max_price: 13000,
      sort_mode: 'highest_discount',
    });
  });

  it('tracks filter_sort_commit with the final filter state when the modal closes after changes', async () => {
    const user = userEvent.setup();

    render(<DealsFeed data={parsedFixture} />);

    await user.click(screen.getByRole('button', { name: '필터/정렬' }));
    await user.click(screen.getByRole('button', { name: 'KFC' }));
    await user.click(screen.getByRole('radio', { name: '햄버거 먼저' }));
    await user.click(screen.getByRole('button', { name: '닫기' }));

    expect(trackEvent).toHaveBeenCalledWith('filter_sort_commit', {
      selected_chains: 'KFC',
      selected_chain_count: 1,
      max_price: 13000,
      sort_mode: 'hamburgers_first',
    });
  });
});
