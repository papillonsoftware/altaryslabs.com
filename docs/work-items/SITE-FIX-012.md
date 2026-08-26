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

## Points 1 to 5 are delivered by `SITE-FIX-011`, not by this item

**Scope reduced on 2026-08-08.** `SITE-FIX-011` was already in flight when this
fiche was opened, held by a parallel session, which is the reason D114 skipped
to `012` in the first place. That session covered points 1 to 5 and landed them
with D115 to D118. This item is therefore **reduced to points 6 and 7**.

Points 1 to 5 are **kept below intact and unedited**, and the mapping table
here is what marks them settled: a reduction that deletes its own history is how
a deferral becomes an abandonment, which is the exact failure this fiche exists
to prevent. Read the list below as the scope **as originally written**, not as
the scope that remains.

| Point | Settled by |
|---|---|
| 1. `tsconfig.json`, `baseUrl` | `SITE-FIX-011`, D117 |
| 2. `notify-resend.ts` imports `fr` | `SITE-FIX-011`, D118 |
| 3. `.gitignore`, `!.env.example` | `SITE-FIX-011` |
| 4. Language frontier, both families | `SITE-FIX-011`, D116 |
| 5. D100 incomplete | `SITE-FIX-011`, D115 |

**Point 4 was the one needing a founder decision, and it was taken**: `docs/kb/`
is French learning material excluded from review scope, `docs/reviews/` stays
English. See D116.

## Scope as originally written, seven points

Each is quoted from the round that raised it rather than summarised, and carries
the severity that reviewer assigned. **Only 6 and 7 remain open.**

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
   ~~This needs a founder decision covering both families, then the D-row, in
   one direction or the other.~~ **SETTLED on 2026-08-08 by D116**: `docs/kb/`
   is French learning material excluded from review scope, `docs/reviews/`
   stays English, existing files left as they are. The file counts quoted in
   this paragraph were examples, not an inventory: the corpus held eleven
   files, six of them French.
5. **[IMPORTANT]** `docs/DECISIONS.md`, D100 - the rule left incomplete by D106.
   D100 still says the project has "only three runtime ones", which stopped
   being true when `CONTACT_NOTIFY_EMAIL` became an optional override.
6. **DELIVERED by `I18N-FIX-003`, D124 and D125.** Kept in full below, struck
   through in intent rather than deleted, for the same reason points 1 to 5
   are: a reduction that erases its own history is how a deferral becomes an
   abandonment. **This item no longer carries it.** The correction landed as a
   `LABEL_SEPARATOR` table in `src/i18n/config.ts` read by both components,
   rather than in the dictionaries as suggested below, and with a plain space
   on the French side rather than a non-breaking one; both departures from the
   suggested shape are argued in D124. `Francais` regained its cedilla in the
   same change.
   ~~**[IMPORTANT]** `src/components/LangSwitcher.astro:25`,
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
   template.~~
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

**Point 6 was split out on 2026-08-08, exactly as that paragraph allowed**, and
is delivered by `I18N-FIX-003`. Nothing was renumbered. **Point 7 is therefore
the only point this item still owns**: it changes the CSS served on every page
of the site, a different blast radius and a different verification from three
accessible names, so grouping the two would have dragged a three-attribute fix
into a full visual pass. See D125.

Point 4 was the only one that could not be started before a founder decision.
That decision was taken on 2026-08-08 and is recorded as D116.

## Acceptance criteria

To be written when the item is planned. **The scope is point 7 alone**, points 1
to 5 having landed with `SITE-FIX-011` and point 6 with `I18N-FIX-003`, so it
carries at least: `tokens.css` declares no colour outside the navy and gold
palette without an explicit reservation.

## Out of scope

Anything `FORM-FIX-001` already fixed, and **anything `SITE-FIX-011` delivered**,
which is points 1 to 5 above. `docs/kb/` content edits of any kind: that
directory is outside D110's single-enumeration rule and, since D116, outside
the review perimeter entirely.
