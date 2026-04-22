import type { Chain, Deal } from '@/lib/schema';
import { formatChainName, formatPrice, formatShortDate } from '@/lib/format';
import { isNew } from '@/lib/isNew';

const logoMap: Record<Chain, string> = {
  "McDonald's": '/logos/mcdonalds.svg',
  'Burger King': '/logos/burger-king.svg',
  KFC: '/logos/kfc.svg',
  Lotteria: '/logos/lotteria.svg',
  "Mom's Touch": '/logos/moms-touch.svg',
  'No Brand Burger': '/logos/no-brand-burger.svg',
};

type DealCardProps = {
  deal: Deal;
  now?: Date;
};

export function DealCard({ deal, now = new Date() }: DealCardProps) {
  const showBadge = isNew(deal.launch_date, now);
  const badgeLabel = deal.is_relaunched ? '재출시' : 'NEW';
  const displayChain = formatChainName(deal.chain);
  const fallbackId = `${deal.chain}-fallback`;

  return (
    <article className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] p-5 shadow-[0_18px_50px_rgba(102,67,31,0.10)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${deal.chain} logo`}
            className="h-12 w-12 rounded-full border border-[color:var(--line)] bg-white object-contain p-2"
            src={logoMap[deal.chain]}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              const next = event.currentTarget
                .nextElementSibling as HTMLSpanElement | null;
              if (next) {
                next.hidden = false;
              }
            }}
          />
          <span
            className="hidden rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold"
            hidden
            id={fallbackId}
          >
            {displayChain}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
              {displayChain}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{deal.deal_name}</h2>
          </div>
        </div>
        {showBadge ? (
          <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-sm font-semibold text-white">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <strong className="text-3xl font-semibold text-[color:var(--accent)]">
            {formatPrice(deal.deal_price)}
          </strong>
          {deal.original_price ? (
            <span className="text-sm text-[color:var(--muted)] line-through">
              {formatPrice(deal.original_price)}
            </span>
          ) : null}
        </div>
        <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-sm font-semibold">
          {deal.discount_pct}% 할인
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
        <span className="rounded-full bg-[color:var(--panel-strong)] px-3 py-2">
          {formatShortDate(deal.valid_through)}까지
        </span>
        {deal.in_store_only ? (
          <span className="rounded-full bg-[color:var(--panel-strong)] px-3 py-2">
            매장 방문
          </span>
        ) : null}
        {deal.notes ? (
          <span className="rounded-full bg-[color:var(--panel-strong)] px-3 py-2">
            {deal.notes}
          </span>
        ) : null}
      </div>
    </article>
  );
}
