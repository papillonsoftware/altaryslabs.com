# PAGE-001 - About page, French and English

**Type** STORY | **Mode** BOOTSTRAP | **Branch** `feat/page-a-propos` | **Base** `refonte-multipages`

**Decisions** D023, D024, D025, D026, D027 in `docs/DECISIONS.md`.

## Goal

Replace the `PageScaffold` placeholder on `/a-propos` and `/en/about` with the
final editorial content. About and Contact were the last four scaffolded pages;
after this item only Contact remains in both languages.

## Visual reference

claude.ai/design project `53d1c228-d274-4df3-8022-1a427dd96c15`, file
`design_handoff_altaryslabs_refonte/a-propos.dc.html`. Recreated with the
repository's own components, never by copying the inline-styled markup.

## Acceptance criteria

1. `/a-propos` and `/en/about` render the final content and neither imports
   `PageScaffold`.
2. Every `about` key exists in both `fr.ts` and `en.ts`; `npm run build` and
   `npm run check` are clean.
3. Exactly one person is named, in both languages, with the legal entity and the
   RCCM number correct.
4. Both pages render correctly at 360px, 768px and 1440px, on tokens only.

## Page structure

| Block | Content | Component |
|---|---|---|
| Lede | Eyebrow "A propos", H1 "Pourquoi ALTARYS LABS", mission paragraph, team paragraph | `PageHeader`, left aligned |
| Our approach | Three cards: regional compliance, offline-first design, data isolation | inline grid in `AboutContent` |
| Leadership | One card: Emmanuel Blonvia, Fondateur et President | inline in `AboutContent` |
| Legal line | Legal entity and RCCM, composed from the `footer` keys | inline in `AboutContent` |
| Call to action | "Discutons de votre projet" to the contact page | `CtaBanner` |

The three approach principles are sourced from `docs/vitrine/platform-saas-blueprint.md`
(offline-first PWA, the four database isolation profiles) and from the OHADA and
CIMA compliance already claimed on the product pages. Nothing new is asserted.

## Scope

**French**: the `about` block of `fr.ts`, `src/pages/a-propos.astro`.
**English**: the `about` block of `en.ts` as a readaptation, `src/pages/en/about.astro`.
The English page keeps the acronyms out of card titles and spells out both zones
in the lede, per D014.

**Shared**: `src/components/AboutContent.astro`, and a default slot added to
`PageHeader.astro` so a page header can carry a second paragraph. The addition
is inert for the six pages already using the component.

## Out of scope

- The Contact pages, the Pages Function, D1, Turnstile, Resend.
- Deleting `PageScaffold.astro`: the two Contact pages still use it. It is
  removed by the Contact work item, which is the last consumer.
- The legal texts, still pending review by a lawyer (D022).
- The `--ink-25` contrast of the footer legal line, a pre-existing accessibility
  observation reported at the done gate rather than fixed here.

## Known divergences from the reference documents

- `PROMPT_altaryslabs-com-refonte.md` section 4.10 lists a second name and the
  `CI-ABI` form of the RCCM. Both are superseded, by D025 and D020.
- The design handoff prototype carries neither the approach block nor the
  corrected RCCM. See D023 and D020.
