# Design prototypes - dated snapshot

The 15 prototypes at the **ROOT** of the claude.ai/design project
`53d1c228-d274-4df3-8022-1a427dd96c15`, taken on **2026-08-07**.

13 pages plus the shared `Header` and `Footer`. `support.js` is deliberately
absent: it is only the prototyping runtime and nothing in this repository
depends on it. The frozen `design_handoff_altaryslabs_refonte/` folder inside
the design project is also absent, on purpose. See D083.

## The design project remains authoritative

This directory exists so the visual reference can be read offline, diffed
between iterations, and cited in a review by someone who cannot reach the design
project. **It is not the source of truth.** When the snapshot and the project
disagree, the project wins and this copy is stale.

Building a page from a frozen copy without checking it against the live project
is what produced an About page that was obsolete on the day it merged. Do not
repeat it.

## These files are wrong on six points, and the repository wins

Each has a row in `docs/DECISIONS.md`. They are reproduced faithfully here,
errors included, because a snapshot that silently corrects its source is not a
snapshot.

| # | What the prototypes say | What the repository ships | Row |
|---|---|---|---|
| 1 | `RCCM CI-ABI-03-2026-B17-00070` | `CI-ABJ`, in `Footer`, `a-propos` and `mentions-legales` | D020 |
| 2 | "Papillon Corporate Finance", no "Suite", everywhere except one `option` in `contact.dc.html` | "Papillon Corporate Finance Suite" | D017, D031 |
| 3 | `produits-hr` keeps "MVP" jargon and a firm multi-country commitment | softened OHADA coverage wording, no jargon | D041 |
| 4 | new legal copy in `mentions-legales` and `confidentialite` | the shipped texts are locked; only their footer links moved | D032 |
| 5 | `#8A93A6`, `#9AA7BE`, `#B8791E` and `rgba(255,255,255,.25)` as small text | darkened tokens that meet WCAG AA | D029, D030 |
| 6 | `index.dc.html` English hero still on the old positioning | "Your technology partner for businesses across Africa.", "OHADA and CIMA regions" | D037, D043 |

Two more, specific to `Footer.dc.html` as snapshotted:

- both taglines carry the pre-handoff positioning. They are corrected by
  `I18N-FIX-001`, not by the item that reorganised the footer. See D063.
- the phone link breaks its label with `<br></br>`, which is not valid HTML. The
  repository uses a block-level label instead. See D077.

## How to refresh this snapshot

Read each path at the project root with the `DesignSync` tool, `get_file`
method, and write the returned content verbatim. Update the date at the top of
this file and say so in the commit message. Never edit a prototype by hand: a
hand-edited snapshot is worse than no snapshot, because it looks authoritative
and is not.
