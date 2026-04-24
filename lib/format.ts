import type { Category, Chain, UsageMode } from '@/lib/schema';

const priceFormatter = new Intl.NumberFormat('ko-KR');

const shortDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
});

const timestampFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const chainDisplayNameMap: Record<Chain, string> = {
  "McDonald's": '맥도날드',
  'Burger King': '버거킹',
  KFC: 'KFC',
  Lotteria: '롯데리아',
  "Mom's Touch": '맘스터치',
  'No Brand Burger': '노브랜드 버거',
};

const usageModeDisplayNameMap: Record<
  Exclude<UsageMode, 'general_promo'>,
  string
> = {
  app_coupon: '앱 쿠폰',
  app_order: '앱 주문',
  store_order: '매장 주문',
};

const categoryDisplayNameMap: Record<Category, string> = {
  hamburger_single: '단품 버거',
  hamburger_combo: '버거 콤보',
  hamburger_set: '버거 세트',
  side: '사이드',
  drink: '음료',
  combo_other: '기타 콤보',
};

export const formatPrice = (value: number): string =>
  `₩${priceFormatter.format(value)}`;

export const formatShortDate = (value: string): string => {
  const parsed = new Date(`${value}T00:00:00+09:00`);
  return shortDateFormatter.format(parsed);
};

export const formatUpdatedAt = (value: string): string =>
  timestampFormatter.format(new Date(value));

export const formatChainName = (chain: Chain): string =>
  chainDisplayNameMap[chain];

export const formatUsageMode = (usageMode: UsageMode): string | undefined =>
  usageMode === 'general_promo'
    ? undefined
    : usageModeDisplayNameMap[usageMode];

export const formatCategory = (category: Category): string =>
  categoryDisplayNameMap[category];
