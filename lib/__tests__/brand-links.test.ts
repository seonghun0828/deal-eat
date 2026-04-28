import {
  detectPlatform,
  getBrandAppLink,
  openBrandAppLink,
} from '@/lib/brand-links';

describe('brand links', () => {
  it('detects android and ios user agents', () => {
    expect(detectPlatform('Mozilla/5.0 (Linux; Android 15)')).toBe('android');
    expect(
      detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'),
    ).toBe('ios');
    expect(
      detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0)'),
    ).toBeNull();
  });

  it('returns an android deep link for android devices', () => {
    const link = getBrandAppLink("McDonald's", 'Mozilla/5.0 (Linux; Android 15)');

    expect(link.platform).toBe('android');
    expect(link.href.startsWith('intent://')).toBe(true);
  });

  it('returns an app store fallback for ios devices', () => {
    const link = getBrandAppLink(
      "McDonald's",
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
    );

    expect(link.platform).toBe('ios');
    expect(link.href).toContain('apps.apple.com');
  });

  it('returns no link for desktop devices', () => {
    const link = getBrandAppLink(
      "McDonald's",
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0)',
    );

    expect(link).toBeNull();
  });

  it('opens mobile links in-place and ignores desktop devices', () => {
    const assign = vi.fn();

    openBrandAppLink("McDonald's", 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0)', {
      assign,
    });
    expect(assign).not.toHaveBeenCalled();

    openBrandAppLink("McDonald's", 'Mozilla/5.0 (Linux; Android 15)', {
      assign,
    });
    expect(assign).toHaveBeenCalledTimes(1);
  });
});
