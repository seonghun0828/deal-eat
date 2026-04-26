import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const googleTagManagerSpy = vi.fn(
  ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>,
);

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: (props: { gtmId: string }) => googleTagManagerSpy(props),
}));

const originalGtmId = process.env.NEXT_PUBLIC_GTM_ID;

async function renderLayout() {
  const layoutModule = await import('@/app/layout');
  const RootLayout = layoutModule.default;

  render(<RootLayout>{<div>child</div>}</RootLayout>);
}

describe('RootLayout', () => {
  beforeEach(() => {
    vi.resetModules();
    googleTagManagerSpy.mockClear();
  });

  afterEach(() => {
    if (originalGtmId === undefined) {
      delete process.env.NEXT_PUBLIC_GTM_ID;
      return;
    }

    process.env.NEXT_PUBLIC_GTM_ID = originalGtmId;
  });

  it('renders GTM when NEXT_PUBLIC_GTM_ID is configured', async () => {
    process.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST123';

    await renderLayout();

    expect(screen.getByTestId('gtm')).toHaveTextContent('GTM-TEST123');
  });

  it('does not render GTM when NEXT_PUBLIC_GTM_ID is missing', async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;

    await renderLayout();

    expect(screen.queryByTestId('gtm')).not.toBeInTheDocument();
  });
});
