# TODOS

## Chain logo assets

**What:** Source or create SVG logos for all 6 chains. Store as `public/logos/{chain-slug}.svg` with filenames keyed to the chain enum: `mcdonalds.svg`, `burger-king.svg`, `kfc.svg`, `lotteria.svg`, `moms-touch.svg`, `no-brand-burger.svg`.

**Why:** Broken/missing logos on launch undermine credibility on a feed that's primarily visual. Remote URLs add a network dependency and can break if the source changes.

**Pros:** Visual polish, no external dependency, logo lookup is a simple `chain → filename` mapping.

**Cons:** Need to obtain permission or use official brand assets carefully. SVG sourcing takes time.

**Context:** Chain enum is locked: `"McDonald's" | "Burger King" | "KFC" | "Lotteria" | "Mom's Touch" | "No Brand Burger"`. Logo filenames should be slug versions of these values. The DealCard component will map chain name → filename at render time.

**Depends on:** Nothing. Can start immediately.

---

## KakaoTalk Plus Friend channel eligibility

**What:** Confirm whether KakaoTalk Plus Friend channel can be created as an individual or requires business registration (사업자등록증).

**Why:** If business registration is required, v2 (KakaoTalk notification channel) has a significant setup blocker that needs lead time. Knowing this before v1 ships avoids being surprised after validating demand.

**Pros:** Unblocks v2 timeline planning. If individual registration is possible, v2 can start immediately after v1 validation.

**Cons:** None — just research.

**Context:** v2 is the KakaoTalk channel that sends Monday morning deal summaries. It solves the retention problem that v1 (static page with no push) cannot fix alone. See design doc for full v2 scope.

**Depends on:** Nothing. Can investigate immediately. Target: answer this before end of Week 1.
