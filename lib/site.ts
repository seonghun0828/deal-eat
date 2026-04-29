export const defaultSiteUrl = 'https://burgerdeal.co.kr';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;
}
