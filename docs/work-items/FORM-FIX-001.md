# FORM-FIX-001 - Contact form: page language, retained input, focus, notification, token binding

**Type** FIX | **Status** IMPLEMENTED, two review rounds answered, pending verification on the deployed site | **Branch** `fix/contact-langue-saisie-jeton`
**Base** `refonte-multipages` at `cfe75b9`

## Why this item exists

`FORM-001` review round 1 returned CHANGES REQUESTED: one blocker and seven
important findings. Because PR #34 had already been merged when the round ran,
every finding was a defect live on the integration branch rather than something a
fix on that branch could catch. This item carried the code defects first, and **the first review round of this
item folded the documentation defects into it as well**: the stale comments and
false documentation lines had been deferred to a `FORM-CHR-001` that was
never created, which that round correctly read as an abandonment rather than a
follow-up. See "Review rounds" below.

Two further defects were found by the founder testing the deployed site during
the same session, and are fixed here because they share a cause with the review's
findings.

## Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | The Turnstile widget follows the page language, not the browser's; `/en/contact` renders no French string | **met**. `data-language="fr"` and `data-language="en"` verified on the two built pages |
| 2 | After `?statut=erreur` the six fields are repopulated; the visitor retypes nothing | **met**. Draft persisted on submit, rehydrated on error, cleared on success |
| 3 | The revealed panel receives focus and is genuinely announced | **met**. `tabindex="-1"` on both panels, focus deferred to `DOMContentLoaded`, reduced-motion-aware scroll |
| 4 | The notification recipient can no longer be missing, and each failure cause has its own log line | **met**. Fallback and the split messages both exercised locally |
| 5 | A token minted on another host is refused | **met**. Verified locally with a real mismatch, both values named in the log |
| 6 | Build, check and Worker bundle green | **met** |
| 7 | A second submission fired before the redirect no longer shows an error for a request that succeeded | **met**. The second submit is cancelled by a flag and `preventDefault`, the button is disabled afterwards as feedback only, and a `pageshow` listener re-arms both after a bfcache restore. See D112 |

## What changed

| File | Change |
|---|---|
| `src/components/ContactContent.astro` | `data-language={locale}`; `tabindex="-1"` on both panels; the state script now also persists and rehydrates the draft and moves focus |
| `server/turnstile.ts` | `hostname` returned in `TurnstileVerdict` instead of being discarded |
| `functions/api/contact.ts` | the token's hostname is compared to the request host and a mismatch is refused |
| `server/notify-resend.ts` | recipient falls back to `CONTACT_EMAIL`; one log line per failure cause |
| `src/components/ContactContent.astro` | second pass: the submit listener cancels a second submission and disables the button; `pageshow` re-arms both after a back-button restore |

## Local verification performed

`wrangler pages dev` against a local D1, with Cloudflare's public Turnstile test
secret and a deliberately fake Resend key, both passed on the command line and
never written to a file.

| Case | Result |
|---|---|
| `data-language` on both built pages | `fr` on `/contact`, `en` on `/en/contact` |
| `tabindex="-1"` on both panels | present on `#form-sent` and `#form-error` |
| token absent | `303 /contact?statut=erreur` |
| token whose hostname is not the request host | `303 /contact?statut=erreur`, log names both values |
| token whose hostname matches the request host | `303 /en/contact?statut=envoye`, row written |
| `CONTACT_NOTIFY_EMAIL` absent | warning names the fallback, Resend is then actually called |
| `RESEND_API_KEY` absent | one message naming that variable alone, no mention of the other |

**A finding worth carrying forward:** Cloudflare's Turnstile **test** secret always
reports `hostname: "example.com"`, whatever host the page was served from. Under
D107 that means the success path can no longer be exercised locally with the test
keys unless the request presents `Host: example.com`, which is how it was
exercised above. This is a property of the test keys, not a weakness of the check;
the same check passes trivially in production, where the values genuinely match.

## Still to verify on the deployed site

1. ~~A real submission producing an email.~~ **Done on 2026-08-07**, on this
   PR's own deployment: a real submission wrote a row **and** produced a
   received email, with `Reply-To` pointing at the visitor's address and a
   subject carrying the interest label derived from `pageName`. That closes the
   question criterion 4 was written for, and proves the sender constant
   `formulaire@altaryslabs.com` matches the domain verified in Resend. The three
   submissions of 2026-08-07 that stored nothing had failed for the reason D106
   removes: `CONTACT_NOTIFY_EMAIL` had never been set.
2. The widget rendering in English on `/en/contact` from a French-configured
   browser, which is the exact condition the blocker was found under.
3. Rendering at 360, 768 and 1440 px. Both review rounds captured all three in
   both languages, and the second round additionally drove the pages over the
   DevTools protocol. The second pass on `ContactContent.astro` adds behaviour
   but paints one new state: a `.contact-submit:disabled` rule was added with
   it, because `.btn` sets its background and text colour explicitly and a
   browser's default `:disabled` rendering therefore changes nothing at all.
   Opacity and cursor only, no new colour and no new token.

## Founder action, outside the code

Remove `localhost` from the Turnstile widget's hostname list. D107 defends
against the class of attack, so this is defence in depth rather than the fix, but
the entry serves no purpose: local development uses the public test keys, not this
widget.

## Review rounds

**A word on numbering, because three documents got it wrong.** This item's own
review file, `docs/reviews/FORM-FIX-001-review.md`, numbers its rounds from one.
Its `## Round 1` is the round that followed `FORM-001` round 1, and its
`## Round 2` is the one after that. Earlier versions of this doc, of D111 and of
the PR body all said "round 2" for what the review file calls Round 1, so the
cross-reference resolved to nothing and would soon have named two different
rounds depending on the document opened. Rounds are referred to below by what
they followed, never by a number this doc assigns itself.

### The round that followed `FORM-001` round 1

It returned CHANGES REQUESTED with **no blocker**: it confirmed the
five acceptance criteria and found no defect of logic, security or data loss.
All nine findings were `IMPORTANT` and entirely documentary. **None spawned a
follow-up item**: they are corrected on this PR, in the reviewer's own order and
at the severity the reviewer assigned.

| # | Where | What was false, and what it now says |
|---|---|---|
| 1 | `CLAUDE.md` | Claimed three runtime variables **must** exist, `CONTACT_NOTIFY_EMAIL` included, which D106 had made optional in the same PR. It now points at the single enumeration and keeps only the invariants |
| 2 | `wrangler.jsonc` | Announced "TROIS variables a definir" and described `CONTACT_NOTIFY_EMAIL` as text to be set, an action D106 shows has no effect on this project. It now points at the same enumeration and keeps the Secret-versus-Text rule and the inert-plain-text trap |
| 3 | `server/notify-resend.ts:4` | "il part vers `CONTACT_NOTIFY_EMAIL`", falsified by the fallback added twelve lines below it in the same PR. Now names the fallback |
| 4 | `server/turnstile.ts:4-6` | "C'est cette verification, **et elle seule**, qui fait tenir l'anti-robot", contradicted by D107. Now names the host comparison as the necessary second half, says the module is not self-contained, and warns against deleting the comparison |
| 5 | `docs/reviews/FORM-001-review.md` | Existed only on `feat/formulaire-contact`, merged and dead, so it could never reach the integration branch and the PR link 404ed. `62a2148` cherry-picked onto this branch |
| 6 | this file, and the PR body | Deferred four confirmed `IMPORTANT` findings to a `FORM-CHR-001` that exists nowhere. Folded in here instead |
| 7 | `.gitignore:72` | "les **quatre** variables du formulaire de contact", wrong since D100 and wrong again since D106, in the file whose job is to keep a secret out of the repository. Now carries no count |
| 8 | `docs/kb/turnstile-d1-resend-setup.md` | Section 2 told an operator to reactivate a D1 block that has been active with a real `database_id` since 2026-08-07. Rewritten as done. The variables table carried the same "Trois variables" and "Texte" falsehood as findings 1 and 2 and is corrected with them |
| 9 | `src/components/ContactContent.astro:424` | Justified the reserved height "que la cle soit posee ou non", two states D100 reduced to one. Now justifies the reservation alone |

One `SUGGESTION` was folded in with them, being the third header this PR
falsified: `functions/api/contact.ts:18-22` enumerated the order of operations
without the host check the PR inserts between its first two steps.

The other `SUGGESTION`, a sentence about the `sessionStorage` draft on
`/confidentialite` and `/en/privacy`, was **decided against explicitly** rather
than deferred: the draft never leaves the visitor's browser and is not a
collection within the meaning of the policy. See D111.

**The same subject broke twice**: the form's environment variables, described in
six places that diverge the moment one changes. That round corrected the three
places it named; this item also removed the cause, and there is now exactly one
enumeration. See D110.

### The round after that

CHANGES REQUESTED again, **no blocker**, seven `IMPORTANT` findings. It confirmed
that all nine findings of the previous round were genuinely fixed, and it proved
the acceptance criteria **at runtime** rather than by reading the built HTML:
driving Chrome over the DevTools protocol, `document.activeElement.id` is
`form-error` on both error pages and `form-sent` on success, and the fields come
back populated after the error redirect, `select` included. Palette measured
mechanically on the built CSS, 22 distinct hexes with no amber, teal or violet;
`bin/contrast_sweep` with no AA failure.

| # | Where | Answer |
|---|---|---|
| 1 | `docs/kb/…:141-151` | D110 claimed the runbook carried neither the list nor a count, and it still said "Les deux cles" above a two-row table. **The rule was false on one of the four files it named.** `docs/kb/` is out of this item's reach by founder ruling, so the fix took the branch the reviewer offered as its alternative: D110 and `CLAUDE.md` are corrected to describe the state the repository actually has. The runbook is now excluded from the rule **by name**, being a portable tutorial rather than a description of this project |
| 2 | `docs/DECISIONS.md` | The log jumped D107 to D110 with no reservation note, against its own D033-D035 precedent, so a session following the "grep for the highest" rule would have found D108 and D109 free and reused them. They were held, uncommitted, by `SITE-FIX-010`, which is why they appeared on no reference. **They have since landed through PR #37 and the gap is closed**; the note kept in their place records why the survey rule alone could not have found them, which is D109's own subject |
| 3 | this file | Deferred five points to a `SITE-FIX-011` with no fiche, no D-row and no commit: the same structure as `FORM-CHR-001`, and naming the risk in the doc did not discharge it. `SITE-FIX-012` is opened instead, with its D-row. See D113 |
| 4 | this file | Deferred the review-record cause to a `SITE` item with **no identifier at all**. `SITE-FIX-013` is opened, with its D-row. See D114 |
| 5 | this file, D111, the PR body | All three said "round 2" for what the review file classes as `## Round 1`, so the cross-reference resolved to nothing and was about to name two different rounds. Rounds are now named by what they followed. See the numbering note above |
| 6 | `LangSwitcher.astro`, `Header.astro`, `config.ts` | French colon spacing in three English `aria-label`s, on every `/en/` page, plus `Francais` without its cedilla. Pre-existing, untouched by this PR. Deferred to `SITE-FIX-012` as point 6 |
| 7 | `src/styles/tokens.css:34-35` | `--ok` and `--err`, declared, never referenced, off-palette, served on every page. Pre-existing. Deferred to `SITE-FIX-012` as point 7 |

The `preventScroll` suggestion was **measured and not confirmed** by the
reviewer: `scrollY` evolves identically with and without the option, the panel
being at the top of the document either way. Reported as a measurement rather
than a theory, and not acted on.

### Added by the founder after the same round

Two items, both outside what either review raised.

**The end-to-end proof arrived.** A real submission on this PR's deployment wrote
a row **and** produced a received email, `Reply-To` on the visitor's address,
subject carrying the `pageName` label. It closes `FORM-001` criterion 1 and the
remaining half of its criterion 6, and `docs/work-items/FORM-001.md` is updated
accordingly: that document described a state the deployment had already
disproved, which is the exact defect both rounds sanctioned elsewhere.

**The double submission**, criterion 7 above and D112. Found by the founder
testing the deployed site, not by either review.

## Decisions recorded

D103 to D107, plus D110 to D114 from the two review rounds. D110 was corrected
by the second round and is narrower than first written.

## Out of scope

Everything below is deferred to a work item that **exists**, with its own D-row,
because this item twice deferred findings to items that did not: `FORM-CHR-001`,
named in a work item and a PR body while existing nowhere, and `SITE-FIX-011`,
which had no fiche, no branch and no D-row either. Both were caught by review.
`SITE-FIX-011` is claimed by `SITE-FIX-010`, merged through PR #37, whose own
out-of-scope paragraph defers to it; the fiche does not exist yet and that is
that item's to open, not this one's. Hence the numbering below.

**`SITE-FIX-012`** (see D113) carries seven points, each named rather than
summarised:

1. the `tsconfig` `baseUrl` deprecation;
2. the full `fr` dictionary imported into `server/notify-resend.ts` for two
   labels alone, which weighs on the Worker bundle;
3. the `!.env.example` negation in `.gitignore`;
4. the language frontier of `docs/kb/` **and of the review corpus**, which is
   itself mixed today, French and English alike, with no D-row settling it;
5. the incomplete rule D106 left inside D100, which still says the project has
   "only three runtime ones";
6. the French colon spacing in three English `aria-label`s, on **every** `/en/`
   page: `"Change language : Francais"`, `"Products : Open menu"` and
   `"Services : Open menu"`, plus `Francais` without its cedilla. The separator
   belongs in the dictionaries rather than in a template literal shared by both
   languages;
7. `--ok: #2e7d52` and `--err: #b93838` in `src/styles/tokens.css`, declared,
   never referenced, off-palette, and served on every page three lines under the
   comment stating the site is navy and gold only.

Points 6 and 7 are interface code rather than documentation and would sit as
well in a `UI-FIX` item; they are grouped here on the founder's call, and can be
split out without renumbering anything.

**`SITE-FIX-013`** (see D114) carries the structural cause behind the lost
`FORM-001` review: step 11 of `.claude/commands/review.md` pushes a round's
record onto the work item's branch, and the same file forbids committing one on
`refonte-multipages`, so a round that runs after its PR is merged writes onto a
dead branch and its record never reaches the integration branch. It needs a
D-row and a line in `.claude/personalities/REVIEWER.md`. The instance was
repaired here by cherry-picking `62a2148`; the cause was not.

Splitting "absent" from "too long" in `readField`, which needs an error state
that can carry a reason and is therefore its own item.

Server-side duplicate detection and rate limiting, which `FORM-001` already puts
out of scope. D112 is **not** that: nothing is de-duplicated on the server, the
page merely stops reporting a failure that did not happen.
