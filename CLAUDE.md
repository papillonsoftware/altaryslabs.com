# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is the **ALTARYS LABS showcase website** repository: a static, bilingual FR/EN, multi-page site built with Astro and deployed on Cloudflare Pages, for an Ivorian technology company operating in OHADA markets (17 francophone African countries). The repository contains the specification documents and the site source.

## Development Workflow (read first)

Work on this repository follows a defined workflow. Read it before doing anything else:

| File | Purpose |
|------|---------|
| `docs/AI_Development_Workflow.md` | **The workflow**: personalities, human gates, work item nomenclature, branch discipline, critical rules |
| `.claude/personalities/TECH_LEAD.md` | Architect + product owner + developer + designer, one session, one plan gate |
| `.claude/personalities/REVIEWER.md` | Independent review: build, bilingual parity, brand, editorial guardrails, SEO, accessibility, performance, deployment |

Non-negotiables it establishes:

- **Plan before execute.** Present a plan and wait for the founder's explicit approval before writing any file or running any state-changing command. A question that times out is not an approval.
- **Writer / Reviewer separation.** The REVIEWER is always a separate, fresh session. Nobody reviews their own work.
- **One work item at a time**, in its own worktree and branch. Never work in the main checkout, never commit on `main`.
- **Human gates**: plan approval, done gate, merge. None of them can be self-granted.

## Key Reference Documents

Read the ones relevant to the work item before generating or modifying anything:

| File | Purpose |
|------|---------|
| `docs/vitrine/prompt-vitrine-altaryslabs-v2.md` | **Primary spec**: site structure, editorial tone, design constraints, visual hierarchy |
| `docs/vitrine/altarys-brand-identity-v3.1.html` | **Brand identity**: CSS variables, Google Fonts, SVG logomarks (reuse as-is, do NOT redraw) |
| `docs/vitrine/platform-vision-prd.md` | **Product PRD**: module descriptions, personas, differentiators, MVP scope |
| `docs/vitrine/platform-saas-blueprint.md` | **Architecture blueprint**: multi-tenancy, Spring Modulith, technical credibility content |
| `docs/vitrine/refonte/PROMPT_altaryslabs-com-refonte.md` | Multi-page redesign mission |
| `docs/vitrine/refonte/BRIEF_claude-design_altaryslabs-com.md` | Design brief for the redesign |
| `docs/DECISIONS.md` | Decision log (D-rows). Grep for the highest D-number before assigning new ones. |
| `claude-code-session-opener-en.md` | Legacy session opener from the one-page era. Superseded by `docs/AI_Development_Workflow.md`. |

## Build & Deploy

- **Stack**: Astro 7 in static output, `@astrojs/sitemap`, no adapter, TypeScript. No client-side framework.
- **Commands**: `npm run dev`, `npm run build`, `npm run preview`, `npm run check`
- **Hosting**: Cloudflare Pages, deployed from Git. Node 22 on the Cloudflare side.
- **Serverless**: Cloudflare Pages Functions live in `/functions` and are deployed by Cloudflare independently of the Astro build.
- **Contact form**: Cloudflare Pages Function, D1 storage plus email notification, Turnstile anti-spam. Not yet implemented.
- **`legacy/`** holds the previous single-page HTML site.

### Deployment constraints

- **`main` still serves the live site through GitHub Pages.** The redesign commit removes `CNAME`, so merging into `main` before the DNS switch breaks the live site immediately. That merge is a deliberate founder decision, made once.
- The working branch is `refonte-multipages`. Redesign work branches from it and targets it.
- Validation happens on the Cloudflare Pages preview URL of the working branch.
- Never create a Direct Upload Pages project: it cannot be converted into a Git-connected project.
- `wrangler.jsonc` must carry no placeholder binding identifier. An unresolved D1 `database_id` fails the Cloudflare build.
- No secret, API key or token is ever committed.

## Critical Rules

### Language

- **All user-facing text** (headings, paragraphs, buttons, meta descriptions, alt text, ARIA labels, form labels, error messages): **French on the FR side, English on the EN side.** No fallback in the other language, ever.
- **All specs, documentation, code comments and commit messages**: English.

### Bilingual Architecture

- **`src/i18n/routes.ts` is the single source of truth for routing.** French sits at the root (`/produits`), English is prefixed with **translated** slugs (`/en/products`). Because slugs are translated, no URL can be derived from the other one: hreflang, the language switcher and the footer all resolve through `ROUTES`. Never hardcode a cross-language URL.
- **The `Dictionary` type is derived from `fr.ts`**, so a missing English key fails the build. That is the only automated parity guard the project has. Never weaken it to unblock a build.
- **Parity is complete on all 11 pages.** A page that exists in French exists in English.
- **`en.ts` is a readaptation, not a translation.** Three validated audiences: anglophone Africa, international investors, donors and NGOs. OHADA and CIMA are spelled out in full; the emphasis shifts to offline-first and multi-country coverage rather than to CNPS and ITS.

### Color Palette (Strict)

- **Navy + Gold** (`#07111E`/`#0F1724` + `#C8922A`/`#E5B55A`) = ALTARYS LABS surfaces (hero, services, expertise, contact)
- **Amber** (`#D4810A`/`#F5A623`) = Papillon HR Suite (products context only)
- **Teal** (`#1A8FA0`/`#4DB8CC`) = ALTARYS ENTERPRISE (brief mention in products only)
- **Violet is FORBIDDEN**, reserved for altarys.ai (future product)
- Colors come from `src/styles/tokens.css`. No hardcoded hex in a component or a page.

### Typography (Google Fonts)

- **Cormorant Garamond** (300, 400, 600): marketing headings
- **DM Sans** (300, 400, 500, 600): body text, buttons
- **Space Mono** (400, 700): technical data, badges, module status labels

### Visual Hierarchy

Services-first, Products-second. The primary visitor is an Ivorian executive (DG, DSI, DRH) evaluating IT contractors, NOT a SaaS early adopter. Navigation order is Produits before Services.

### Editorial Guardrails (NON-NEGOTIABLE)

- **Never a displayed price.** Always "Contactez notre equipe commerciale" or its English equivalent.
- **Never a client or partner name** (NSIA, Orange, IBEMS, Bloomfield or any other) without explicit prior founder approval.
- **Never an exact date or sprint deadline on a public page.** Quarter or year only. PCS is labelled **"Disponible T3 2026"**, from a single dictionary constant so it can flip to "Disponible" in one line after launch.
- **Sovereign AI is written in the present indicative**, affirmative register, never in the conditional.
- **PCS is a short teaser** with a single external link to papillon-collection.com.
- **No invented client reference, result figure or testimonial.** On this market, credibility rests on the clarity of the technical discourse, not on fabricated proof.
- **About page**: names and titles only, no bios, until the founder says otherwise. Emmanuel Blonvia, President. Basile N'Guessan, Directeur Projets et Transformation.
- **Visuals**: typographic and geometric compositions derived from the diamond logomark. No stock photography.

### SEO

Open Graph and Twitter Card meta tags on every page. OG locale `fr_CI` on the French side, the English equivalent on the English side. Every referenced OG image must actually exist in `public/`: a missing one silently kills every social and WhatsApp preview. Correct canonical URL, reciprocal hreflang pairs, valid JSON-LD, new routes present in the sitemap.

### Accessibility

WCAG AA minimum. Gold on navy and amber on white are the two contrast pairs most likely to fail; measure rather than assume. One `h1` per page, no heading level skipped. Color is never the sole carrier of meaning, in particular for module status badges. Touch targets at least 44px. `prefers-reduced-motion` respected.

### Typography of generated text

Never use the em-dash (U+2014) or the middle dot (U+00B7) in any generated text, file content, commit message or comment. Use `-`, `.`, `;` or `|` instead.

## Broader Platform Context

The website promotes two product lines built on a shared Spring Boot 4 / Spring Modulith backend:

- **Papillon HR Suite**: SMEs (2 to 350 employees), mobile-first, offline-first, amber palette
- **ALTARYS ENTERPRISE HR Suite**: ETI and large enterprises (351+), desktop-first, navy and teal palette

Key platform differentiators to highlight: OHADA-native compliance (CNPS, ITS, SYSCOHADA), offline-first for 3G connectivity, multi-tenant with 4 DB isolation profiles, 14 HR and finance modules.

### Module Status for the Products Section

- **Disponible**: PAYROL, QRCONTR, ABSMGT, COMMIT, BUDMGT
- **Bientot**: EXPMGT, HRCORE, EMPMGT
- **En developpement**: TIMACT, HSEMGT, PERFOB, GPEC, LTRAIN, ATSMGT, ADVDOC

Do not promote a module to a higher status on your own. That is a founder decision.

## Quality Bar

Production-ready, portfolio-grade. The site must inspire confidence in a director evaluating contractors for 20 to 100 million FCFA tenders. The failure modes that matter here are credibility failures, and they are silent: a page missing in one language, a violet accent, a broken preview image, an unapproved client name.
