import { render, screen } from '@testing-library/react';

import fixture from '@/deals.json';
import { DealsFeed } from '@/components/DealsFeed';
import { dealsFileSchema } from '@/lib/schema';

const parsedFixture = dealsFileSchema.parse(fixture);

describe('DealsFeed', () => {
  it('renders the Burger Deal top bar and filter/sort trigger', () => {
    render(<DealsFeed data={parsedFixture} />);

    const topBar = screen.getByRole('banner');

    expect(topBar).toHaveTextContent('Burger Deal');
    expect(
      screen.getByRole('button', { name: '필터/정렬' }),
    ).toBeInTheDocument();
  });
});
