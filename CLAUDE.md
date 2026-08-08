# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is the **ALTARYS LABS showcase website**: a bilingual FR/EN multi-page site
built with Astro and deployed to Cloudflare Pages. ALTARYS LABS is an Ivorian
SASU publishing SaaS products and selling consulting services across the OHADA
and CIMA zones.

The site is currently being rebuilt. `main` still serves the legacy one-page
site through GitHub Pages and must not receive the rebuild until the DNS cutover
(the rebuild deletes `CNAME`).

## Branching

`refonte-multipages` is the integration branch and receives **no direct commits**.
Every unit of work lives in its own branch or worktree and lands through a PR
targeting `refonte-multipages`. That branch will itself be merged into `main`
only once the rebuild is complete and validated on the Cloudflare preview URL.

## Development Workflow (read first)

Work on this repository follows a defined workflow. Read it before anything else:

| File | Purpose |
|------|---------|
| `docs/AI_Development_Workflow.md` | **The workflow**: personalities, human gates, work item nomenclature, decision log, branch discipline, critical rules |
| `.claude/personalities/TECH_LEAD.md` | Architect + product owner + developer + designer, one session, one plan gate |
| `.claude/personalities/REVIEWER.md` | Independent review: build, FR/EN parity, brand, editorial guardrails, SEO, accessibility, performance, deployment |
| `docs/DECISIONS.md` | Decision log. Grep for the highest D-number before assigning new ones. |

Entry points:

| Command | Purpose |
|---|---|
| `bin/tech-lead "<ID> [slug]"` or `/tech-lead <ID>` | Start a work item. Sets up the worktree, keeps the plan gate. |
| `bin/reviewer "<ID> (PR #<num>)"` or `/review <ID>` | Attended review round, in a fresh session. |
| `bin/autonomous_reviewer "<ID> (PR #<num>)"` | Unattended background review round. Permissions from `.claude/autonomous-reviewer-settings.json`, which grants writes to `docs/reviews/**` only. |

Invoke `bin/reviewer` and `bin/autonomous_reviewer` **via the item's own worktree**
(`.claude/worktrees/<slug>/bin/reviewer "..."`), never via the main checkout: both
scripts seed the round from whatever `.claude/personalities/REVIEWER.md` says in
the directory they are run from, and the main checkout drifts the moment nobody
pulls it.

Non-negotiables it establishes:

- **Plan before execute.** Present a plan and wait for the founder's explicit
  approval before writing any file or running any state-changing command. A
  question that times out is not an approval.
- **Writer / Reviewer separation.** The REVIEWER is always a separate, fresh
  session. Nobody reviews their own work.
- **One work item at a time**, in its own worktree and branch, landing through a
  PR as described under Branching above.
- **Human gates**: plan approval, done gate, merge. None can be self-granted.

## Key Reference Documents

Read these before generating or modifying the website:

| File | Purpose |
|------|---------|
| `docs/vitrine/refonte/PROMPT_altaryslabs-com-refonte.md` | **Primary spec** for the rebuild: sitemap, editorial tone, constraints |
| `docs/vitrine/refonte/BRIEF_claude-design_altaryslabs-com.md` | Brief handed to claude.ai/design |
| `docs/vitrine/altarys-brand-identity-v3.1.html` | **OBSOLETE, kept for history only** (D102). Its colour section still carries the abandoned amber and teal palette and ALTARYS ENTERPRISE. Do not read it for values |
| `docs/vitrine/platform-vision-prd.md` | Product PRD: module descriptions, personas, differentiators |
| `docs/vitrine/platform-saas-blueprint.md` | Architecture blueprint: multi-tenancy, Spring Modulith, technical credibility content |
| `docs/vitrine/prompt-vitrine-altaryslabs-v2.md` | Legacy one-page spec, kept for history only |

The visual reference for the rebuild is the claude.ai/design project
`53d1c228-d274-4df3-8022-1a427dd96c15`, read through the `DesignSync` tool.

**It is also authoritative on the logomark since D086.** The web logomark is
defined by `Header.dc.html` and `Footer.dc.html` and implemented in
`src/components/Logo.astro`: a thicker diamond, and a wordmark in real HTML text
rather than SVG `<text>`.

**The v3.1 brand identity file is obsolete in full since D102**, not merely on
the logomark. Its colour section still lists the amber and teal palette
(`#D4810A`, `#F5A623`, `#1A8FA0`, `#4DB8CC`) that D015 removed, and presents
ALTARYS ENTERPRISE as a live product line. It is kept for history. The operative
references are this file for the rules, `src/styles/tokens.css` for the values,
and the design project for the form.

**The two share images are generated, not hand-drawn.** `bin/og_images` renders
`public/og-image.png` and `og-image-en.png` through headless Chrome from the
real Google fonts. **Nothing that can drift is written in the script**: the copy
is read from `home.heroTitle`, `home.heroEmphasis` and `home.ogSubtitle` in
`fr.ts` and `en.ts`, and the diamond geometry from `public/assets/favicon.svg`.
A share preview therefore cannot contradict the home page, nor repaint a stale
logomark.

Re-run it after changing the home hero copy or the logomark, and commit the two
PNGs. `bin/og_images --check` re-renders without writing and exits non-zero on
any drift. It refuses to write at all when a font failed to load, rather than
shipping a preview silently set in Times. See D101.

**A dated snapshot of its 15 root prototypes lives in
`docs/vitrine/refonte/prototypes/`** (13 pages plus `Header` and `Footer`, taken
on 2026-08-07, without `support.js`). It is there to be read offline, diffed and
cited in review. **The design project remains authoritative**: when the two
disagree, the project wins and the snapshot is stale. Never rebuild a page from
the snapshot without checking it against the project first. Building from a
frozen copy is precisely what produced an obsolete About page once already. See
D083.

**Read the prototypes at the project ROOT, not the ones in
`design_handoff_altaryslabs_refonte/`.** That folder is a frozen export of the
first, all-navy iteration. The root holds the live set: 13 `.dc.html` pages plus
shared `Header` and `Footer`, including `mentions-legales` and `confidentialite`
which the folder never had. Building the About page against the frozen folder
once already produced a page that was obsolete on the day it merged.

These are visual references, not production code. Recreate them with the
repository's own components; never copy the inline-styled HTML. `support.js` is
only the prototyping runtime and is irrelevant here, as is the `localStorage`
language switcher the prototypes use in place of our real routes.

**The prototypes are wrong on six points and the repository wins.** Each has a
row in `docs/DECISIONS.md`: D020, D017, D041, D032, D029 with D030, and D037,
in the order below.

1. the RCCM is `CI-ABJ`, not `CI-ABI`;
2. the product is "Papillon Corporate Finance Suite", with its "Suite";
3. the HR page keeps the softened OHADA coverage wording and no "MVP" jargon;
4. the legal texts are locked and the handoff only moves their footer links;
5. several prototype colours fail WCAG AA and are deliberately darkened;
6. **the English hero was left on the old positioning** while the French one
   changed. Rebuilding an English page from the prototype would silently revert
   it. The validated English line is "Your technology partner for businesses
   across Africa." with "OHADA and CIMA regions".

## Build & Deploy

- **Stack**: Astro 7 in static output, no UI framework, no adapter
- **Hosting**: Cloudflare Pages, build output `./dist`, Node 22
- **Config**: `wrangler.jsonc`
- **Contact form**: live since `FORM-001`. `functions/api/contact.ts` verifies
  Turnstile server side, stores the request in D1 and notifies through Resend,
  then answers `303` back to the contact page of the submitter's language with
  `?statut=envoye` or `?statut=erreur`.
  - **All storage access is confined to `server/contact-store.ts`**, the only
    file in the repository that contains SQL or names D1. The database sits in
    Europe and is assumed provisional; relocating it to Africa must touch that
    one file. See D090.
  - The schema lives in `migrations/`, applied with
    `npx wrangler d1 migrations apply altaryslabs-contact --remote`. It stores
    exactly the six fields section 2 of `/confidentialite` enumerates, plus a
    server timestamp and the page language. **Never the IP, the user-agent or
    `CF-IPCountry`**: the published policy closes that list. See D093.
  - **The environment variables are enumerated in exactly one place**: the `Env`
    interface of `functions/api/contact.ts`, which names each one, says whether
    it is required or optional and states what happens in its absence. This
    file, `wrangler.jsonc` and `.gitignore` deliberately carry neither the list
    nor its count: the scattered descriptions drifted from the code twice, once
    when D100 removed a variable and once when D106 made one optional. Read the
    interface, never a copy of it. `docs/kb/turnstile-d1-resend-setup.md` is
    **outside this rule and does list what to type**, being a portable tutorial
    for any project rather than a description of this one; it is not
    authoritative on what this project expects. See D110.
  - What holds regardless: they are posed on the Pages project in Production
    **and** Preview, the keys **must carry the Secret type, never Text**, and
    there is **no build-time variable at all**.
  - **The Turnstile site key is a constant in `src/i18n/config.ts`**, not an
    environment variable. It is not a secret and cannot be one: Turnstile
    requires it in the rendered HTML. Committing it publishes nothing that was
    not already served to every visitor, and rotating it always required a
    rebuild anyway, because the value is frozen into the static HTML.
  - **The platform rule that forced this**, worth knowing before debugging any
    build **or any missing notification**: because `wrangler.jsonc` carries
    `pages_build_output_dir`, that file is the source of truth for project
    configuration and **no plain-text dashboard variable reaches the project at
    all: not at build time, not at runtime**. Only secrets stay manageable
    there. At build the log says `Build environment variables: (none found)`
    while the dashboard clearly shows the variable set in both environments; at
    runtime there is no log at all, the function simply reads `undefined`.
    **Do not repeat the short form of this rule** - "Cloudflare stops reading
    dashboard variables *for the build*" - which is true, incomplete, and sends
    the next investigation to the wrong side: it implies runtime still works.
    See **D115**, which completes D100; D100 stated the build half only.

## Critical Rules

### Language
- **All user-facing text**: French on root routes, English under `/en/`
- **Code comments and commit messages**: French
- **Design documentation in English, learning material in French.** English
  covers everything written to be read by an agent or a future maintainer: the
  workflow, `DECISIONS.md`, the work items, the specs under `docs/vitrine/`,
  and **`docs/reviews/`**. Review files are written for the next reviewing
  agent, not for the founder alone, so they sit on the English side. The
  existing files are mixed, French and English; they are left as they are, and
  no new round may add to the mix. **No count is given here on purpose**: a
  number that can drift will drift, which is the same reason D110 removed the
  variable count.
- **`docs/kb/` is the only French side of that frontier, and it is excluded
  from review scope.** It holds tutorials and reference notes the founder asks
  for to build his own knowledge base; he is their only reader. Do not review
  them, do not report on their language, do not translate them. Reviewing a
  document whose sole addressee is the founder spends tokens and produces
  nothing. See **D116**.

### Routing and i18n
- `src/i18n/routes.ts` is the **single source of truth** for routing. French sits
  at the root (`/produits`), English is prefixed with translated slugs
  (`/en/products`). Because slugs are translated, no URL can be derived from the
  other: hreflang, the language switcher and the footer all read from `ROUTES`.
- The `Dictionary` type is derived from `fr.ts`. A missing translated key fails
  the build, on purpose.
- `en.ts` is a re-adaptation, not a translation. Its three validated audiences
  are anglophone Africa, international investors, and donors and NGOs. It spells
  out OHADA and CIMA and leans on offline-first and multi-country coverage rather
  than on CNPS/ITS specifics.

### Color Palette (Strict)

**Navy and gold only, across two surface families.** The July 2026 handoff makes
the site alternate cream and navy sections; it did not widen the palette beyond
navy and gold. See D028.

- **Dark surfaces**: `#07111E` and `#0F1724` backgrounds, `#1A2740` cards,
  `#040C16` footer, `#FAF7F2` text, `#C8922A` and `#E5B55A` accents
- **Light surfaces**: `#F6F2E9` background, `#FFFFFF` cards and form fields,
  `#FBF9F4` header, `#1A2740` headings, `#5B6472` body text, `#8B5E1B` gold text
- **Amber and teal are gone.** They belonged to a product split that no longer
  exists. Do not reintroduce them.
- **Violet is FORBIDDEN**: reserved for altarys.ai, a future product
- **Always a token from `tokens.css`, never a hardcoded hex in a component.**

**Two accessibility rules that override the mockups.** The prototypes fail WCAG
AA on small text in several places; the repository deliberately diverges. See
D029 and D030.

- `--gold-65` is a **border and decoration value only**, never a text colour.
  Eyebrows are `--gold-light` on dark and `--gold-deeper` on light.
- Small muted text is `--ink-60` on dark and `--slate-body` on light. Never
  `--ink-25`, `--ink-40` or `#8A93A6`, all of which fall below 4.5:1.

### Typography (Google Fonts)
- **Cormorant Garamond** (300, 400, 600, italic 300): marketing headings
- **DM Sans** (300, 400, 500, 600): body text, buttons
- **Space Mono** (400, 700): eyebrows, badges, technical labels

### Navigation and Sitemap
Products before Services, a deliberate positioning choice.

| Page | FR route | EN route |
|---|---|---|
| Home | `/` | `/en` |
| Products hub | `/produits` | `/en/products` |
| Papillon Collection Solution | `/produits/pcs` | `/en/products/pcs` |
| Papillon HR Suite | `/produits/papillon-hr-suite` | `/en/products/papillon-hr-suite` |
| Papillon Corporate Finance Suite | `/produits/papillon-corporate-finance` | `/en/products/papillon-corporate-finance` |
| Services hub | `/services` | `/en/services` |
| Consulting | `/services/conseil` | `/en/services/consulting` |
| Custom development | `/services/developpement-sur-mesure` | `/en/services/custom-development` |
| Sovereign AI | `/services/ia-souveraine` | `/en/services/sovereign-ai` |
| About | `/a-propos` | `/en/about` |
| Contact | `/contact` | `/en/contact` |

### SEO
Canonical, hreflang, Open Graph, Twitter Card, JSON-LD Organization and sitemap
are all handled centrally in `BaseLayout.astro`. OG locales: `fr_CI` and `en`.

## Product Lines

Three SaaS products on a shared Spring Boot 4 / Spring Modulith backend:

- **Papillon Collection Solution (PCS)**: contract renewal and premium follow-up
  for CIMA-zone insurers and brokers, over SMS, WhatsApp and email. Teaser page
  only, with a single external link to papillon-collection.com.
- **Papillon HR Suite**: OHADA-compliant HR and payroll for SMEs of 2 to 350
  employees, mobile-first and offline-first. Presented as 12 business-facing
  module labels, never as internal technical codes.
- **Papillon Corporate Finance Suite**: SYSCOHADA-compliant budgeting for OHADA
  SME finance departments, covering expenses and commitments. The name keeps
  "Suite". The design handoff drops it in most files and keeps it in
  `contact.dc.html`; the founder refused the rename. See D017 and D031.

Differentiators worth highlighting: OHADA-native compliance (CNPS, ITS,
SYSCOHADA), offline-first design for 3G connectivity, multi-tenancy with four
database isolation profiles.

## Editorial Guardrails (non-negotiable)

- Never display a price. Always "Contactez notre equipe commerciale".
- Never name a client or partner without prior explicit approval.
- Never put an exact internal deadline on a public page. Quarter or year only.
  PCS ships as "Disponible T3 2026", centralized in a single dictionary constant
  so it can flip to "Disponible" in one line after launch.
- Sovereign AI is written in the present indicative, affirmative register, never
  conditional.
- Never invent a client reference, a result figure or a testimonial.
- The About page names one person only: Emmanuel Blonvia, Fondateur et President.
  No org chart, no headcount, no bios.
- Never use the em-dash or the interpunct in generated text.

## Quality Bar

Production-ready, portfolio-grade. The site must inspire confidence in a director
evaluating contractors for tenders worth 20 to 100 million FCFA.
