import type { Deal, DealsFile } from '@/lib/schema';

export const baseDeal: Deal = {
  chain: "McDonald's",
  deal_name: '테스트 버거',
  deal_price: 3800,
  discount_pct: 36,
  category: 'hamburger_single',
  usage_mode: 'app_coupon',
  valid_through: '2026-05-04',
};

export const testDeals: Deal[] = [
  {
    chain: 'KFC',
    deal_name: '트위스터 콤보',
    original_price: 6400,
    deal_price: 3300,
    discount_pct: 48,
    category: 'combo_other',
    usage_mode: 'general_promo',
    included_items: ['트위스터', '탄산음료M'],
    valid_through: '2026-04-27',
  },
  {
    ...baseDeal,
    deal_name: '맥스파이시 상하이 버거',
  },
  {
    chain: 'Burger King',
    deal_name: '크리스퍼 세트',
    original_price: 13900,
    deal_price: 8900,
    discount_pct: 35,
    category: 'hamburger_set',
    usage_mode: 'app_coupon',
    included_items: [
      '더 크리스퍼 베이컨&치즈',
      '코카콜라(R)',
      '프렌치프라이(R)',
    ],
    valid_through: '2026-05-03',
  },
  {
    chain: 'KFC',
    deal_name: '빵치짜만원박스',
    original_price: 14900,
    deal_price: 10000,
    discount_pct: 33,
    category: 'hamburger_set',
    usage_mode: 'app_coupon',
    launch_date: '2026-04-14',
    included_items: [
      '살라미빵치짜',
      '핫크리스피통다리',
      '코울슬로',
      '콜라M',
    ],
    valid_through: '2026-05-04',
    in_store_only: true,
  },
  {
    chain: "McDonald's",
    deal_name: '슈비 버거',
    deal_price: 4300,
    discount_pct: 31,
    category: 'hamburger_single',
    usage_mode: 'app_order',
    valid_through: '2026-05-04',
    notes: 'M오더 전용',
  },
  {
    chain: 'Lotteria',
    deal_name: '리아 새우 베이컨 콤보',
    deal_price: 4900,
    discount_pct: 26,
    category: 'hamburger_combo',
    usage_mode: 'app_coupon',
    valid_through: '2026-05-04',
  },
  {
    chain: 'No Brand Burger',
    deal_name: '감자튀김',
    deal_price: 1700,
    discount_pct: 34,
    category: 'side',
    usage_mode: 'store_order',
    valid_through: '2026-05-04',
  },
];

export const testDealsFile: DealsFile = {
  updated_at: '2026-04-22T10:50:00+09:00',
  deals: testDeals,
  unavailable_chains: ["Mom's Touch"],
};
