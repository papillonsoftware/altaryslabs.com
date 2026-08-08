# SITE-FIX-013 - A review round that runs after its PR is merged loses its record

**Type** FIX | **Status** OPEN, not started | **Branch** none yet
**Base** `refonte-multipages`
**Opened by** `FORM-FIX-001`, see D114

## The defect

`.claude/commands/review.md` step 11 commits the round's review file and pushes
it onto the **work item's branch**:

```
git add docs/reviews/<ID>-review.md
git commit -m "docs(review): ajouter la revue <ID> round <N>"
git push origin HEAD:<branch>
```

and the same file closes with the rule that a review must **never** be committed
on `main` or on `refonte-multipages`, so that it ships with the code under
review.

Both are right while the PR is open. Together they are wrong the moment a round
runs **after** its PR has been merged: `<branch>` is then a dead branch that
will never be merged again, and the round's record never reaches the integration
branch. Nothing in the procedure warns the reviewer, and the push succeeds, so
the loss is silent.

## It has already fired once, and cost a record

`docs/reviews/FORM-001-review.md` was written by a round that ran after PR #34
was merged. It existed solely on `origin/feat/formulaire-contact` at `62a2148`,
on no other reference of the repository. The body of PR #36 linked to that path
and the link returned a 404 for anyone who followed it.

That matters more than a broken link. The repository treats the review file as
the **sole durable record of a round**, which is why `FORM-FIX-001` round 1
classed its loss as `IMPORTANT`: losing one empties the review loop of its
memory. The instance was repaired by cherry-picking `62a2148` onto
`fix/contact-langue-saisie-jeton`, which is a rescue and not a fix. The cause is
untouched and will fire again on the next round that runs late.

## Why it is its own item rather than part of `FORM-FIX-001`

Two reasons, and the second is the stronger one.

The fix edits `.claude/commands/review.md` and
`.claude/personalities/REVIEWER.md`, which are the reviewer's own instructions.
Changing them from inside an item that the reviewer is currently judging puts
the author's hand on the procedure being applied to them.

And the previous deferral of this same cause carried **no identifier at all**:
no number, no fiche, no D-row, no branch. The review that caught it called that
the degree zero of follow-up, since nothing can retrieve it. Giving it a number
is the point of this fiche.

## Suggested shape, not yet decided

The reviewer needs a rule for the case where `<branch>` is already merged. Two
candidate answers, and the choice is the founder's:

- push the record onto the item's branch **and** onto `refonte-multipages`, the
  second being an exception to the closing rule, narrowly scoped to a merged
  branch and to `docs/reviews/**` alone;
- or detect the merged branch at step 3 and open the review worktree from
  `refonte-multipages`, committing the record there directly.

Either way the procedure must **detect** the condition rather than rely on the
reviewer noticing it, because the failing push succeeds.

## Acceptance criteria

To be written when the item is planned. It carries at least: a round that runs
against an already-merged PR leaves its review file on a reference that reaches
`refonte-multipages`; the condition is detected by the procedure rather than by
the reviewer; and `.claude/personalities/REVIEWER.md` states the rule so a
reviewer seeded from it cannot miss it.

## Out of scope

The review worktree and teardown procedure, which works. The language of the
review corpus, which belongs to `SITE-FIX-012` point 4.
