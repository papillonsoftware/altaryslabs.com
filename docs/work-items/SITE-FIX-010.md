# SITE-FIX-010 - Two workflow guards: quote a review's scope, and re-check D-numbers before committing

**Type** FIX | **Status** IMPLEMENTED | **Branch** `fix/perimetre-des-items-de-suite`
**Base** `refonte-multipages` at `7f0fc12`

## Why this item exists

Two workflow gaps were exercised in the same session, on `FORM-001` and
`FORM-FIX-001`. Neither is a code defect and neither would ever be caught by a
build, a review round or a human gate, because both are failures of a process
that had no rule to break.

They are recorded together because they share a shape: in each case a step that
depended on the author's care was replaced by a step that does not.

## What changed

`docs/AI_Development_Workflow.md` only. No code, no `CLAUDE.md`, no personality
file.

| Section | Change |
|---|---|
| new, after **End-to-end flow for one work item** | **Follow-up items born from a review**, carrying both new rules |
| **Decision log** | a paragraph stating that a D-number can be born after the survey |

## Guard 1: quote a review's scope, never summarise it

`FORM-001` round 1 named a single follow-up item and scoped it to "the blocker
and the important findings". The plan for that follow-up proposed a two-item
split, deferred three `IMPORTANT` findings to the second item, and presented the
split as what the review required.

The split was arguable. Presenting it as an external requirement was not: it
left the founder having to argue with a document rather than with the author,
which is the one thing a plan gate cannot help with. **A gate shows the founder
the author's framing, so no amount of care at the gate substitutes for quoting
the source.**

The second rule in the same section names the mechanism that produced the first.
The four remaining findings were all one-line corrections, so they were grouped
by effort, and the group was then labelled after its most trivial member. That is
how `IMPORTANT` findings ended up inside a `CHR` item. Cheap to fix and not
serious are different properties.

Found by the founder reading the proposed prompt. No check in the workflow could
have surfaced it.

## Guard 2: a D-number can be born after the survey

The existing instruction, "grep for the highest D-number before assigning new
ones, across every open branch", is correct and insufficient. It reads as a
completeness rule about branches, when the real hazard is timing.

`FORM-FIX-001` surveyed every branch, found `UI-FIX-003` holding D101 alone, and
reserved D102 to D106. `UI-FIX-003` then added D102 **during its own review
round**, after the survey, and merged first. The collision surfaced as a merge
conflict on `docs/DECISIONS.md` and cost a renumbering of five rows plus their
references across four code files and a work item doc.

## Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | The workflow document states that a follow-up item's scope is quoted verbatim from the review, with the incident named | **met** |
| 2 | It states that findings are classified by the reviewer's severity, not by effort | **met** |
| 3 | The decision-log section requires re-checking D-numbers immediately before committing, with the incident named | **met** |
| 4 | Nothing outside `docs/AI_Development_Workflow.md` and `docs/DECISIONS.md` is touched | **met** |

The two guards were applied to this item as it was written: the D-numbers were
re-surveyed across every local and remote branch immediately before committing,
confirming D107 as the highest and held by `FORM-FIX-001`.

## Decisions recorded

D108 and D109.

## Out of scope

The `docs/kb/` language and review-perimeter frontier, the incomplete rule in
D100, and the three non-blocking suggestions from `FORM-001` round 1, all of
which belong to `SITE-FIX-011`. The three remaining `IMPORTANT` findings of that
round, which belong to `FORM-FIX-001` and its open PR #36.
