# DealEat Spec

## Product

DealEat is a Korean fast food coupon aggregator. v1 is a read-only weekly feed
that shows current deals from six chains in one mobile-friendly page.

Included chains:

- McDonald's
- Burger King
- KFC
- Lotteria
- Mom's Touch
- No Brand Burger

## v1 Scope

- static web feed
- one main route: `/`
- manually curated weekly data
- no accounts
- no notifications
- no backend
- no scraping automation in the first implementation pass

The main user promise is: compare weekly burger deals without opening six apps.

## Stack

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS
- Zod
- Vitest
- React Testing Library
- Playwright
- Vercel

## Data Model

Top-level `deals.json` shape:

```json
{
  "updated_at": "2026-04-14T09:00:00+09:00",
  "deals": [],
  "unavailable_chains": []
}
```

### Chain Enum

Use these exact strings:

- `"McDonald's"`
- `"Burger King"`
- `"KFC"`
- `"Lotteria"`
- `"Mom's Touch"`
- `"No Brand Burger"`

### Category Enum

- `hamburger_single`
- `hamburger_combo`
- `hamburger_set`
- `side`
- `drink`
- `combo_other`

### Required Deal Fields

- `chain`
- `deal_name`
- `deal_price`
- `discount_pct`
- `valid_through`
- `category`

### Optional Deal Fields

- `original_price`
- `launch_date`
- `is_relaunched`
- `in_store_only`
- `notes`

### Validation Rules

- `discount_pct` is recorded from the source app display and is never derived
  as the stored source of truth
- when `original_price` is present, validate that `discount_pct` is within +/-1
  of the computed rounded percentage
- `deals` contains only complete records, not placeholders
- missing chain data goes in `unavailable_chains`

## Computed Behavior

### `is_new`

`is_new` is never stored in `deals.json`. It is computed in the UI using KST
date-string comparison.

Rules:

- missing `launch_date` -> `false`
- `launch_date` within the last 14 days in `Asia/Seoul` -> `true`

Badge rules:

- new item + `is_relaunched !== true` -> `NEW`
- new item + `is_relaunched === true` -> `재출시`

## UI Requirements

### Main Page

- single scrolling list of deal cards
- filter/sort control near top-right
- visible staleness indicator using `updated_at`
- empty state when no deals match active filters

### Deal Card

- chain logo
- deal name
- deal price
- original price with strikethrough when present
- discount percent
- valid-through date
- `NEW` or `재출시` badge when applicable

If a logo is missing, fall back to text instead of a broken image.

### Filters

- Brand multi-select with `All` as default behavior
- Max Price slider
- default max price filter value: `13000`
- slider max:
  `Math.max(20000, Math.ceil(maxDealPrice / 1000) * 1000)`

### Sort

- Highest Discount:
  `discount_pct` descending
- Hamburgers First:
  `hamburger_single = hamburger_combo = hamburger_set -> combo_other -> side -> drink`
  then `discount_pct` descending within each group
- New/Re-released First:
  new items first, then `discount_pct` descending

Placeholder cards for `unavailable_chains` render after real deal cards,
regardless of sort mode.

### Empty State

Show:

- `이 조건에 맞는 할인이 없어요`
- reset action to clear filters and show the full list again

## Weekly Workflow

1. Remove expired deals where `valid_through < today`
2. Add current deals
3. Update `updated_at`
4. Validate the file
5. Commit and push

If `deals[]` changes, `updated_at` must also change.

## Deferred Items

- logo asset sourcing for all six chains
- KakaoTalk Plus Friend eligibility research
