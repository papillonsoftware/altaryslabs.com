# SITE-FIX-016 - The seven accounting gaps `bin/docs_check` returns on the integration branch

**Type** FIX | **Status** OPEN, not started | **Branch** none yet
**Base** `refonte-multipages`
**Decision** D134 in `docs/DECISIONS.md`

`SITE-FIX-014` delivered `bin/docs_check` and deliberately repaired nothing.
This item carries what the tool found, so that the finding is owned rather than
mentioned. The repository rule is that an out-of-scope defect materialises as a
work item **plus** a decision row; naming a follow-up in a pull request body
without a fiche is the abandonment that review blocked twice on this lineage.

## The seven gaps

Reproduce the list at any time with `bin/docs_check` from the repository root.

| # | Where | Check | The defect |
|---|---|---|---|
| 1 | `docs/BACKLOG.md:42` | `PR-STATE` | the row calls pull request 31 open; `gh` reports it merged on 8 August 2026 |
| 2 | `docs/work-items/I18N-FIX-002.md:11` | `PR-STATE` | the fiche calls pull request 31 open and carrying a CHANGES REQUESTED verdict; it is merged, and the delivery sits on another branch |
| 3 | `docs/work-items/FORM-001.md:3` | `STATUS` | the fiche says DONE, the backlog lists it in the open table at order 4 |
| 4 | `docs/work-items/UI-002.md:3` | `STATUS` | the fiche says OPEN not started, the backlog lists it in the done table |
| 5 | `docs/work-items/SITE-FIX-010.md:81` | `ITEM-NOFILE` | points at a `SITE-FIX-011` that has no file on the integration branch |
| 6 | `docs/work-items/SEO-FIX-001.md:7` | `D108-QUOTE` | born from a review, carries no verbatim quote |
| 7 | `docs/work-items/SITE-FIX-009.md:7` | `D108-QUOTE` | born from a review, carries no verbatim quote |

Gaps 1 and 2 are the same defect the round 1 review of `I18N-FIX-002` raised as
a blocker on 8 August. They are still live on the integration branch, which is
the clearest argument this item exists at all.

## Two founder rulings needed before this can be planned

**Does D108 bind fiches written before it?** D108 is dated 7 August 2026. Gaps 6
and 7 sit in fiches that predate it. Applying a rule retroactively is a choice,
not a reading. Either the two fiches gain their quote, or `D108-QUOTE` gains a
rule stating it binds only fiches opened after the decision.

**What happens to `SITE-FIX-011`?** Gap 5 points at an item whose file exists on
`fix/conventions-variables-et-perimetre-de-revue` and not on the integration
branch. Either that branch lands, or `SITE-FIX-010` is requalified.

## One defect the tool cannot see, recorded here so a human fixes it

`docs/work-items/SITE-FIX-009.md:6` cites D075 as its decision. D075 exists, so
`D-UNDEF` resolves it and says nothing; what is wrong is that D075 does not
cover the defect the fiche describes. This is the semantic class D132 records as
out of mechanical reach. It is written here because the only thing that will
ever catch it is a reader.

## Out of scope

The tool itself. Any change to the checks belongs to `SITE-FIX-014` or to a
later tooling item, not here.
