import type { Chain } from '@/lib/schema';

export type BrandAppLink = {
  href: string;
  isVerifiedDeepLink: boolean;
};

export const brandAppLinks: Record<Chain, BrandAppLink> = {
  "McDonald's": {
    href: 'https://play.google.com/store/apps/details?id=com.mcdonalds.mobileapp',
    isVerifiedDeepLink: false,
  },
  'Burger King': {
    href: 'https://play.google.com/store/apps/details?id=kr.co.burgerkinghybrid',
    isVerifiedDeepLink: false,
  },
  KFC: {
    href: 'https://play.google.com/store/apps/details?id=kfc_ko.kore.kg.kfc_korea',
    isVerifiedDeepLink: false,
  },
  Lotteria: {
    href: 'https://play.google.com/store/apps/details?id=kr.co.angelinus.gift.m',
    isVerifiedDeepLink: false,
  },
  "Mom's Touch": {
    href: 'https://play.google.com/store/apps/details?id=kr.co.momstouch.moms',
    isVerifiedDeepLink: false,
  },
  'No Brand Burger': {
    href: 'https://play.google.com/store/apps/details?id=com.nbbmobileorder.shinsegaefood',
    isVerifiedDeepLink: false,
  },
};
