# SITE-FIX-012 - Deferred defects from the FORM-001 and FORM-FIX-001 review rounds

**Type** FIX | **Status** OPEN, not started | **Branch** none yet
**Base** `refonte-multipages`
**Opened by** `FORM-FIX-001`, see D113

## Why this item exists

`FORM-FIX-001` deferred findings twice to items that did not exist: first to a
`FORM-CHR-001` named in a work item and a PR body while having no fiche, no
branch and no D-row, then to a `SITE-FIX-011` in the same state. Both were
caught by review, which called the second what it was: a deferral without
support is an abandonment, and naming the risk in the document does not
discharge it.

This fiche exists so that the seven points below are owned rather than
mentioned. It is deliberately opened without being started.

## Scope, seven points named one by one

Each is quoted from the round that raised it rather than summarised, and carries
the severity that reviewer assigned.

1. **[SUGGESTION]** `tsconfig.json` - the `baseUrl` deprecation. Raised by
   `FORM-001` round 1.
2. **[SUGGESTION]** `server/notify-resend.ts:17` - the module imports the whole
   `fr` dictionary for the `pageName` labels alone, which weighs on the Worker
   bundle. Raised by `FORM-001` round 1 and by both rounds of `FORM-FIX-001`.
   No functional consequence.
3. **[SUGGESTION]** `.gitignore` - the `!.env.example` negation. Raised by
   `FORM-001` round 1.
4. **[SUGGESTION]** `docs/kb/turnstile-d1-resend-setup.md` and `docs/reviews/*.md`
   - the language frontier, unsettled and now wider than first raised. The
   runbook is in French while the repository rule puts documentation in English;
   the review corpus is itself mixed, `FORM-001-review.md` and
   `PAGE-002-review.md` in English, `UI-004-review.md` and
   `FORM-FIX-001-review.md` in French. Raised three times without a D-row.
   **This needs a founder decision covering both families, then the D-row, in
   one direction or the other.**
5. **[IMPORTANT]** `docs/DECISIONS.md`, D100 - the rule left incomplete by D106.
   D100 still says the project has "only three runtime ones", which stopped
   being true when `CONTACT_NOTIFY_EMAIL` became an optional override.
6. **[IMPORTANT]** `src/components/LangSwitcher.astro:25`,
   `src/components/Header.astro:60`, `src/i18n/config.ts:20` - French colon
   spacing in three English `aria-label`s, on **every** `/en/` page:
   `aria-label="Change language : Francais"`, `aria-label="Products : Open menu"`
   and `aria-label="Services : Open menu"`. English puts no space before a
   colon; French does, and the French side is correct. The cause is the same in
   both components: a template literal hardcoding ` : ` for both languages.
   `Francais` is also misspelled, without its cedilla, in a repository that
   accents everywhere else. **The parity checklist names ARIA labels explicitly
   among the surfaces where a string must not leak from one language into the
   other.** Suggested shape: carry the separator in the dictionaries, `fr.ts`
   with its non-breaking space and `en.ts` without one, rather than in the
   template.
7. **[IMPORTANT]** `src/styles/tokens.css:34-35` - `--ok: #2e7d52` and
   `--err: #b93838`, declared and **never used**: `var(--ok)` and `var(--err)`
   return nothing in `src/`, and the built CSS contains only their
   declarations. Two off-palette values, a green and a red, served on every page
   of the site, three lines under the comment stating the site is entirely navy
   and gold. The Contact page deliberately distinguishes success from error by
   shape and text rather than by colour. The next author looking for a state
   token will find these two and paint a red into a navy and gold site with the
   authority of an official token.

## A note on shape

Points 6 and 7 are interface code rather than documentation and would sit as
well in a `UI-FIX` or `I18N-FIX` item. They are grouped here on the founder's
call, taken during `FORM-FIX-001`, because they were both confirmed in the same
round and both fall outside a documentary PR. They can be split out later
without renumbering anything.

Point 4 is the only one that cannot be started before a founder decision: the
other six have a determined answer, this one has two defensible ones.

## Acceptance criteria

To be written when the item is planned. It carries at least: no `aria-label`
mixes the typographic conventions of two languages; `tokens.css` declares no
colour outside the navy and gold palette without an explicit reservation; D100
describes the current variable contract; and the language frontier has a D-row
settling it.

## Out of scope

Anything `FORM-FIX-001` already fixed. `docs/kb/` content edits beyond the
language question, that directory being deliberately outside D110's
single-enumeration rule.
