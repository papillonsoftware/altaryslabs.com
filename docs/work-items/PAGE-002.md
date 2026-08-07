# PAGE-002 - Contact page, French and English

**Type** STORY | **Status** IN REVIEW, first commit done | **Branch** `feat/page-contact`
**Base** `refonte-multipages` @ `72d4efd`, after `UI-002` and `I18N-001`

## Goal

Replace the `PageScaffold` placeholder on `/contact` and `/en/contact` with the
final page. These were the last two scaffolded pages of the rebuild.

**`PageScaffold.astro` is deleted by this item**, together with the four rules in
`global.css` whose only consumer it was (`.breadcrumb li`, `.breadcrumb a`,
`.breadcrumb li + li::before`, `.scaffold-note` in the light peritext).

## Visual reference

`contact.dc.html` at the **root** of the design project. Single centred 640px
column on cream, two 2-column rows, select, textarea, gold submit.

The prototype is the one handoff file that keeps "Suite" on the Corporate
Finance product. That spelling is the correct one (D017).

## Decisions taken

| D | Subject |
|---|---|
| D064 | Inert form, final submission markup, guard script deleted by `FORM-001` |
| D065 | Turnstile behind `PUBLIC_TURNSTILE_SITE_KEY`, 65px reserved otherwise |
| D066 | Three states hidden in the document, revealed from `?statut=`, read client-side |
| D067 | Privacy sentence with link, no checkbox |
| D068 | Select derived from `pageName`; "(PCS)" dropped; optional fields marked |
| D069 | Contact-details block deferred to a second commit, pending an updated prototype |

## The three gaps the prototype left

1. **No Turnstile widget drawn.** Resolved by D065: real widget when the key is
   set, an `aria-hidden` slot reserving its exact 65px otherwise, so the submit
   button does not move when `FORM-001` sets the variable.
2. **No error state drawn.** Designed as a banner with a gold left rule and a
   navy title, sitting above a still-usable form so the visitor can retry
   immediately. It differs from the success card by shape, never by colour
   alone.
3. **No JavaScript-disabled case drawn.** A `noscript` note says the send needs
   JavaScript, rather than letting the visitor fill six fields for nothing:
   Turnstile cannot mint a token without it, so the send would be rejected
   server side whatever they type.

## Still open, tracked by D069

The contact-details block, the exact error copy and the exact no-JavaScript
copy. All three name a channel the site does not publish today. The founder is
updating `contact.dc.html` rather than letting the placement be improvised.

## A trap worth recording

`.contact-form` declares `display: flex`, which beats the `display: none` the
user-agent stylesheet attaches to `[hidden]`. Without an explicit
`.contact-form[hidden] { display: none }`, the success panel appeared **with the
form still visible underneath**, inviting a resend of the message that had just
gone through. The state panels hide correctly on their own only because they
declare no `display` of their own.

Reading the CSS did not reveal this. A screenshot did.

## Scope delivered

- `src/components/ContactContent.astro`, new, shared by both languages (D019)
- `src/pages/contact.astro`, `src/pages/en/contact.astro`, rewritten
- `src/i18n/fr.ts` then `src/i18n/en.ts`, one `contact` block each
- `src/components/PageScaffold.astro`, deleted
- `src/styles/global.css`, four orphaned rules removed

No routing change: `contact` was already declared in both languages, so
hreflang, the language switcher, the footer and the sitemap were already
correct. No SEO change: `meta.contact` already existed in both dictionaries.

No new form control style: `.field`, `.field-label`, `.field-input`,
`.field-select`, `.field-textarea` and their focus ring all come from
`global.css`, shipped dormant by `UI-001`.

## Out of scope

**The submission itself.** The Pages Function, D1, Turnstile server-side
verification and the email notification are `FORM-001`. The D044 consulting
rename belongs to `I18N-001`, already merged.

## Acceptance criteria

1. Both pages render the final form, and `PageScaffold.astro` no longer exists
   in the repository. **Met.**
2. Every field label, option and state exists in both dictionaries. **Met**, the
   `Dictionary` type derived from `fr.ts` enforces it at build time.
3. Labels are bound to their controls, the form is keyboard navigable, and the
   focus ring is visible on every control. **Met**, measured by tabbing through
   a real headless browser: all six controls match `:focus-visible` and compute
   `2px solid #B8791E` at 1px offset.
4. `bin/contrast_sweep` returns zero failures on both pages. **Met**, on the
   default state and on all four `?statut=` states, where the panels are
   actually revealed.
5. `npm run build` and `npm run check` clean. **Met.**
