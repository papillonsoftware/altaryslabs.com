# FORM-001 - Contact form submission

**Type** STORY | **Status** OPEN, not started | **Branch to create** `feat/formulaire-contact`
**Base** `refonte-multipages`, after `PAGE-002`

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

## Two traps recorded from earlier work

1. **The D1 binding in `wrangler.jsonc` is commented out.** Reactivate it after
   `wrangler d1 create`, and **do not forget the comma after
   `pages_build_output_dir`**. A block with an unresolved `database_id` fails the
   Cloudflare build.
2. **Assume no secret exists on the Pages project.** The duplicate project was
   deleted on 31 July 2026 without recording what it held. If Turnstile or Resend
   keys had been configured there, they are gone from Cloudflare. Both are
   recoverable from their own dashboards; set them on `altaryslabscom` from
   source and never assume a value is already present. See `OPS-001`.

## Secrets

Never committed. Site key, Turnstile secret key and Resend API key live in the
Cloudflare dashboard or in environment variables.

## Acceptance criteria

1. A submission from the live preview stores a row in D1 and produces an email.
2. A submission with a missing or invalid Turnstile token is rejected server
   side, and the page says so in its own language.
3. Storage access is confined to one module, and swapping the provider requires
   editing only that file.
4. No secret appears anywhere in the repository.
5. The failure path shows a usable message in both languages, never a raw error.
6. `npm run build` and `npm run check` clean, and the Cloudflare build succeeds
   with the D1 binding active.

## Out of scope

Relocating storage to Africa, which is its own item when the time comes. Any
CRM or webhook integration.
