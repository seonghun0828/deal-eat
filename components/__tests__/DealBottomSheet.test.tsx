import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

import { DealBottomSheet } from '@/components/DealBottomSheet';
import { testDeals } from '@/lib/__tests__/fixtures';

const trackEvent = vi.fn();
const openBrandAppLink = vi.fn();
let mockedUserAgent = 'Mozilla/5.0 (Linux; Android 15)';

vi.mock('@/lib/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/analytics')>();

  return {
    ...actual,
    trackEvent: (...args: unknown[]) => trackEvent(...args),
  };
});

vi.mock('@/lib/brand-links', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/brand-links')>();

  return {
    ...actual,
    getBrandAppLink: (...args: unknown[]) => {
      const userAgent = args[1] as string;

      if (/Macintosh/i.test(userAgent)) {
        return null;
      }

      return actual.getBrandAppLink(args[0] as never, args[1] as never);
    },
    openBrandAppLink: (...args: unknown[]) => openBrandAppLink(...args),
  };
});

vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerBody: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  DrawerClose: ({
    asChild,
    children,
  }: {
    asChild?: boolean;
    children?: React.ReactNode;
  }) => (asChild ? <>{children}</> : <button type="button">{children}</button>),
  DrawerContent: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  DrawerDescription: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props}>{children}</p>
  ),
  DrawerHeader: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  DrawerTitle: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={className} {...props}>
      {children}
    </h2>
  ),
}));

describe('DealBottomSheet', () => {
  beforeEach(() => {
    trackEvent.mockClear();
    openBrandAppLink.mockClear();
    mockedUserAgent = 'Mozilla/5.0 (Linux; Android 15)';
    vi.stubGlobal('navigator', {
      userAgent: mockedUserAgent,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows usage details and coupon CTA for an app coupon deal', () => {
    const deal = testDeals.find(
      (candidate) => candidate.usage_mode === 'app_coupon',
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(screen.getByText('사용 정보')).toBeInTheDocument();
    expect(screen.getAllByText('앱 쿠폰').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: '앱에서 쿠폰 확인하기' }),
    ).toBeInTheDocument();
  });

  it('shows store-only info inside the sheet', () => {
    const deal = testDeals.find(
      (candidate) => candidate.in_store_only === true,
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(screen.getAllByText('매장 전용').length).toBeGreaterThan(0);
  });

  it('shows included items in the header description when present', () => {
    const deal = testDeals.find(
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

  it('tracks deal_coupon_in_app_click when the coupon CTA is pressed', async () => {
    const user = userEvent.setup();
    const deal = testDeals.find(
      (candidate) => candidate.usage_mode === 'app_coupon',
    );

    expect(deal).toBeDefined();

    render(
      <DealBottomSheet
        analyticsPayload={{
          chain: deal!.chain,
          deal_name: deal!.deal_name,
          usage_mode: deal!.usage_mode,
        }}
        deal={deal!}
        onOpenChange={vi.fn()}
        open
      />,
    );

    await user.click(screen.getByRole('button', { name: '앱에서 쿠폰 확인하기' }));

    expect(trackEvent).toHaveBeenCalledWith(
      'deal_coupon_in_app_click',
      expect.objectContaining({
        chain: deal!.chain,
        deal_name: deal!.deal_name,
        usage_mode: deal!.usage_mode,
      }),
    );
    expect(openBrandAppLink).toHaveBeenCalledWith(
      deal!.chain,
      expect.any(String),
      expect.objectContaining({
        assign: expect.any(Function),
      }),
    );
  });

  it('shows a mobile-only message on desktop instead of routing out', async () => {
    const user = userEvent.setup();
    const deal = testDeals.find(
      (candidate) => candidate.usage_mode === 'app_coupon',
    );

    expect(deal).toBeDefined();

    mockedUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0)';
    vi.stubGlobal('navigator', {
      userAgent: mockedUserAgent,
    });

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    await user.click(screen.getByRole('button', { name: '앱에서 쿠폰 확인하기' }));

    expect(screen.getByText('모바일 앱에서 확인해 주세요.')).toBeInTheDocument();
    expect(openBrandAppLink).not.toHaveBeenCalled();
  });
});
