# Backlog - altaryslabs.com rebuild

State of play at the close of 31 July 2026. This index exists so a session that
resumes the work does not have to reconstruct it from a conversation it cannot
read. Item details live in `docs/work-items/`; decisions in `docs/DECISIONS.md`.

## Where the rebuild stands

26 pages built, bilingual, `npm run check` clean. Every page is final except the
two Contact pages, which are still `PageScaffold` placeholders.

**The site is still entirely navy.** The July 2026 handoff turns it into an
alternation of cream and navy, and `UI-001` installed that foundation **dormant**:
the tokens and the `.section--light` peritext exist, no page uses them yet, and
the default background has not been flipped. `UI-002` is the switch.

`main` still serves the legacy one-page site through GitHub Pages. Nothing has
been merged into it. The rebuild lives on `refonte-multipages`.

## Done

| Item | What it delivered |
|---|---|
| `PAGE-001` | About page, FR and EN |
| `UI-001` | Two-surface token system, `.section--light` peritext, twenty-three contrast corrections, `bin/contrast_sweep` |
| `SITE-FIX-001` | Reviewer tooling: `bin/review_shots`, correctness sweep spelled out, allowlist cleaned |
| `OPS-001` | Duplicate Cloudflare Pages project deleted, step 1 of 1 |

## Open, in dependency order

| Order | Item | Blocked by | Doc |
|---|---|---|---|
| 1 | `I18N-001` | nothing | `docs/work-items/I18N-001.md` |
| 1 | `UI-FIX-001` | nothing | `docs/work-items/UI-FIX-001.md` |
| 2 | `UI-002` | nothing, but see below | `docs/work-items/UI-002.md` |
| 3 | `PAGE-002` | `UI-002` | `docs/work-items/PAGE-002.md` |
| 4 | `FORM-001` | `PAGE-002` | `docs/work-items/FORM-001.md` |
| 5 | `OPS-002` | everything above | `docs/work-items/OPS-002.md` |

`I18N-001` and `UI-FIX-001` touch dictionaries and `LegalPage.astro`
respectively; `UI-002` touches `global.css`, the header, the footer and every
page. **Running `I18N-001` alongside `UI-002` is safe. Running `UI-FIX-001`
alongside it is not**, since both edit `LegalPage.astro`.

`OPS-002` is the DNS cutover and is a founder decision taken once, deliberately.

## Founder decisions still open

None of these blocks the items above, but each one will be asked eventually.

1. **Legal texts.** The notice and the privacy policy were adapted from
   papillon-collection.com and published pending a lawyer's review (D022). Their
   wording is locked against the handoff (D032), but not against a lawyer.
2. **Social accounts** for the footer. The handoff's five-column footer has no
   social column; if accounts are to appear, say so before `UI-002` builds it.
3. **Naming the technical stack** on the custom development page. Java, Spring
   Boot, React and TypeScript appear there today, and the handoff keeps them.
   Confirm or remove.
4. **`en.ts:349`**, the Services hub meta description, opens with "IT, HR and
   finance consulting" in lower case. `I18N-001` asks whether it follows the
   renamed service or stays a descriptive phrase.

## Working rules that cost time when forgotten

- **Read the prototypes at the ROOT** of the claude.ai/design project, never the
  frozen `design_handoff_altaryslabs_refonte/` folder. That folder is the first
  all-navy iteration and already caused a page to be built obsolete on the day
  it merged.
- **The prototypes are wrong on six points.** `CLAUDE.md` lists them with their
  decision rows. The repository wins on all six.
- **Run `bin/contrast_sweep` before declaring a UI item done.** Three review
  rounds in a row found colour classes that reading had missed. Measuring
  converges; enumerating does not. See D048.
- **D-numbers collide across branches.** Grep every open branch before
  reserving, as `docs/DECISIONS.md` explains at the top.
- Every branch that appends to `docs/DECISIONS.md` conflicts with every other
  one. The resolution is juxtaposition: the numbers are disjoint, no row is ever
  arbitrated against another.
