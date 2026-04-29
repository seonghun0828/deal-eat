import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const googleTagManagerSpy = vi.fn(
  ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>,
);
const interSpy = vi.fn(() => ({
  className: 'font-inter',
  style: {
    fontFamily: '"Inter", sans-serif',
  },
}));

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: (props: { gtmId: string }) => googleTagManagerSpy(props),
}));

vi.mock('next/font/google', () => ({
  Inter: (config: unknown) => interSpy(config),
}));

const originalGtmId = process.env.NEXT_PUBLIC_GTM_ID;

async function renderLayout() {
  const layoutModule = await import('@/app/layout');
  const RootLayout = layoutModule.default;

  return render(<RootLayout>{<div>child</div>}</RootLayout>);
}

describe('RootLayout', () => {
  beforeEach(() => {
    vi.resetModules();
    googleTagManagerSpy.mockClear();
    interSpy.mockClear();
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

  it('exports SEO metadata for canonical, open graph, and twitter cards', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://burgerdeal.co.kr';

    const layoutModule = await import('@/app/layout');

    expect(layoutModule.metadata.metadataBase?.toString()).toBe(
      'https://burgerdeal.co.kr/',
    );
    expect(layoutModule.metadata.alternates?.canonical).toBe('/');
    expect(layoutModule.metadata.openGraph?.images).toEqual([
      {
        alt: 'Burger Deal 대표 이미지',
        height: 630,
        url: '/assets/og_image.png',
        width: 1200,
      },
    ]);
    expect(layoutModule.metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: ['/assets/og_image.png'],
    });
  });

  it('applies the Inter font class to the body', async () => {
    const layoutModule = await import('@/app/layout');
    const RootLayout = layoutModule.default;
    const element = RootLayout({
      children: <div>child</div>,
    });

    expect(element.props.children.props.className).toBe('font-inter');
    expect(interSpy).toHaveBeenCalled();
  });
});
