import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BrandChips } from '@/components/BrandChips';
import type { Chain } from '@/lib/schema';

describe('BrandChips', () => {
  it('renders the brand chip rail with a persistent filter/sort action', () => {
    render(
      <BrandChips
        onOpenFilterSort={vi.fn()}
        onSelectedChainsChange={vi.fn()}
        selectedChains={[]}
      />,
    );

    expect(screen.getByRole('group', { name: '브랜드 필터' })).toHaveClass(
      'min-w-0',
      'overflow-x-auto',
    );
    expect(screen.getByRole('button', { name: '필터/정렬' })).toHaveClass(
      'shrink-0',
    );
    expect(screen.getByRole('button', { name: '필터/정렬' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
    expect(screen.getByRole('button', { name: '전체' })).toHaveClass(
      'bg-[color:var(--accent)]',
      'text-white',
    );
  });

  it('selects and clears brand filters from the chip rail', async () => {
    const user = userEvent.setup();
    const onSelectedChainsChange = vi.fn();

    const { rerender } = render(
      <BrandChips
        onOpenFilterSort={vi.fn()}
        onSelectedChainsChange={onSelectedChainsChange}
        selectedChains={[]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'KFC' }));
    expect(onSelectedChainsChange).toHaveBeenCalledWith(['KFC']);

    rerender(
      <BrandChips
        onOpenFilterSort={vi.fn()}
        onSelectedChainsChange={onSelectedChainsChange}
        selectedChains={['KFC'] as Chain[]}
      />,
    );

    expect(screen.getByRole('button', { name: 'KFC' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: '전체' }));
    expect(onSelectedChainsChange).toHaveBeenCalledWith([]);
  });
});
