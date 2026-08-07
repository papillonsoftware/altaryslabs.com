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
- **Three runtime variables** on the Pages project, in Production **and**
  Preview: `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY`, both of which **must
  carry the Secret type**, plus `CONTACT_NOTIFY_EMAIL` as plain text. The item
  started with a fourth, `PUBLIC_TURNSTILE_SITE_KEY`, read at build time; it was
  retired by D100 and the project now has no build-time variable at all.
- Resend domain verified, DKIM and SPF passing.

## Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | A submission from the live preview stores a row in D1 and produces an email | **pending the deployed preview**. Verified locally against a local D1: rows written with correct nulls, timestamps and page keys |
| 2 | A submission with a missing or invalid Turnstile token is rejected server side, and the page says so in its own language | **met**. Verified locally: no token gives `303` to `/contact?statut=erreur` in French and `/en/contact?statut=erreur` in English |
| 3 | Storage access is confined to one module, and swapping the provider requires editing only that file | **met**. `grep -rln -e "INSERT INTO" -e ".prepare(" functions server src` returns `server/contact-store.ts` alone |
| 4 | No secret appears anywhere in the repository | **met, and worth reading precisely.** No secret is committed. The Turnstile **site** key is, as a constant, and that is deliberate: it is not a secret and cannot be one, since Turnstile requires it in the rendered HTML where every visitor already receives it. The two actual secrets stay on the platform, and `.gitignore` now covers `.env`, `.env.*`, `.dev.vars` and `.dev.vars.*`. See D098 and D100 |
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
| build with `env -u PUBLIC_TURNSTILE_SITE_KEY` | succeeds, key emitted on both contact pages |

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

## The first Cloudflare build failed, and what it exposed

The build on PR #34 failed on the very guard D094 had just added, while the
dashboard showed `PUBLIC_TURNSTILE_SITE_KEY` set in Production and Preview. The
log carried the answer: `Found wrangler.json file. Reading build
configuration...` then `Build environment variables: (none found)`. Because
`wrangler.jsonc` carries `pages_build_output_dir`, that file is the source of
truth for project configuration and Cloudflare stops reading dashboard variables
for the build.

`pages_build_output_dir` **predates this item**, so dashboard build variables had
never reached this build. Nothing had depended on one until now, because D065's
fallback silently absorbed the absence. The guard did not cause the failure, it
revealed a latent condition within the hour, which is what it was written for.

Resolved by removing the dependency rather than repairing the plumbing: the site
key is now a constant, the project has no build-time variable at all, and both
the fallback and the guard are gone because the key can no longer be absent. See
D100, which supersedes D094. Two secrets were also found stored as Text rather
than Secret, and were rotated.

## Still to verify after the merge

1. The Cloudflare Pages build green with the D1 binding active, which a local
   green does not prove about platform secret resolution. Verified locally with
   `env -u PUBLIC_TURNSTILE_SITE_KEY npm run build`, which now succeeds and emits
   the key on both contact pages.
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

D090 to D100. D064 is closed by D095; D065 and D094 are closed and superseded by D100.

## Out of scope

Relocating storage to Africa, which is its own item when the time comes. Any
CRM or webhook integration. Rate limiting and duplicate-submission detection.
Editing the legal texts, which were already accurate. The DNS cutover.
