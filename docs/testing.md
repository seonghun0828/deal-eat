# Testing Plan

## Principle

Use a TDD workflow. Add or update tests before implementation whenever the
feature can be expressed as a stable contract.

## Required Test Files

- `lib/__tests__/schema.test.ts`
- `lib/__tests__/filters.test.ts`
- `lib/__tests__/isNew.test.ts`
- `components/__tests__/DealCard.test.tsx`
- `components/__tests__/FilterSortModal.test.tsx`
- `e2e/empty-state.spec.ts`

## Critical Behaviors

- valid and invalid `deals.json` schema parsing
- brand filter behavior, including `All`
- max-price filter behavior
- highest-discount sort
- hamburgers-first sort order
- new/re-released-first sort order
- combined filter + sort behavior
- `isNew` boundary cases:
  - exactly 14 days ago -> true
  - 15 days ago -> false
  - missing date -> false
- unavailable-chain placeholder rendering
- empty-state reset flow

## Expected Validation Coverage

- required field enforcement
- enum validation for chain and category values
- `discount_pct` cross-validation when `original_price` exists
- top-level `updated_at`, `deals`, and `unavailable_chains` shape validation

## E2E Minimum

The first Playwright path should cover:

1. load `/`
2. apply filters that produce zero results
3. confirm empty state appears
4. use reset action
5. confirm the list is restored

## CI Expectation

CI should fail when:

- schema validation fails
- `discount_pct` cross-validation fails
- `deals[]` changed without `updated_at` changing
