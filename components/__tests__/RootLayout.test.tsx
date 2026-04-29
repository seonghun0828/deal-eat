import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const googleTagManagerSpy = vi.fn(
  ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>,
);
const notoSansKrSpy = vi.fn(() => ({
  className: 'font-noto-sans-kr',
  style: {
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  variable: '--font-body',
}));

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: (props: { gtmId: string }) => googleTagManagerSpy(props),
}));

vi.mock('next/font/google', () => ({
  Noto_Sans_KR: (config: unknown) => notoSansKrSpy(config),
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
    notoSansKrSpy.mockClear();
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
        url: '/og-placeholder.png',
        width: 1200,
      },
    ]);
    expect(layoutModule.metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: ['/og-placeholder.png'],
    });
  });

  it('applies the Noto Sans KR font class to the body', async () => {
    const layoutModule = await import('@/app/layout');
    const RootLayout = layoutModule.default;
    const element = RootLayout({
      children: <div>child</div>,
    });

    expect(element.props.children.props.className).toBe('font-noto-sans-kr');
    expect(notoSansKrSpy).toHaveBeenCalled();
  });
});
