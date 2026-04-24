# AGENTS.md

## Purpose

This repository implements DealEat, a Korean fast food coupon aggregator.
The product goal for v1 is a read-only weekly feed that shows current in-store
coupon deals across these six chains:

- McDonald's
- Burger King
- KFC
- Lotteria
- Mom's Touch
- No Brand Burger

The core user promise is simple: open one page and compare this week's burger
deals without checking six separate apps.

## Source Of Truth

Implementation must follow these sources, in this order:

1. This `AGENTS.md`
2. Repo-local implementation files and tests
3. `/Users/hoon/.gstack/projects/seonghun0828-deal-eat/hoon-main-design-20260417-172123.md`
4. `/Users/hoon/.gstack/projects/seonghun0828-deal-eat/hoon-main-eng-review-test-plan-20260417-215516.md`
5. `TODOS.md` for deferred or follow-up work

If the docs conflict, prefer the more specific product/data rule over general
descriptions. Keep behavior aligned with the approved design and test plan.

## Locked Stack

Use this stack unless the user explicitly changes it:

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS
- Vercel
- Zod
- Vitest
- React Testing Library
- Playwright

Superpowers is installed for Codex CLI and should be used to support a
test-first workflow. The expected implementation style is TDD:

1. Write or update the failing test
2. Implement the minimum code to pass
3. Refactor while keeping tests green

Do not defer tests until the end unless the user explicitly asks for that.

## Implementation Priorities

Build in this order unless blocked:

1. Project scaffold and test harness
2. `deals.json` schema and validation script
3. Pure domain logic (`schema`, `filters`, `isNew`)
4. Component tests and UI components
5. Main page composition
6. E2E coverage
7. CI validation and deploy readiness

This is a static/feed-first product. Do not introduce a backend, auth, or data
storage system for v1.

## Required File Structure

The target structure for v1 is:

```text
deals.json
scripts/validate-deals.ts
app/page.tsx
components/DealCard.tsx
components/FilterSortModal.tsx
lib/schema.ts
lib/filters.ts
lib/isNew.ts
public/logos/{chain-slug}.svg
```

Additional config and test files should be added as needed for Next.js,
TypeScript, Tailwind, Vitest, RTL, Playwright, and GitHub Actions.

## Product Constraints

- v1 is read-only
- No accounts
- No notifications
- No backend
- No scraping automation in the first implementation pass
- Data is manually curated weekly
- The main route is `/`
- Mobile web is the primary target

Do not expand scope into v2 KakaoTalk features during v1 implementation unless
the user explicitly asks for it.

## Data Contract

The top-level `deals.json` shape is:

```json
{
  "updated_at": "2026-04-14T09:00:00+09:00",
  "deals": [],
  "unavailable_chains": []
}
```

### Chain Enum

Use these exact strings everywhere:

- `"McDonald's"`
- `"Burger King"`
- `"KFC"`
- `"Lotteria"`
- `"Mom's Touch"`
- `"No Brand Burger"`

This enum is used for:

- `deal.chain`
- `unavailable_chains[]`
- logo filename lookup

### Category Enum

Use these exact values:

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
- `usage_mode`
- `valid_through`
- `category`

### Optional Deal Fields

- `original_price`
- `launch_date`
- `is_relaunched`
- `in_store_only`
- `notes`

### Validation Rules

- `discount_pct` is sourced from the chain app display and is never computed as
  the stored value of record
- if `original_price` is present, validation must confirm `discount_pct` is
  within +/-1 of the computed rounded discount percentage
- validation errors should be specific enough to identify the broken record
- `deals` must not contain placeholders or null records
- `unavailable_chains` represents chains with no data for the current week

### Usage Mode Rules

`usage_mode` describes how the discount is activated. `in_store_only`
separately describes where it can be redeemed. They are not mutually exclusive.

Allowed `usage_mode` values:

- `app_coupon`
- `app_order`
- `store_order`
- `general_promo`

Recommended Korean display labels:

- `app_coupon` -> `앱 쿠폰`
- `app_order` -> `앱 주문`
- `store_order` -> `매장 주문`
- `general_promo` -> no fixed compact label; surface it only when the context
  needs explanation

### Newness Rules

`is_new` is computed in the UI and must never be stored in `deals.json`.

Use KST date-string comparison, not timestamp math, to avoid UTC/KST boundary
bugs. The rule is:

- if `launch_date` is missing, `is_new` is false
- if `launch_date` is within the last 14 days in `Asia/Seoul`, `is_new` is true

If `is_relaunched` is true and the item is new by date, the UI badge should be
`재출시`; otherwise use `NEW`.

## UI Requirements

### Main Feed

- Single scrolling list of deal cards
- Header with a visible staleness indicator using `updated_at`
- Filter/sort entry point near the top-right
- Empty state when filters return zero results

### Deal Card Contents

- chain logo
- deal name
- deal price
- original price with strikethrough when present
- discount percentage
- valid-through date
- `NEW` or `재출시` badge when applicable

If a logo asset is missing, the UI must fall back to rendering the chain name
instead of showing a broken image.

### Filter And Sort Behavior

Filters:

- Brand multi-select with `All` default behavior
- Max Price slider with default 13,000 KRW
- Slider max range:
  `Math.max(20000, Math.ceil(maxDealPrice / 1000) * 1000)`

Sort options:

- Highest Discount: `discount_pct` descending
- Hamburgers First: category order
  `hamburger_single = hamburger_combo = hamburger_set -> combo_other -> side -> drink`
  with secondary sort by `discount_pct` descending
- New/Relaunched First: new items first, then secondary sort by
  `discount_pct` descending

Placeholder cards for `unavailable_chains` must render after real deals,
regardless of active sort order.

### Empty State

When no deals match, show:

- `"이 조건에 맞는 할인이 없어요"`
- a reset action that clears filters and restores the full list

## Testing Requirements

The approved minimum test targets are:

- `lib/__tests__/schema.test.ts`
- `lib/__tests__/filters.test.ts`
- `lib/__tests__/isNew.test.ts`
- `components/__tests__/DealCard.test.tsx`
- `components/__tests__/FilterSortModal.test.tsx`
- `e2e/empty-state.spec.ts`

Critical behavior to cover:

- valid and invalid schema parsing
- brand filtering
- max-price filtering
- each sort mode
- combined filter + sort behavior
- 14-day `isNew` boundary cases
- placeholder rendering for unavailable chains
- empty-state reset flow

Tests should be added before or alongside implementation, not retrofitted at
the end.

## Weekly Operations

The intended weekly update process is:

1. Remove expired deals where `valid_through < today`
2. Add this week's new deals
3. Update `updated_at`
4. Validate the JSON
5. Commit and push

If `deals[]` changes, `updated_at` must also change.

## CI Requirements

Add a GitHub Actions workflow at `.github/workflows/validate.yml` that runs the
validation script on push. CI should fail when:

- `deals.json` does not match schema
- `discount_pct` validation fails
- `updated_at` was not updated when `deals[]` changed

CI should exist early in the implementation, not as a final cleanup task.

## Working Style For Codex

- prefer small, test-backed steps
- keep domain logic pure where possible
- avoid hidden coupling between UI and data parsing
- when editing code, follow the repo or global formatter output instead of
  preserving conflicting quote or spacing styles by hand
- preserve exact enum strings from the approved docs
- do not compute business behavior differently in tests and production code
- keep KST handling explicit

When implementing a feature, first check whether the change belongs in:

- schema validation
- pure filtering/sorting logic
- UI rendering
- test fixtures
- CI or scripts

Prefer fixing the correct layer instead of patching symptoms in the page.

## Out Of Scope For Initial Implementation

- KakaoTalk channel integration
- automated scraping
- user accounts
- personalization
- admin panel
- backend APIs
- database setup

## Open Items To Track Separately

These are known follow-ups, not blockers for core v1 implementation:

- sourcing or creating local SVG logos for all six chains
- confirming KakaoTalk Plus Friend eligibility requirements
