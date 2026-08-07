# FORM-FIX-001 - Contact form: page language, retained input, focus, notification, token binding

**Type** FIX | **Status** IMPLEMENTED, pending verification on the deployed site | **Branch** `fix/contact-langue-saisie-jeton`
**Base** `refonte-multipages` at `cfe75b9`

## Why this item exists

`FORM-001` review round 1 returned CHANGES REQUESTED: one blocker and seven
important findings. Because PR #34 had already been merged when the round ran,
every finding was a defect live on the integration branch rather than something a
fix on that branch could catch. This item carries the code defects. The stale
comments, the documentation corrections and the tooling suggestions are
`FORM-CHR-001`.

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
D106 that means the success path can no longer be exercised locally with the test
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

Remove `localhost` from the Turnstile widget's hostname list. D106 defends
against the class of attack, so this is defence in depth rather than the fix, but
the entry serves no purpose: local development uses the public test keys, not this
widget.

## Decisions recorded

D102 to D106.

## Out of scope

The stale comments and false documentation lines, the `tsconfig` deprecation and
the `notify-resend` bundle size, all of which are `FORM-CHR-001`. Splitting
"absent" from "too long" in `readField`, which needs an error state that can
carry a reason and is therefore its own item.
