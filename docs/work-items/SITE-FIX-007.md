# SITE-FIX-007 - `REVIEWER.md` contradicts `CLAUDE.md` on two locked points

**Type** FIX | **Status** **DONE**, delivered by `I18N-FIX-002` on 2026-08-08
**Base** `refonte-multipages`

**Decision** D127 in `docs/DECISIONS.md`. Raised by the `I18N-001` round 1
review as a latent defect outside that PR's scope, and raised again by round 2 of
`docs/reviews/I18N-FIX-002-review.md`, the maximal bar blocking on a verified
defect whatever its origin.

`I18N-FIX-002` closed it without opening `fix/checklist-reviewer`. Three reasons:
that PR was already editing `REVIEWER.md` under D121; both corrections **apply
decisions already locked elsewhere** (D016 for the order, D017 and D031 for the
"Suite") rather than taking new ones; and the defect makes reviewers raise false
blockers against a correct site, which is the cost the whole thread exists to
remove. The specification below is kept as the record of what the defect was.

**This item cited D075 until then**, legitimately: D075 names it as one of its
two follow-ups. D127 records the delivery.

## The defect

Two lines of `.claude/personalities/REVIEWER.md` state the opposite of
`CLAUDE.md`, which is the authority that wins over every other document.

**Line 69**, in the brand-compliance checklist:

> Visual hierarchy holds: Services first, Products second.

`CLAUDE.md` locks the reverse, twice: "Products before Services, a deliberate
positioning choice", recorded as D016. The shipped site puts Products first, in
the header, the footer and the home page. **A reviewer applying the checklist to
the letter opens a blocker against a correct site**, and the more literally the
reviewer follows its instructions, the more certainly it happens. An unattended
round has nobody to catch it.

**Line 59**, in the editorial checklist, names the product
`Papillon Corporate Finance`, without the `Suite` that D017 and D031 lock. The
founder explicitly refused that rename when the design handoff proposed it, so a
reviewer reading line 59 could flag the correct name as wrong.

## Why it is its own item

It touches no page and no dictionary. It is tooling, and the file it fixes is the
one every future review round is seeded from, so it should land before the next
round rather than ride along with site work. It also collides with nothing.

## Scope

`.claude/personalities/REVIEWER.md`, two lines. Check `.claude/commands/review.md`
and `.claude/reviewer-append.txt` for the same two claims while you are there,
since D007 keeps the shared procedure in the append file and a contradiction
could be duplicated.

## Fix

- Line 69 becomes `Products first, Services second`, matching `CLAUDE.md` and
  D016, keeping the rest of the sentence about the executive audience.
- Line 59 becomes `Papillon Corporate Finance Suite`.

Neither needs a founder ruling: both restore what `CLAUDE.md` and existing D-rows
already lock. If a third contradiction turns up during the sweep, raise it rather
than deciding it.

## Acceptance criteria

1. `REVIEWER.md` no longer contradicts `CLAUDE.md` on navigation order or on the
   product name.
2. The same check is run over `.claude/commands/review.md` and
   `.claude/reviewer-append.txt`, and any duplicate of either claim is corrected.
3. No source file, page or dictionary is touched.

## A note for whoever picks this up

The reviewer that found this was reviewing something else entirely. The checklist
had been wrong since it was written and every round before this one either did
not reach that line or silently ignored it. Worth a moment's thought about what
else in the personality files has never been exercised.
