# SEO-FIX-001 - The Open Graph thumbnails carry the pre-handoff positioning

**Type** FIX | **Status** OPEN, not started | **Branch to create** `fix/vignettes-og`
**Base** `refonte-multipages`

**Decision** D075 in `docs/DECISIONS.md`. Raised as a blocker by the `I18N-001`
round 1 review, `docs/reviews/I18N-001-review.md`.

## The defect

`public/og-image.png` and `public/og-image-en.png` have the old positioning
burnt into pixels. They were generated on 30 July 2026 and no copy change since
has reached them.

| Thumbnail | What it displays |
|---|---|
| `og-image.png` | `Solutions technologiques pour les entreprises d'Afrique OHADA et CIMA`, subtitle `Suites SaaS, conseil IT, RH et Finance, developpement sur mesure.` |
| `og-image-en.png` | `Enterprise software built for African markets`, subtitle `SaaS platforms, IT, HR and finance consulting, custom development.` |

Three separate faults in those two files:

1. **The positioning is the one D042 and D043 retired.** Both titles are, word
   for word, the old heroes.
2. **The service name is the spelling D044 retired.** `conseil IT, RH et Finance`
   and `IT, HR and finance consulting` are exactly what `I18N-001` replaced
   everywhere else.
3. **The French thumbnail writes `developpement` without its accents.** A
   spelling error in a 1200x630 image is not a rendering artefact, it is in the
   source.

## Why it matters more than a meta string

`BaseLayout.astro` sets these as `og:image` and `twitter:image` on all 26 pages.
They are what renders in a WhatsApp or LinkedIn preview, which is how a link is
actually circulated to the audience this site is built for. **A director who
receives the link reads the old positioning before opening the page**, and reads
it in a form no CSS or dictionary change can override.

## Why it is not folded into `I18N-FIX-001`

Two reasons, both practical. The thumbnails must carry the copy that item is
still settling, so they can only be regenerated once it has landed. And a PNG is
not a string: it needs a design pass, a font, the diamond logomark and an export,
which is a different kind of work and a different kind of review.

## Scope

The two files under `public/`. No component, no page, no dictionary. If
`BaseLayout.astro` needs no change, do not touch it.

## What needs a founder ruling before any export

**The line each thumbnail carries.** Do not derive it silently. The natural
choice is the validated home hero, which after `I18N-001` reads
`Votre partenaire technologique pour les entreprises Africaines.` with
`Zones OHADA et CIMA`, and `Your technology partner for businesses across Africa.`
with `OHADA and CIMA regions`. Confirm before exporting, and confirm the subtitle
separately: the current one lists the three services and would become
`Suites SaaS, Conseil IT, RH & Corporate Finance, developpement sur mesure`,
which is long for the space.

**The capital of `Africaines`** is locked by D074 and reproduces as-is if the
hero line is used. That is deliberate, not a defect to silently normalise.

## Constraints

- 1200x630, the size the current files already use.
- Navy and gold only. The thumbnails stay dark even though the site is now light:
  a preview card sits on the reader's own background and dark reads better there.
  That is an observation, not a locked decision; raise it if you disagree.
- The diamond logomark is reused from
  `docs/vitrine/altarys-brand-identity-v3.1.html`, never redrawn.
- Cormorant Garamond for the title, DM Sans for the subtitle, as the current
  files already do.
- Accents on capitals. `Éditeur`, not `Editeur`.

## Acceptance criteria

1. Neither thumbnail contains any retired positioning, any retired service
   spelling, or any unaccented word.
2. Both render correctly in a link preview at the size social platforms crop to.
3. `npm run build` is green and both files are still referenced by
   `BaseLayout.astro` under `og:image` and `twitter:image`.
4. The French and English thumbnails say the same thing in their own language,
   per D014.
