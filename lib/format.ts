import type { Chain } from '@/lib/schema';

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

export const formatPrice = (value: number): string =>
  `₩${priceFormatter.format(value)}`;

export const formatShortDate = (value: string): string => {
  const parsed = new Date(`${value}T00:00:00+09:00`);
  return shortDateFormatter.format(parsed);
};

export const formatUpdatedAt = (value: string): string =>
  timestampFormatter.format(new Date(value));

export const formatChainName = (chain: Chain): string => chainDisplayNameMap[chain];
