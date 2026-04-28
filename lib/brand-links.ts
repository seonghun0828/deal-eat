import type { Chain } from '@/lib/schema';

export type Platform = 'android' | 'ios';

export type PlatformAppLink = {
  href: string;
  fallbackHref: string;
  isVerifiedDeepLink: boolean;
};

export type BrandAppLink = {
  android: PlatformAppLink;
  ios: PlatformAppLink;
};

const appStoreLinks: Record<Chain, string> = {
  "McDonald's": 'https://apps.apple.com/kr/app/%EB%A7%A5%EB%8F%84%EB%82%A0%EB%93%9C/id1217507712',
  'Burger King': 'https://apps.apple.com/kr/app/%EB%B2%84%EA%B1%B0%ED%82%B9-%ED%96%84%EB%B2%84%EA%B1%B0-%ED%82%B9%EC%98%A4%EB%8D%94-%EB%94%9C%EB%A6%AC%EB%B2%84%EB%A6%AC/id1017567032',
  KFC: 'https://apps.apple.com/kr/app/kfc-korea/id1255799839',
  Lotteria: 'https://apps.apple.com/us/app/%EB%A1%AF%EB%8D%B0%EC%9E%87%EC%B8%A0-lotteeatz/id939521328?l=ko',
  "Mom's Touch": 'https://apps.apple.com/kr/app/%EB%A7%98%EC%8A%A4%ED%84%B0%EC%B9%98/id6475806498',
  'No Brand Burger': 'https://apps.apple.com/us/app/%EB%85%B8%EB%B8%8C%EB%9E%9C%EB%93%9C%EB%B2%84%EA%B1%B0/id1576782382',
};

const playStoreLinks: Record<Chain, string> = {
  "McDonald's":
    'https://play.google.com/store/apps/details?id=com.mcdonalds.mobileapp&hl=ko',
  'Burger King':
    'https://play.google.com/store/apps/details?id=kr.co.burgerkinghybrid&hl=ko',
  KFC:
    'https://play.google.com/store/apps/details?id=kfc_ko.kore.kg.kfc_korea&hl=ko',
  Lotteria:
    'https://play.google.com/store/apps/details?id=kr.co.angelinus.gift.m&hl=ko',
  "Mom's Touch":
    'https://play.google.com/store/apps/details?id=kr.co.momstouch.moms&hl=ko',
  'No Brand Burger':
    'https://play.google.com/store/apps/details?id=com.nbbmobileorder.shinsegaefood&hl=ko',
};

export const brandAppLinks: Record<Chain, BrandAppLink> = {
  "McDonald's": {
    android: {
      href: 'intent://www.mcdonaldsapps.com/app#Intent;scheme=https;package=com.mcdonalds.mobileapp;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.mcdonalds.mobileapp%26hl%3Dko;end',
      fallbackHref: playStoreLinks["McDonald's"],
      isVerifiedDeepLink: false,
    },
    ios: {
      href: appStoreLinks["McDonald's"],
      fallbackHref: appStoreLinks["McDonald's"],
      isVerifiedDeepLink: false,
    },
  },
  'Burger King': {
    android: {
      href: 'intent://#Intent;scheme=burgerking;package=kr.co.burgerkinghybrid;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkr.co.burgerkinghybrid%26hl%3Dko;end',
      fallbackHref: playStoreLinks['Burger King'],
      isVerifiedDeepLink: false,
    },
    ios: {
      href: appStoreLinks['Burger King'],
      fallbackHref: appStoreLinks['Burger King'],
      isVerifiedDeepLink: false,
    },
  },
  KFC: {
    android: {
      href: 'intent://main#Intent;scheme=kfcremaster;package=kfc_ko.kore.kg.kfc_korea;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkfc_ko.kore.kg.kfc_korea%26hl%3Dko;end',
      fallbackHref: playStoreLinks.KFC,
      isVerifiedDeepLink: false,
    },
    ios: {
      href: appStoreLinks.KFC,
      fallbackHref: appStoreLinks.KFC,
      isVerifiedDeepLink: false,
    },
  },
  Lotteria: {
    android: {
      href: 'intent://run#Intent;scheme=lottegrs;package=kr.co.angelinus.gift.m;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkr.co.angelinus.gift.m%26hl%3Dko;end',
      fallbackHref: playStoreLinks.Lotteria,
      isVerifiedDeepLink: false,
    },
    ios: {
      href: appStoreLinks.Lotteria,
      fallbackHref: appStoreLinks.Lotteria,
      isVerifiedDeepLink: false,
    },
  },
  "Mom's Touch": {
    android: {
      href: 'intent://default#Intent;scheme=moms;package=kr.co.momstouch.moms;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dkr.co.momstouch.moms%26hl%3Dko;end',
      fallbackHref: playStoreLinks["Mom's Touch"],
      isVerifiedDeepLink: false,
    },
    ios: {
      href: appStoreLinks["Mom's Touch"],
      fallbackHref: appStoreLinks["Mom's Touch"],
      isVerifiedDeepLink: false,
    },
  },
  'No Brand Burger': {
    android: {
      href: 'intent://#Intent;scheme=nobrandburger;package=com.nbbmobileorder.shinsegaefood;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.nbbmobileorder.shinsegaefood%26hl%3Dko;end',
      fallbackHref: playStoreLinks['No Brand Burger'],
      isVerifiedDeepLink: false,
    },
    ios: {
      href: appStoreLinks['No Brand Burger'],
      fallbackHref: appStoreLinks['No Brand Burger'],
      isVerifiedDeepLink: false,
    },
  },
};

export function detectPlatform(userAgent: string): Platform | null {
  if (/Android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  }

  return null;
}

export function getBrandAppLink(chain: Chain, userAgent: string) {
  const platform = detectPlatform(userAgent);

  if (platform === null) {
    return null;
  }

  const config = brandAppLinks[chain];
  const selected = platform === 'android' ? config.android : config.ios;

  return {
    platform,
    ...selected,
  };
}

export function openBrandAppLink(
  chain: Chain,
  userAgent: string,
  deps?: {
    assign?: (href: string) => void;
  },
) {
  const link = getBrandAppLink(chain, userAgent);

  if (!link) {
    return;
  }

  deps?.assign?.(link.href);
}
