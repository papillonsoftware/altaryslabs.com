# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is the **ALTARYS LABS showcase website** repository — a static one-page site hosted on GitHub Pages for an Ivorian technology company operating in OHADA markets (17 francophone African countries). The repo contains specification documents and the generated website files.

## Key Reference Documents

Read these before generating or modifying the website:

| File | Purpose |
|------|---------|
| `docs/vitrine/prompt-vitrine-altaryslabs-v2.md` | **Primary spec** — site structure, editorial tone, design constraints, visual hierarchy |
| `docs/vitrine/altarys-brand-identity-v3.1.html` | **Brand identity** — CSS variables, Google Fonts, SVG logomarks (reuse as-is, do NOT redraw) |
| `docs/vitrine/platform-vision-prd.md` | **Product PRD** — module descriptions, personas, differentiators, MVP scope |
| `docs/vitrine/platform-saas-blueprint.md` | **Architecture blueprint** — multi-tenancy, Spring Modulith, technical credibility content |
| `claude-code-session-opener-en.md` | **Session workflow** — step-by-step instructions for generating the website |

## Build & Deploy

- **Stack**: Pure HTML5 + CSS3 + Vanilla JS (no framework, no bundler)
- **Hosting**: GitHub Pages (static files only)
- **Contact form**: Formspree (or mailto: fallback) — no server-side backend
- **Expected output files**: `index.html`, `CNAME` (altaryslabs.com), `robots.txt`, `assets/favicon.svg`

## Critical Rules

### Language
- **All user-facing text** (headings, paragraphs, buttons, meta descriptions, alt texts, form labels): **FRENCH**
- **All specs and documentation**: English

### Color Palette (Strict)
- **Navy + Gold** (`#07111E`/`#0F1724` + `#C8922A`/`#E5B55A`) = ALTARYS LABS sections (HERO, SERVICES, EXPERTISE, CONTACT)
- **Amber** (`#D4810A`/`#F5A623`) = Papillon HR Suite (PRODUCTS section only)
- **Teal** (`#1A8FA0`/`#4DB8CC`) = ALTARYS ENTERPRISE (brief mention in PRODUCTS only)
- **Violet is FORBIDDEN** — reserved for altarys.ai (future product)

### Typography (Google Fonts)
- **Cormorant Garamond** (300, 400, 600) — marketing headings
- **DM Sans** (300, 400, 500, 600) — body text, buttons
- **Space Mono** (400, 700) — technical data, badges, module status labels

### Visual Hierarchy
Services-first, Products-second. The primary visitor is an Ivorian executive (DG, DSI, DRH) evaluating IT contractors, NOT a SaaS early adopter.

### 6-Section Structure
HERO → NOS SERVICES (60% emphasis) → NOS PRODUITS (40% emphasis) → EXPERTISE & MARCHÉS → À PROPOS → CONTACT

### SEO
Include Open Graph + Twitter Card meta tags in `<head>`. OG locale: `fr_CI`.

## Broader Platform Context

The website promotes two product lines built on a shared Spring Boot 4 / Spring Modulith backend:

- **Papillon HR Suite** — SMEs (2–350 employees), mobile-first, offline-first, amber palette
- **ALTARYS ENTERPRISE HR Suite** — ETI/Large enterprises (351+), desktop-first, navy/teal palette

Key platform differentiators to highlight: OHADA-native compliance (CNPS, ITS, SYSCOHADA), offline-first for 3G connectivity, multi-tenant with 4 DB isolation profiles, 14 HR/finance modules.

### Module Status for Products Section
- **Disponible**: PAYROL, QRCONTR, ABSMGT, COMMIT, BUDMGT
- **Bientôt**: EXPMGT, HRCORE, EMPMGT
- **En développement**: TIMACT, HSEMGT, PERFOB, GPEC, LTRAIN, ATSMGT, ADVDOC

## Quality Bar

Production-ready, portfolio-grade. The site must inspire confidence in a director evaluating contractors for 20–100 million FCFA tenders.