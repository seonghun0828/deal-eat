'use client';

import { brandLogoMap } from '@/lib/brand-assets';
import { brandAppLinks } from '@/lib/brand-links';
import { trackEvent } from '@/lib/analytics';
import {
  formatCategory,
  formatChainName,
  formatPrice,
  formatShortDate,
  formatUsageMode,
} from '@/lib/format';
import { isNew } from '@/lib/isNew';
import type { Deal } from '@/lib/schema';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type DealBottomSheetProps = {
  analyticsPayload?: Record<
    string,
    string | number | boolean | null | undefined
  >;
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getCtaLabel = (deal: Deal) => {
  switch (deal.usage_mode) {
    case 'app_coupon':
      return '앱에서 쿠폰 확인하기';
    case 'app_order':
      return '앱에서 주문하기';
    case 'store_order':
    case 'general_promo':
    default:
      return '브랜드 앱에서 확인하기';
  }
};

export function DealBottomSheet({
  analyticsPayload,
  deal,
  open,
  onOpenChange,
}: DealBottomSheetProps) {
  if (!deal) {
    return <Drawer onOpenChange={onOpenChange} open={open} />;
  }

  const displayChain = formatChainName(deal.chain);
  const usageModeLabel = formatUsageMode(deal.usage_mode);
  const link = brandAppLinks[deal.chain];
  const showBadge = isNew(deal.launch_date);
  const badgeLabel = deal.is_relaunched ? '재출시' : 'NEW';
  const includedItemsSummary = deal.included_items?.join(' · ');

  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent aria-describedby="deal-bottom-sheet-description">
        <DrawerHeader>
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${deal.chain} logo`}
              className="h-14 w-14 rounded-full border border-[color:var(--line)] bg-white object-contain p-2"
              src={brandLogoMap[deal.chain]}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                {displayChain}
              </p>
              <DrawerTitle className="mt-1 text-left text-xl sm:text-2xl">
                {deal.deal_name}
              </DrawerTitle>
              {includedItemsSummary ? (
                <DrawerDescription
                  className="mt-2 text-left"
                  id="deal-bottom-sheet-description"
                >
                  {includedItemsSummary}
                </DrawerDescription>
              ) : null}
            </div>
            {showBadge ? (
              <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-sm font-semibold text-white">
                {badgeLabel}
              </span>
            ) : null}
          </div>
        </DrawerHeader>

        <DrawerBody className="mt-5 space-y-6">
          <section className="rounded-[28px] border border-[color:var(--line)] bg-white/70 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-wrap items-end gap-3">
                <strong className="text-4xl font-semibold text-[color:var(--accent)]">
                  {formatPrice(deal.deal_price)}
                </strong>
                {deal.original_price ? (
                  <span className="text-base text-[color:var(--muted)] line-through">
                    {formatPrice(deal.original_price)}
                  </span>
                ) : null}
              </div>
              <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-sm font-semibold">
                {deal.discount_pct}% 할인
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[color:var(--panel-strong)] px-3 py-2 text-sm">
                {formatCategory(deal.category)}
              </span>
              {usageModeLabel ? (
                <span className="rounded-full bg-[color:var(--panel-strong)] px-3 py-2 text-sm">
                  {usageModeLabel}
                </span>
              ) : null}
              {deal.in_store_only ? (
                <span className="rounded-full bg-[color:var(--panel-strong)] px-3 py-2 text-sm">
                  매장 전용
                </span>
              ) : null}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              사용 정보
            </h3>
            <div className="rounded-[28px] border border-[color:var(--line)] bg-white/70 p-5">
              <dl className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-[color:var(--muted)]">
                    사용 기한
                  </dt>
                  <dd className="text-right font-medium">
                    {formatShortDate(deal.valid_through)}까지
                  </dd>
                </div>
                {usageModeLabel ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-[color:var(--muted)]">
                      사용 방식
                    </dt>
                    <dd className="text-right font-medium">{usageModeLabel}</dd>
                  </div>
                ) : null}
                {deal.in_store_only ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-[color:var(--muted)]">
                      이용 장소
                    </dt>
                    <dd className="text-right font-medium">매장 전용</dd>
                  </div>
                ) : null}
                {deal.notes ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-[color:var(--muted)]">비고</dt>
                    <dd className="max-w-[70%] text-right font-medium">
                      {deal.notes}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              href={link.href}
              onClick={() =>
                trackEvent('deal_coupon_in_app_click', analyticsPayload ?? {})
              }
              rel="noreferrer"
              target="_blank"
            >
              {getCtaLabel(deal)}
            </a>
            <DrawerClose asChild>
              <button
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold"
                type="button"
              >
                닫기
              </button>
            </DrawerClose>
          </div>

          {!link.isVerifiedDeepLink ? (
            <p className="text-xs text-[color:var(--muted)]">
              현재 CTA는 브랜드 앱 링크 설정을 기반으로 연결됩니다. 실제 쿠폰
              화면으로 바로 이동하는 딥링크는 브랜드별로 추가 확인이 필요해요.
            </p>
          ) : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
