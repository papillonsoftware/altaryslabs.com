# UI-REF-001 - Promote `.card-text.is-last` to the global stylesheet

**Type** REF | **Status** OPEN, not started | **Branch to create** `refactor/is-last-global`
**Base** `refonte-multipages`

**Decisions** D050 in `docs/DECISIONS.md`.

**Raised by** the R1 review of `PAGE-001`, suggestion 3.

## Why a REF

A visitor sees exactly the same page before and after. Executable style code moves. That is a refactor, not a chore and not a fix: nothing is broken today.

## The duplication

`.card-text.is-last { margin-bottom: 0 }` is declared in at least `AboutContent.astro` and `DomainGrid.astro`. Astro scoped styles force the repetition: a scoped rule cannot reach a sibling component, so each component that renders a `.card-text` as its last child redeclares the modifier.

That is the mechanism, not a justification. `is-last` has become a **shared modifier on a global primitive**: `.card-text` itself already lives in `global.css`. A modifier of a global class belongs next to the class it modifies, otherwise the next component that needs it will redeclare it a third time, and the three copies will drift.

## What to do

1. Count the real occurrences first. Do not trust this document's "at least two":
   ```
   grep -rn "is-last" src/
   ```
2. Add `.card-text.is-last { margin-bottom: 0 }` to `src/styles/global.css`, immediately after the `.card-text` rule so the pair reads as one unit.
3. Remove every scoped copy.
4. Verify nothing changed visually. Specificity is the risk: the global rule computes at (0,2,0), the scoped copies compute higher because Astro appends a data attribute. If a component relied on that extra weight to beat something else, removing the local copy will change the winner.

That last point is the whole reason this is a real item rather than a two-line edit. `UI-001` already hit this class of trap: `D036` records the light peritext being written `.section--light.section--light` precisely because component-scoped styles and global styles tie at (0,2,0) and the winner is decided by emission order, which varies by route. Check the same way here: if a `.card-text` sits in a component whose styles Astro emits **after** the global bundle, the global rule loses on a tie and the margin comes back.

## Verification

Capture the pages that render a `.card-text` before and after, at one width, and diff. `bin/review_shots` exists for exactly this. Pages to cover: at minimum `/a-propos` and any page consuming `DomainGrid`, plus their English counterparts.

If a tie is found, do **not** repeat the `.class.class` trick without recording why. Prefer making the last-child case structural (`.card-text:last-child`) if the markup allows it, and record the choice.

## Out of scope

Any other scoped-style consolidation. This item promotes one modifier. It is not a sweep of the styling architecture, and it must not become one.

## Acceptance criteria

1. `.card-text.is-last` is declared once, in `global.css`, next to `.card-text`.
2. `grep -rn "is-last" src/` shows no remaining scoped declaration.
3. Before and after captures are identical on every page that renders a `.card-text`, in both languages.
4. `npm run build` and `npm run check` green.
