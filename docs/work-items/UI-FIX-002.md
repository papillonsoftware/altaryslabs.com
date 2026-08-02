# UI-FIX-002 - About page and grid semantics

**Type** FIX | **Status** OPEN, not started | **Branch to create** `fix/semantique-grilles`
**Base** `refonte-multipages`

**Decisions** D050 in `docs/DECISIONS.md`.

**Raised by** the R1 review of `PAGE-001`, suggestions 1, 2 and 4. Those three were reported non-blocking and never applied. The two structural ones are grouped here because they are the same class of defect: the page looks correct and announces itself incorrectly.

## Why a FIX and not a chore

Nothing is broken for a sighted visitor. Something is broken for a visitor using a screen reader, and that visitor is a real user, not a hypothetical one. An intended behaviour exists (the page structure announces itself the way it reads) and it is wrong. That is the definition of a fix.

## Defect 1 - three principles with no announced parent

`src/components/AboutContent.astro:38` opens the "Notre approche" block with a `.section-label` eyebrow and **no `.section-title`**. The three cards below carry `h2` titles. A screen-reader user browsing by heading therefore lands on three principles hanging under nothing: the eyebrow is a `<p>`, so it is not in the heading tree at all.

Everywhere else on the site the eyebrow is paired with a section title, through `SectionHeader`. This block is the exception.

Two ways out, and they are not equivalent:

- **Add a short section title.** Keeps the eyebrow, restores the parent, costs one dictionary key per language. Needs founder copy.
- **Drop the eyebrow and let the cards stand alone**, the way `DomainGrid` already does. Costs nothing, removes a visual element the prototype has.

Check the root prototype before choosing: if `a-propos` at the project root carries a section title there, the first option is simply catching up with the handoff and needs no founder copy at all.

## Defect 2 - list semantics lost on four grids

`src/components/AboutContent.astro:40` renders `<ul class="grid-3 approach-grid">` with `list-style: none`. Safari with VoiceOver drops list semantics when `list-style: none` is applied, so the list is announced as loose text and the item count is lost.

The same pattern exists in `DomainGrid`, `FeatureGrid` and `ModuleGrid`. **Fix all four in the same pass** by adding `role="list"` to the `<ul>`. Fixing one is worse than fixing none: it makes the house convention inconsistent without making the site accessible.

Verify there is no fifth occurrence before starting:

```
grep -rn "list-style: none" src/
```

## Open question for the founder, do not decide alone

`AboutContent.astro:141` sets `.legal-line` at `font-size: 10.5px`. Contrast is fine since it moved to `--muted-soft` (6.51:1), so this is not an accessibility failure. But that line carries the RCCM number, and it is precisely the string a procurement officer will try to read on a phone before short-listing a supplier.

**Recommendation: 12px.** It costs nothing visually and the line is a credibility artefact, not decoration. The same 10.5px appears on the footer legal line; if the answer is yes, change both so they stay consistent.

The founder decides. Do not apply this without an answer, and do not silently drop it either.

## Out of scope

- Any colour change. The contrast work is done and lives in `CLAUDE.md` under the two accessibility rules.
- Any other page. This item touches `AboutContent` and the three grid components, nothing else.
- The layout width divergence noted in the PAGE-001 review (820px header against 1000px grid). That is an owed founder eyeball on a site-wide layout decision, not a defect, and it is not this item's business.

## Acceptance criteria

1. The "Notre approche" block either has an announced parent heading or no orphan eyebrow, and the choice is recorded in a D-row.
2. `role="list"` is present on all four grids, and `grep -rn "list-style: none" src/` surfaces no `<ul>` without it.
3. FR and EN parity holds: if a section title is added, both dictionaries carry it and the build stays green.
4. `npm run build` and `npm run check` green.
5. No visual change other than the section title, if one is added.

## Definition of Done

Use the canonical checklist in `.claude/personalities/TECH_LEAD.md`. The items that actually bite here: bilingual parity, heading hierarchy, no hardcoded hex, and a D-row for the heading choice.
