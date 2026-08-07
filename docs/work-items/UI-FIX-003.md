# UI-FIX-003 - Regenerate the share images and retire the v3.1 brand file

- **Type**: FIX
- **Branch**: `fix/vignettes-og`
- **Base**: `refonte-multipages`
- **Decisions**: D101, D102
- **Date**: 2026-08-07
- **Origin**: review round 2 of UI-004, `docs/reviews/UI-004-review.md`

## Context

UI-004 landed the D086 logomark on all 26 pages and left `public/og-image.png`
and `og-image-en.png` on the old one. Review round 2 called that a blocker
rather than pre-existing debt: the PR is what made the two disagree.

Two findings compound it. The English image still carried "Enterprise software
built for African markets", a positioning `en.ts` retired. **The French image was
equally stale** and no review had caught it: it said "Solutions technologiques
pour les entreprises d'Afrique OHADA et CIMA" where `fr.ts` says "Votre
partenaire technologique pour les entreprises Africaines. / Zones OHADA et CIMA".

These two files are what LinkedIn and WhatsApp render for every share of every
page. They were the only visual asset in the repository nobody could reproduce.

## Acceptance criteria

1. Both images carry the D086 logomark and the hero copy of `fr.ts` and `en.ts`,
   at 1200x630, with the composition of the originals unchanged.
2. `bin/og_images` regenerates both from source, reading its copy from the
   dictionaries, so the pair cannot drift from the home page again.
3. The v3.1 brand file and `CLAUDE.md` no longer point a reader at the abandoned
   amber and teal palette.
4. `npm run build` and `npm run check` are green, and no route, dictionary key or
   SEO tag changes.

## Scope

| File | Change |
|---|---|
| `bin/og_images` | New. Renders both images through headless Chrome, copy read from `fr.ts` and `en.ts`. `--check` mode compares without writing |
| `public/og-image.png` | Regenerated: D086 logomark, validated FR hero, accent restored on "developpement" |
| `public/og-image-en.png` | Regenerated: D086 logomark, validated EN hero |
| `docs/vitrine/altarys-brand-identity-v3.1.html` | Banner rewritten: the file is obsolete in full, with its three traps named |
| `CLAUDE.md` | The v3.1 row marked obsolete; the generated-images convention recorded |
| `docs/DECISIONS.md` | D101, D102 |
| `docs/work-items/UI-005.md` | Closed by this item; its two documentation errors corrected first |

## Findings from round 2, and their disposition

| Finding | Disposition |
|---|---|
| **[BLOCKER]** both images on the pre-D086 logomark | Fixed, both regenerated |
| **[IMPORTANT]** English image on retired positioning | Fixed, and the French one too, which the review had not caught |
| **[IMPORTANT]** the D086 banner endorses the obsolete colour section | Fixed. Founder went further than the finding: the whole file is retired, D102 |
| **[IMPORTANT]** `UI-005` typed `CHR` | Corrected to `STORY` before closing it: a visitor does see the difference |
| **[IMPORTANT]** `UI-005` cites `OG_IMAGES` | Corrected to `OG_DEFAULT` |

## Findings from UI-FIX-003 review round 1, and their disposition

| Finding | Disposition |
|---|---|
| **[BLOCKER]** D100 already taken by `FORM-001`, merged as PR #34 | Integration branch merged, rows renumbered to **D101 and D102**, nine cross-references reworked. `FORM-001`'s own D100 references left untouched |
| **[BLOCKER]** the font guard does not detect a load failure | Real defect. `document.fonts.status` reads `loaded` whether the faces arrived or not. Replaced by a per-family check of actually-loaded `FontFace` entries. Verified by mapping both font hosts to a dead port: three families reported missing, exit 1, and **both PNGs left untouched** |
| **[BLOCKER]** three operational documents still point at the retired v3.1 file | Fixed in `TECH_LEAD.md`, `REVIEWER.md` and `.claude/commands/review.md`. Each now names `tokens.css` and `Logo.astro` instead, and says why the old file must not be checked against |
| **[IMPORTANT]** three template colours are not the site's | Fixed. `LABS` and the title italic move to `--gold-light`, as `Logo.astro` and `global.css` set them on dark; the subtitle moves to `--muted`. The false comment claiming the colours came from `tokens.css` is rewritten |
| **[IMPORTANT]** Cormorant italic 400 loaded and unused | Removed from the font link |
| **[IMPORTANT]** "re-run after any logomark change" cannot work, the SVG is duplicated | Fixed at the root: the geometry is now read from `public/assets/favicon.svg`, the only standalone form of the mark in the repository. The instruction is true because the duplication is gone |
| **[IMPORTANT]** D101's "whole class of drift impossible" contradicted by the hardcoded subtitle | Fixed at the root rather than by weakening the claim: `home.ogSubtitle` is added to both dictionaries, so title, emphasis and subtitle all come from the same source. The D-row now records why the claim was false when first written |
| **[IMPORTANT]** `UI-005` acceptance criterion 3 claims "Met" falsely for English | Corrected with the real figures: French 71989 to 68629 octets (-4,7 %), English 60361 to 68873 (+14,1 %). The overrun is accepted and recorded, not hidden |
| **[IMPORTANT]** UI-004 review round 2 lives only on an unmerged head | Commit `afeb4e8` cherry-picked onto this branch, so the review that produced this item enters integrated history with it |

## Out of scope

The amber and teal swatches inside the v3.1 file are not purged. The banner
names them as traps instead. Rewriting a dated archive was refused on the same
grounds as the logomark in UI-004.

## Notes

- D090 to D100 are taken by `FORM-001`, merged as PR #34 while this item was
  being written. This item takes D101 and D102.
- The subtitle strings are the originals, kept on the founder's call: they list
  the offer and carry no positioning claim. Only the missing acute accent on
  "developpement" was restored.
