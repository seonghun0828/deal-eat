import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

import fixture from '@/deals.json';
import { DealBottomSheet } from '@/components/DealBottomSheet';
import { dealsFileSchema } from '@/lib/schema';

const trackEvent = vi.fn();

vi.mock('@/lib/analytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/analytics')>();

  return {
    ...actual,
    trackEvent: (...args: unknown[]) => trackEvent(...args),
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

const parsedFixture = dealsFileSchema.parse(fixture);

describe('DealBottomSheet', () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it('shows usage details and coupon CTA for an app coupon deal', () => {
    const deal = parsedFixture.deals.find(
      (candidate) => candidate.usage_mode === 'app_coupon',
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(screen.getByText('사용 정보')).toBeInTheDocument();
    expect(screen.getAllByText('앱 쿠폰').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: '앱에서 쿠폰 확인하기' }),
    ).toBeInTheDocument();
  });

  it('shows store-only info inside the sheet', () => {
    const deal = parsedFixture.deals.find(
      (candidate) => candidate.in_store_only === true,
    );

    expect(deal).toBeDefined();

    render(<DealBottomSheet deal={deal!} onOpenChange={vi.fn()} open />);

    expect(screen.getAllByText('매장 전용').length).toBeGreaterThan(0);
  });

  it('shows included items in the header description when present', () => {
    const deal = parsedFixture.deals.find(
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
    const deal = parsedFixture.deals.find(
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

    await user.click(
      screen.getByRole('link', { name: '앱에서 쿠폰 확인하기' }),
    );

    expect(trackEvent).toHaveBeenCalledWith(
      'deal_coupon_in_app_click',
      expect.objectContaining({
        chain: deal!.chain,
        deal_name: deal!.deal_name,
        usage_mode: deal!.usage_mode,
      }),
    );
  });
});
