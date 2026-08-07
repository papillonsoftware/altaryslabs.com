# FORM-FIX-001 - Contact form: page language, retained input, focus, notification, token binding

**Type** FIX | **Status** IMPLEMENTED, round 2 findings corrected, pending verification on the deployed site | **Branch** `fix/contact-langue-saisie-jeton`
**Base** `refonte-multipages` at `cfe75b9`

## Why this item exists

`FORM-001` review round 1 returned CHANGES REQUESTED: one blocker and seven
important findings. Because PR #34 had already been merged when the round ran,
every finding was a defect live on the integration branch rather than something a
fix on that branch could catch. This item carried the code defects first, and
**round 2 folded the documentation defects into it as well**: the stale comments
and false documentation lines had been deferred to a `FORM-CHR-001` that was
never created, which round 2 correctly read as an abandonment rather than a
follow-up. See "Round 2" below.

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

## What changed

| File | Change |
|---|---|
| `src/components/ContactContent.astro` | `data-language={locale}`; `tabindex="-1"` on both panels; the state script now also persists and rehydrates the draft and moves focus |
| `server/turnstile.ts` | `hostname` returned in `TurnstileVerdict` instead of being discarded |
| `functions/api/contact.ts` | the token's hostname is compared to the request host and a mismatch is refused |
| `server/notify-resend.ts` | recipient falls back to `CONTACT_EMAIL`; one log line per failure cause |

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

1. A real submission producing an email. **Never yet proven end to end**: the
   three submissions of 2026-08-07 were stored but sent no notification, because
   `CONTACT_NOTIFY_EMAIL` had never been set. Criterion 4 removes that
   dependency, so this deployment is the first that can prove Resend accepts the
   send, and therefore that the sender constant matches the verified domain. A
   mismatch surfaces as an HTTP 403 in the function log.
2. The widget rendering in English on `/en/contact` from a French-configured
   browser, which is the exact condition the blocker was found under.
3. Rendering at 360, 768 and 1440 px. Round 1 captured all three in both
   languages, so the reference exists; the panels gained only `tabindex`, which
   paints nothing.

## Founder action, outside the code

Remove `localhost` from the Turnstile widget's hostname list. D107 defends
against the class of attack, so this is defence in depth rather than the fix, but
the entry serves no purpose: local development uses the public test keys, not this
widget.

## Round 2

Review round 2 returned CHANGES REQUESTED with **no blocker**: it confirmed the
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
six places that diverge the moment one changes. Round 2 corrected the three
places it named; this item also removed the cause, and there is now exactly one
enumeration. See D110.

## Decisions recorded

D103 to D107, plus D110 and D111 from round 2.

## Out of scope

The three non-blocking suggestions of `FORM-001` round 1 (the `tsconfig`
`baseUrl` deprecation, the full `fr` dictionary imported into `notify-resend`
for two labels, and `!.env.example`), the `docs/kb/` language and review
frontier, and the incomplete rule left in D100 by D106. All belong to
`SITE-FIX-011`, named by `SITE-FIX-010` on branch
`fix/perimetre-des-items-de-suite`.

**That reference is only as good as that item's fiche.** `SITE-FIX-011` has no
doc, no branch and no D-row at the time of writing, which is structurally what
made `FORM-CHR-001` an abandonment. Its fiche must exist before either item
merges, or this paragraph becomes the same defect finding 6 reported.

Splitting "absent" from "too long" in `readField`, which needs an error state
that can carry a reason and is therefore its own item.

The structural cause behind finding 5 - `.claude/commands/review.md` step 11
pushes the review onto the item's branch, and its closing rules forbid
committing one on `refonte-multipages`, so any round that runs after the PR is
merged loses its record - is real and is **not** fixed here. It needs a D-row
and a line in `.claude/personalities/REVIEWER.md`, in a separate `SITE` item.
