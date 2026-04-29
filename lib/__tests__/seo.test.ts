import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

describe('SEO routes', () => {
  it('exposes a single canonical sitemap entry for the home page', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://burgerdeal.co.kr';

    expect(sitemap()).toEqual([
      {
        changeFrequency: 'weekly',
        priority: 1,
        url: 'https://burgerdeal.co.kr',
      },
    ]);
  });

  it('allows indexing and points robots to the sitemap', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://burgerdeal.co.kr';

    expect(robots()).toEqual({
      host: 'https://burgerdeal.co.kr',
      rules: {
        allow: '/',
        userAgent: '*',
      },
      sitemap: 'https://burgerdeal.co.kr/sitemap.xml',
    });
  });
});
