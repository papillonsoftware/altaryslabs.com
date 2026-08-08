# SITE-FIX-017 - The language frontier over `docs/vitrine/`

**Type** FIX | **Status** OPEN, not started | **Branch** none yet
**Base** `refonte-multipages`
**Opened by** `SITE-FIX-011` round 2, deferred on the founder's explicit instruction

## Why this item exists

`SITE-FIX-011` converted the abstract rule "specs and documentation in English"
into a named, checkable claim: English covers "the workflow, `DECISIONS.md`, the
work items, the specs under `docs/vitrine/`, and `docs/reviews/`". Round 2 of
that item found the named part wrong.

Three of the five documents under `docs/vitrine/` are French:

- `docs/vitrine/prompt-vitrine-altaryslabs-v2.md`
- `docs/vitrine/refonte/BRIEF_claude-design_altaryslabs-com.md`
- `docs/vitrine/refonte/PROMPT_altaryslabs-com-refonte.md`

The last of these is the document `CLAUDE.md` designates the **primary spec** for
the rebuild. Only `platform-saas-blueprint.md` and `platform-vision-prd.md` are
English.

This is not a pre-existing defect that `SITE-FIX-011` merely revealed. The rule
it replaced said "English for specs" in the abstract; the new sentence names a
directory it did not verify, which makes the claim worse rather than clearer.

## The cost of leaving it

A review round is seeded from `.claude/personalities/REVIEWER.md`. As written,
that file tells the reviewer that everything under `docs/` other than
`docs/kb/` is English and that a factually wrong sentence there blocks. The next
round will therefore read the primary spec as a language violation and report it
correctly, round after round. That is exactly the recurring finding D116 was
written to retire, and it was already raised three times against the runbook
before D116 existed.

## What `SITE-FIX-011` did and did not do

Done there, both minimal and neither settling the question:

- D116 now says "the French side **named here**" rather than "the **only**
  French side", and records that the row settles `docs/kb/` and `docs/reviews/`
  only, pointing at this item for the rest. D116 was still a draft on that
  branch, so correcting it cost nothing; merged, it could only have been
  corrected by a second row.
- `CLAUDE.md` no longer names `docs/vitrine/` among the English documents.

Deliberately **not** done there: nothing was put in its place, and
`REVIEWER.md` and `docs/AI_Development_Workflow.md` keep the generic sentence
they already carried. The three seeded files therefore stay consistent with each
other, and this item words all three at once instead of inheriting a half
edit.

## Scope

State the frontier by **what it governs** rather than by directory inventory,
and write the same formulation into the three files a round is seeded from:

- `CLAUDE.md`, Critical Rules, Language
- `.claude/personalities/REVIEWER.md`, the `docs/kb/` exclusion section
- `docs/AI_Development_Workflow.md`, critical rule 12

The direction round 2 suggested, to be confirmed by the founder rather than
assumed: new design documentation is written in English, while the
founder-authored source prompts and briefs under `docs/vitrine/` are French
originals kept as they are and are not a language finding.

## Out of scope

- **Adding a count or an inventory.** Round 1 of `SITE-FIX-011` blocked on a
  count, round 2 blocked on an inventory-shaped claim, and D110 already settled
  the principle: a number or a list that can drift will drift. Whatever wording
  is chosen must hold without either.
- **Translating any document under `docs/vitrine/`.** The French originals are
  the founder's own and stay French.
- `docs/kb/`, settled by D116 and out of review scope entirely.
- Any page, component, style, route or dictionary key.

## Acceptance criteria

1. The frontier is stated in `CLAUDE.md`, `.claude/personalities/REVIEWER.md`
   and `docs/AI_Development_Workflow.md` in the **same formulation**, and no
   longer declares any French document under `docs/vitrine/` a language
   violation.
2. No count and no directory inventory is added to any of the three files.
3. A D-row records the frontier as governed by purpose rather than by directory,
   and annotates D116 to point at it. D116 is merged by then and is not
   rewritten.
4. `npm run build` and `npm run check` green; D-numbers re-swept across every
   local and remote ref immediately before committing.

## Note on D-numbers

At the time this fiche was opened, the highest merged row on
`refonte-multipages` was D114. D115 to D118 belonged to `SITE-FIX-011`, and
D119 to D134 were already taken by three items in flight: `I18N-FIX-002`,
`I18N-FIX-003` and `SITE-FIX-014`. Re-sweep before reserving; do not trust this
paragraph.
