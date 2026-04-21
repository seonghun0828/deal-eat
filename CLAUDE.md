## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.claude/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
> cd ~/.claude/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing.
Use ~/.claude/skills/gstack/... for gstack file paths (the global path).

## Implementation

**Project:** DealEat — Korean fast food coupon aggregator (read-only weekly feed).

**Stack:** Next.js 15, App Router, TypeScript, Tailwind CSS, Vercel, Zod, Vitest + React Testing Library, Playwright (E2E).

**File structure:**
```
deals.json                        # hand-curated weekly data (root)
scripts/validate-deals.ts         # Zod validation — runs in CI before deploy
app/page.tsx                      # main feed page
components/DealCard.tsx           # single deal card
components/FilterSortModal.tsx    # filter/sort drawer
lib/schema.ts                     # Zod schema + Deal type + chain enum
lib/filters.ts                    # pure filter/sort functions
lib/isNew.ts                      # isNew(launch_date) helper
public/logos/{chain-slug}.svg     # local SVGs, one per chain
```

**deals.json top-level shape:**
```json
{
  "updated_at": "ISO timestamp (KST)",
  "deals": [ ...Deal[] ],
  "unavailable_chains": [ ...ChainEnum[] ]
}
```

**Chain enum (exact strings, enforced by Zod):**
`"McDonald's" | "Burger King" | "KFC" | "Lotteria" | "Mom's Touch" | "No Brand Burger"`
Used for: `chain` field, `unavailable_chains[]`, and logo filename lookup.

**Required deal fields:** `chain`, `deal_name`, `deal_price`, `discount_pct`, `valid_through`, `category`.
**Optional:** `original_price`, `launch_date`, `is_relaunched`, `in_store_only`, `notes`.
`discount_pct` is read directly from the chain app display — never computed.
When `original_price` is present, Zod `.refine()` validates `discount_pct` is within ±1 of the computed value.

**`category` enum:** `hamburger_single | hamburger_set | side | drink | combo_other`

**`is_new` — computed in UI, never stored:**
```ts
// Compare KST date strings, not timestamps (avoids UTC/KST boundary bugs)
const isNew = (launch_date?: string): boolean => {
  if (!launch_date) return false;
  const cutoff = todayKST(-14); // "YYYY-MM-DD" 14 days ago in Asia/Seoul
  return launch_date >= cutoff;
};
```

**Sort order for "Hamburgers First":** `hamburger_single → hamburger_set → combo_other → side → drink`. Secondary sort within each group: `discount_pct` descending.

**Max price slider range:** dynamic — `Math.max(20000, Math.ceil(maxDealPrice / 1000) * 1000)`. Default value: 13,000 KRW. Touch target: 44px minimum height.

**Weekly update workflow:** Remove expired deals (`valid_through < today`) → add new deals → update `updated_at` → commit → push. CI validates schema before Vercel deploys.

**CI gate:** `.github/workflows/validate.yml` runs `npx tsx scripts/validate-deals.ts` on every push. Blocks deploy if deals.json is invalid or `updated_at` wasn't updated alongside `deals[]`.

**Logo fallback:** `<img onError>` falls back to text chain name if SVG is missing.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
