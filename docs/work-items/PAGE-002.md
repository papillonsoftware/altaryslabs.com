# PAGE-002 - Contact page, French and English

**Type** STORY | **Status** OPEN, not started | **Branch to create** `feat/page-contact`
**Base** `refonte-multipages`, after `UI-002`

## Goal

Replace the `PageScaffold` placeholder on `/contact` and `/en/contact` with the
final page. These are the last two scaffolded pages of the rebuild.

**`PageScaffold.astro` is deleted by this item.** It has no other consumer once
these two pages are done, and its own styles were only ever provisional.

## Blocked by `UI-002`

The Contact prototype is a light page: cream background, white form fields,
`--navy-14` borders. Building it before the switch would mean styling it twice.

## Visual reference

`contact.dc.html` at the **root** of the design project. It is new: the frozen
folder never had a Contact prototype, which is why this page waited.

The prototype carries a full form and a success state:

| Field | Type | Notes |
|---|---|---|
| Nom complet | text | required |
| Societe | text | optional |
| Email | email | required |
| Telephone | tel | optional |
| Je suis interesse par | select | seven options, see below |
| Message | textarea | five rows |

Select options, in the prototype's order: Papillon HR Suite, Papillon Corporate
Finance **Suite**, Papillon Collection Solution (PCS), Conseil, Developpement sur
mesure, IA souveraine, Autre.

Note that `contact.dc.html` is the one file where the handoff keeps "Suite" on
the Corporate Finance product. That spelling is the correct one (D017).

Success state: a white card, "Message envoye" in Cormorant, with a short
follow-up sentence.

## Two gaps in the prototype

1. **No Turnstile widget is drawn.** It is required (see `CLAUDE.md`). Place it
   above the submit button and account for its height in the layout.
2. **No error state is drawn.** A failed submission must say what to do next,
   never show a raw error. Design one, and one for the JavaScript-disabled case.

## Form control styles already exist

`UI-001` shipped `.field`, `.field-label`, `.field-input`, `.field-select`,
`.field-textarea` and their focus ring in `global.css`, sized and coloured from
the prototype, with an accessible placeholder colour. Use them rather than
writing new ones.

## Scope

- `src/pages/contact.astro`, `src/pages/en/contact.astro`
- a shared `ContactContent.astro`, on the `HomeContent` model (D019)
- new keys in `fr.ts` then `en.ts`, including every field label, the select
  options, the success state and the error state
- delete `src/components/PageScaffold.astro`

## Out of scope

**The submission itself.** The form markup ships here; the Pages Function, D1,
Turnstile verification and the email notification are `FORM-001`. Decide with
the founder whether this item ships an inert form or a `mailto:` fallback in the
interval; that arbitration was raised and never settled.

## Acceptance criteria

1. Both pages render the final form, and `PageScaffold.astro` no longer exists
   in the repository.
2. Every field label, option and state exists in both dictionaries.
3. Labels are bound to their controls, the form is keyboard navigable, and the
   focus ring is visible on every control.
4. `bin/contrast_sweep` returns zero failures on both pages.
5. `npm run build` and `npm run check` clean.
