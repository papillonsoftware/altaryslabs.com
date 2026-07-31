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
| `docs/vitrine/altarys-brand-identity-v3.1.html` | **Brand identity**: CSS variables, Google Fonts, SVG logomarks (reuse as-is, do NOT redraw) |
| `docs/vitrine/platform-vision-prd.md` | Product PRD: module descriptions, personas, differentiators |
| `docs/vitrine/platform-saas-blueprint.md` | Architecture blueprint: multi-tenancy, Spring Modulith, technical credibility content |
| `docs/vitrine/prompt-vitrine-altaryslabs-v2.md` | Legacy one-page spec, kept for history only |

The visual reference for the rebuild is the claude.ai/design project
`53d1c228-d274-4df3-8022-1a427dd96c15`, folder `design_handoff_altaryslabs_refonte`:
11 FR pages plus shared Header and Footer, as `.dc.html` prototypes. Those are
visual references, not production code. Recreate them with the repository's own
components; never copy the inline-styled HTML. Its `support.js` is only the
prototyping runtime and is irrelevant here.

## Build & Deploy

- **Stack**: Astro 7 in static output, no UI framework, no adapter
- **Hosting**: Cloudflare Pages, build output `./dist`, Node 22
- **Config**: `wrangler.jsonc`
- **Contact form**: Cloudflare Pages Function in `/functions`, D1 storage plus
  email notification, Turnstile anti-spam. The D1 binding is commented out until
  that work lands; reactivate it after `wrangler d1 create` and do not forget the
  comma after `pages_build_output_dir`.

## Critical Rules

### Language
- **All user-facing text**: French on root routes, English under `/en/`
- **All specs, documentation, code comments and commit messages**: French for
  comments and commits on this repo, English for specs

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
- **Navy + Gold only**: `#07111E` and `#0F1724` backgrounds, `#1A2740` cards,
  `#C8922A` and `#E5B55A` accents, `#FAF7F2` text
- **Amber and teal are gone.** They belonged to a product split that no longer
  exists. Do not reintroduce them.
- **Violet is FORBIDDEN**: reserved for altarys.ai, a future product

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
| Papillon Corporate Finance | `/produits/papillon-corporate-finance` | `/en/products/papillon-corporate-finance` |
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
- **Papillon Corporate Finance**: SYSCOHADA-compliant budgeting for OHADA SME
  finance departments, covering expenses and commitments.

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
