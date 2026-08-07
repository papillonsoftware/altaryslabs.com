# FORM-001 - Contact form submission

**Type** STORY | **Status** IMPLEMENTED, pending end-to-end verification on the deployed preview | **Branch** `feat/formulaire-contact`
**Base** `refonte-multipages` at `75820e2`, after `PAGE-002` and `UI-003`

## Goal

Make the contact form actually submit: a Cloudflare Pages Function that verifies
Turnstile, stores the message in D1 and sends an email notification through
Resend.

## Locked design

- **Pages Function** under `/functions`, deployed by Cloudflare independently of
  the Astro build. The site stays static output with no adapter.
- **D1 in the Europe region**, **assumed provisional**. Relocating storage to
  Africa is targeted for late 2026.
- **Turnstile** for anti-spam, verified server side. A client-side widget alone
  proves nothing.
- **Resend** for the notification email.

## The constraint that shapes the code

D1 is temporary. **Isolate every storage call in a single module** so the move to
another provider touches one file and nothing else. Do not let SQL leak into the
request handler.

## What was built

| File | Role | Contains SQL |
|---|---|---|
| `functions/api/contact.ts` | `onRequestPost` orchestration, `onRequestGet` redirect | no |
| `server/contact-store.ts` | the only file with SQL and the only one naming D1 | **yes** |
| `server/turnstile.ts` | server-side token verification, fails closed | no |
| `server/notify-resend.ts` | notification email, never throws | no |
| `migrations/0001_creer_table_contact_requests.sql` | schema | schema only |

Shared modules sit under `server/` at the repository root rather than inside
`functions/`, so no assumption is made about underscore-prefixed paths being
excluded from Pages routing. See D090.

## Infrastructure, already in place before this item

Set up on 2026-08-07 and documented in `docs/kb/turnstile-d1-resend-setup.md`,
which is a reusable tutorial rather than a record of this item.

- D1 database `altaryslabs-contact`, region WEUR, binding `DB` active in
  `wrangler.jsonc` with its real `database_id`.
- Four variables on the Pages project, in Production **and** Preview:
  `PUBLIC_TURNSTILE_SITE_KEY` (plain text, read at **build** time),
  `TURNSTILE_SECRET_KEY` (secret), `RESEND_API_KEY` (secret, "Sending access"
  scope only), `CONTACT_NOTIFY_EMAIL` (plain text).
- Resend domain verified, DKIM and SPF passing.

## Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | A submission from the live preview stores a row in D1 and produces an email | **pending the deployed preview**. Verified locally against a local D1: rows written with correct nulls, timestamps and page keys |
| 2 | A submission with a missing or invalid Turnstile token is rejected server side, and the page says so in its own language | **met**. Verified locally: no token gives `303` to `/contact?statut=erreur` in French and `/en/contact?statut=erreur` in English |
| 3 | Storage access is confined to one module, and swapping the provider requires editing only that file | **met**. `grep -rln -e "INSERT INTO" -e ".prepare(" functions server src` returns `server/contact-store.ts` alone |
| 4 | No secret appears anywhere in the repository | **met**. No key committed; `.gitignore` now covers `.env`, `.env.*`, `.dev.vars` and `.dev.vars.*`. See D098 |
| 5 | The failure path shows a usable message in both languages, never a raw error | **met**. Both states reuse the existing panels, which end on `contact.fallbackText` and a real `mailto:` from `config.ts`. See D082 |
| 6 | `npm run build` and `npm run check` clean, and the Cloudflare build succeeds with the D1 binding active | **partly met**. Both clean locally, and `npx wrangler pages functions build` compiles the Worker. The Cloudflare build itself is pending the merge |

## Local verification performed

`wrangler pages dev` against a local D1, with Cloudflare's public Turnstile test
keys passed on the command line and never written to a file.

| Case | Result |
|---|---|
| token absent, French | `303 /contact?statut=erreur` |
| token absent, English | `303 /en/contact?statut=erreur` |
| complete, English | `303 /en/contact?statut=envoye`, row written |
| complete with optional fields, French | `303 /contact?statut=envoye`, `company` and `phone` stored |
| `locale` tampered with an external URL | `303 /contact?statut=envoye`, no open redirect |
| interest outside the routing table | `303 /en/contact?statut=erreur` |
| malformed email | `303 /contact?statut=erreur` |
| empty message | `303 /contact?statut=erreur` |
| `GET` on the endpoint | `303 /contact`, `X-Robots-Tag: noindex` |
| `PUT` on the endpoint | `405` |
| build with no `PUBLIC_TURNSTILE_SITE_KEY` | fails with an actionable message |

The first harness run was itself defective: zsh does not word-split unquoted
parameter expansions, so curl received neither the fields nor the token and all
eight cases exercised the same "token absent" path. Recorded because a green
harness that tests one branch eight times looks exactly like a green harness.

## Done before the merge

- **Migration applied to the real database**, from the worktree, before the
  deployment goes live, so the very first submission does not fail on a missing
  table. Verified independently against the remote database: `contact_requests`
  and `idx_contact_requests_submitted_at` both present, served from `WEUR`.
  The first attempt failed from the main checkout with "No migrations present",
  because `migrations/` only exists on this branch until the merge.
- **Turnstile widget hostnames** now list `altaryslabscom.pages.dev` alongside
  `altaryslabs.com` and `localhost`, which is what allows the widget to render on
  the deployed URL at all.
- **Pages project name corrected** in `wrangler.jsonc`. See D099.

## Still to verify after the merge

1. The Cloudflare Pages build green with the D1 binding active, which a local
   green does not prove about platform secret resolution. The build now **fails**
   without `PUBLIC_TURNSTILE_SITE_KEY`, so a missing Production value stops the
   deployment instead of shipping a broken form.
2. A real submission on **`altaryslabscom.pages.dev`** writing a row and
   producing an email at `contact@altaryslabs.com`. That is a stable URL rather
   than a per-commit hash, because the project's production branch is
   `refonte-multipages` and not `main`.
3. The Resend sender constant matching the domain actually verified in Resend.
   A mismatch surfaces as an HTTP 403 in the function log, so the failure is
   loud rather than silent.
4. Rendering at 360, 768 and 1440 px, which this session could not re-check
   because both browser drivers were unavailable. No CSS rule changed and
   `.turnstile-slot` already reserved the widget's exact height by construction.

## Candidate for the review rounds, deliberately not done here

Turnstile's `siteverify` response carries a `hostname` field, and Cloudflare
documents that a backend should validate it against its own domains. The
function does not, so a token minted on one allowed hostname is accepted from
another. With three hostnames on the widget, two of which are `localhost` and a
`pages.dev` subdomain, the exposure is small but real. Left out because it
widens the scope past the acceptance criteria and because the allowlist has to
be settled first, not because it is unnecessary.

## Decisions recorded

D090 to D099. D064 and D065 are closed by D095 and D094.

## Out of scope

Relocating storage to Africa, which is its own item when the time comes. Any
CRM or webhook integration. Rate limiting and duplicate-submission detection.
Editing the legal texts, which were already accurate. The DNS cutover.
