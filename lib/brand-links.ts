import type { Chain } from '@/lib/schema';

export type BrandAppLink = {
  href: string;
  isVerifiedDeepLink: boolean;
};

export const brandAppLinks: Record<Chain, BrandAppLink> = {
  "McDonald's": {
    href: 'intent://www.mcdonaldsapps.com/app#Intent;scheme=https;package=com.mcdonalds.mobileapp;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.mcdonalds.mobileapp%26hl%3Dko;end',
    isVerifiedDeepLink: false,
  },
  'Burger King': {
    href: 'intent://#Intent;scheme=burgerking;package=kr.co.burgerkinghybrid;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkr.co.burgerkinghybrid%26hl%3Dko;end',
    isVerifiedDeepLink: false,
  },
  KFC: {
    href: 'intent://main#Intent;scheme=kfcremaster;package=kfc_ko.kore.kg.kfc_korea;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkfc_ko.kore.kg.kfc_korea%26hl%3Dko;end',
    isVerifiedDeepLink: false,
  },
  Lotteria: {
    href: 'intent://run#Intent;scheme=lottegrs;package=kr.co.angelinus.gift.m;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkr.co.angelinus.gift.m%26hl%3Dko;end',
    isVerifiedDeepLink: false,
  },
  "Mom's Touch": {
    href: 'intent://default#Intent;scheme=moms;package=kr.co.momstouch.moms;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkr.co.momstouch.moms%26hl%3Dko;end',
    isVerifiedDeepLink: false,
  },
  'No Brand Burger': {
    href: 'intent://#Intent;scheme=nobrandburger;package=com.nbbmobileorder.shinsegaefood;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.nbbmobileorder.shinsegaefood%26hl%3Dko;end',
    isVerifiedDeepLink: false,
  },
};
