# UI-FIX-005 - The card link touch target

**Type** FIX | **Status** OPEN, not started | **Branch** none yet
**Base** `refonte-multipages`
**Opened by** `I18N-FIX-003`, see D135
**Origin** `docs/reviews/I18N-FIX-003-review.md`, Round 3, fourth `IMPORTANT` finding

## Scope, quoted from the review rather than summarised

Per `docs/AI_Development_Workflow.md`, "Follow-up items born from a review", the
reviewer's defining sentences are reproduced **verbatim** and carry the severity
**that reviewer assigned**.

> - [ ] **[IMPORTANT]** `src/styles/global.css:353-359`, measured on `/en` at 360
>   px - **The card links are 22 px tall, half the touch target this repository
>   requires, and the card around them is not clickable.** Measured through the
>   DevTools protocol: the six `.link-arrow` anchors are 254 x 22 CSS px at 360
>   px and 342 x 22 at 1440 px. `.link-arrow` carries `font-size: 13.5px` and no
>   padding, no `min-height` and no block sizing at any breakpoint. The whole tap
>   target of a product card on a phone is therefore a 22 px strip of text at the
>   bottom of it, on the two pages that carry the site's primary navigation into
>   the product range. The repository applies the 44 px rule deliberately
>   elsewhere and says so in place: `LangSwitcher.astro:79-86` comments "40x32
>   sous les 44px requis" and sets `min-width: 44px; min-height: 44px` under 900
>   px, and `Header.astro` sizes `.nav-disclosure` to 44 x 44 at the same
>   breakpoint. The card link got neither. Stated honestly: WCAG 2.2 SC 2.5.8 is
>   probably satisfied here through its spacing exception, the links being far
>   apart, so what is unmet is **this repository's own 44 px bar**, applied to
>   two of the three interactive elements in question and not to the third.
>   Pre-existing, untouched in substance by this PR, but this PR is what rewrote
>   both anchors, and the maximal bar makes origin irrelevant to the verdict. ->
>   Give `.link-arrow` a `min-height` of 44 px with the padding to match under
>   the mobile breakpoint, on the same pattern as `LangSwitcher.astro:81-86`, or
>   make the whole card the link. Either way it needs a tracked follow-up, a work
>   item plus a D-row, since the fix is a CSS change on every page that carries
>   cards and wants its own visual pass.

**Reproduced independently before this fiche was opened**, through the DevTools
protocol at 360 px on `/en` and `/en/products`: `.link-arrow` measures 254 x 22.

## Why it is not fixed in `I18N-FIX-003`

Three reasons, recorded so the deferral is not re-argued. See D135.

1. **It is a CSS change on every page that carries cards**, and it therefore
   wants its own visual pass at 360, 768 and 1440 px in both languages.
   `I18N-FIX-003` ships a diff that deliberately changes no CSS file, and
   folding this in would take that item out of its own scope.
2. **The two candidate shapes are a real choice, not a detail.** A `min-height`
   with matching padding keeps the current interaction model; making the whole
   card the link changes it, and changes how a screen reader and a keyboard user
   traverse the card. That is a designer's call.
3. It is the same reasoning D125 applied when `SITE-FIX-012` kept point 7, the
   unused off-palette tokens, rather than letting a three-attribute fix drag a
   full visual pass behind it.

## What the fix has to settle

- **Which shape**, per the two above. This needs the founder's call before the
  item can be planned.
- Whether the bar applies at every width or only under the mobile breakpoint.
  `LangSwitcher.astro` and `Header.astro` both scope theirs to `max-width: 900px`,
  and the measurement shows 342 x 22 at 1440 px as well, so the answer is not
  automatic.
- Whether any other interactive element on the site is under the bar. **This
  item should sweep rather than assume**: the measurement that found this one
  covered `.link-arrow`, `.nav-disclosure` and `.lang-switcher` only.

## Acceptance criteria

To be written when the item is planned. It carries at least: every interactive
element measures at least 44 px on its constrained axis at 360 px, measured
through the DevTools protocol rather than read off the CSS; the card visual is
unchanged at three widths in both languages; and no accessible name changes,
`I18N-FIX-003` having just established what each one must be.

## Out of scope

Anything `I18N-FIX-003` delivered. The accessible names of the card links, which
are settled by D133 and must not move: a shape that makes the whole card the
link has to preserve `Learn more: Papillon HR Suite` and
`En savoir plus : Papillon HR Suite` exactly, and must be verified on computed
accessible names rather than on the built HTML, per D133.
