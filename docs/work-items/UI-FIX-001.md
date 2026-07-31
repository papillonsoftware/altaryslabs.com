# UI-FIX-001 - LegalPage specificity collision

**Type** FIX | **Status** OPEN, not started | **Raised by** the R1 review of UI-001

**Decision** D038 in `docs/DECISIONS.md`.

## The defect

`src/components/LegalPage.astro` styles slotted legal copy with
`.legal-body :global(p)`. That selector, at (0,2,1), also captures the two
paragraphs the component renders itself, `.legal-updated` and `.legal-prevails`,
whose own rules sit at (0,2,0) and therefore lose.

Verified on the rendered page: both paragraphs compute `rgb(154, 167, 190)` at
`14.5px`, `line-height 26.1px`, `margin-bottom 16px`, exactly like ordinary body
copy. Colour, size, leading **and the intended 40px separation** are all lost.

## Why it matters

On four public pages, the "Derniere mise a jour" line and the English notice
that the French version prevails no longer read as metadata. They look like the
first paragraph of the legal document itself. The English notice in particular
is a legal disclaimer that is supposed to stand apart.

The contrast happens to be fine, because `--muted` is a high-contrast value.
That is luck, not design.

## Scope when it is picked up

- Restore the two intended styles, either by raising their specificity or by
  moving the two paragraphs out of `.legal-body`.
- Re-check that slotted legal copy is unaffected.
- `--ink-60` is already in place on both rules, so the fix cannot reintroduce
  the 2.09:1 and 3.61:1 ratios that UI-001 removed.
- Verify on all four legal pages, FR and EN, at 360, 768 and 1440 px.

## Why UI-001 did not fix it

UI-001 scoped itself to installing the light surface family without changing
what any page renders. Restoring these two rules changes the rendering of four
public pages, which is a different item with its own visual verification. The
R1 review accepted that split and required only that this item exist before
UI-001 merges.
