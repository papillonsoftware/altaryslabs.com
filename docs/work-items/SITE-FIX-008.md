# SITE-FIX-008 - `bin/tech-lead` seeds a session from an unchecked tree

**Type** FIX | **Status** OPEN, not started | **Branch to create** `fix/fraicheur-tech-lead`
**Base** `refonte-multipages`

**Decisions** extends D078 in `docs/DECISIONS.md`.

**Observed on** round 6 of `SITE-FIX-002`, 7 August 2026, reported as a suggestion.

## The defect

`SITE-FIX-002` established that `bin/reviewer` and `bin/autonomous_reviewer` seed a
session with `.claude/personalities/REVIEWER.md` as it exists in the tree the script
runs from, with no freshness check, and that a round so seeded applies annulled rules
without any way to notice. D078 records the guard that fixes it: `bin/lib/fraicheur.sh`,
sourced by both launchers, refusing to start when the files that seed a round are behind
`origin/refonte-multipages`.

`bin/tech-lead` has exactly the same shape and none of the guard. It seeds a session with
`.claude/personalities/TECH_LEAD.md` read from its own tree, and that tree drifts the
moment nobody merges the integration branch into the item branch.

## Why it is a separate item

The founder ruled it out of scope for `SITE-FIX-002` on 7 August. That PR was on its sixth
review round and already carried three blockers; adding an unreviewed file to it would have
widened the surface at the worst moment.

## Why it is lower severity than the reviewer case

A tech-lead session is attended: the founder is in the loop at the plan gate and at the done
gate, so a session running on stale instructions has two human checkpoints where the drift can
surface. An autonomous review round has none, which is why D078 was treated as blocking.
Lower, not absent: a stale `TECH_LEAD.md` can carry a superseded palette rule, a retired
convention or a forbidden reference folder into a whole session's work before anyone reads a
line of it.

## What to fix

`bin/lib/fraicheur.sh` already exists and is the shared implementation. The work is to call it
from `bin/tech-lead` and to widen its watched-file list, or to give the function a parameter, so
that a tech-lead session watches `.claude/personalities/TECH_LEAD.md` and `CLAUDE.md` rather
than the reviewer's three files.

Decide and record which of the two shapes is taken. A parameterised function keeps one guard;
two lists in one file keeps the call sites trivial. Neither is obviously right.

## Out of scope

- The narrowing criterion itself, settled by D078: a guard that counts every commit blocks every
  open PR of the repository.
- The `/review` and `/tech-lead` slash-command paths, which run inside an existing session where
  no shell executes. D078 already records that limit and its reason.
- Anything about the review procedure, which `SITE-FIX-002` owns.

## Acceptance criteria

1. `bin/tech-lead` refuses to start when the files that seed a tech-lead session are behind `origin/refonte-multipages`, and prints the offending commits.
2. It starts normally when they are current, verified on a branch that is behind the integration branch on other paths, since that is the ordinary state of an item branch.
3. The guard stays in one shared file. Two copies of the same procedure drift, which is what acceptance criterion 3 of `SITE-FIX-002` exists to prevent.
4. The chosen shape is recorded as a D-row extending D078, with the rejected one named.
5. Verified by running the launcher in both states, not by reading.
