# SITE-FIX-002 - The review worktree lands on a detached HEAD

**Type** FIX | **Status** OPEN, second delivery in review | **Branches** `fix/worktree-de-revue` (merged, PR #21), then `fix/worktree-de-revue-r3` (closing round 3)
**Base** `refonte-multipages`

**Decisions** D052, D054, D064 and D065 in `docs/DECISIONS.md`.

**Observed on** the R1 round of `PAGE-001`, 31 July 2026.

## The defect

`.claude/commands/review.md`, step 3, instructs the reviewer to run:

```
git worktree add .claude/worktrees/review-<ID> <branch>
```

Git refuses to check the same branch out in two worktrees at once. During a normal review the author's worktree still holds that branch, so git does not fail: it **silently falls back to a detached HEAD**. The content is right, the diff is right, the review is right. Nothing signals a problem.

The breakage lands eight steps later. Step 11 commits the review file and pushes it. On a detached HEAD the commit is orphaned and the push has no branch to update, so the review never reaches the work item's branch. It disappears the moment the worktree is removed.

This matters because the whole review contract rests on one sentence: the review lives on the work item's branch so it ships with the code under review. A silent detachment breaks exactly that, and breaks it at the last step, after all the expensive work is done.

## Evidence

Observed directly during this session. The `review-PAGE-001` worktree sat at:

```
## HEAD (no branch)
HEAD       = 7c674d5
branch tip = 7c674d5
```

The reviewer noticed and improvised: it created a branch named `review-page-001` and pushed the review file from there. The review did land, in commit `e09475c`. **The procedure did not save it; the reviewer did.** The next round will improvise differently, or less well, or not at all.

## Why a FIX and not a chore

The document mandates a step that does not do what it says. A reader following it exactly produces a lost review. That is a false instruction, not a missing convention.

## What to fix

Both files, because they describe the same step and the two reviewer launchers share the second one:

1. **`.claude/commands/review.md`**, step 3
2. **`.claude/reviewer-append.txt`**, the "fork your own review worktree" bullet

Two candidate shapes. Decide and record the choice.

**Option A, recommended - a dedicated review branch.** Create the worktree on a new branch forked from the item branch, then push the review file onto the item branch explicitly:

```
git fetch origin
git worktree add .claude/worktrees/review-<ID> -b review-<id-lowercase> origin/<branch>
# ... review, write the file, commit ...
git push origin HEAD:<branch>
```

This is what the PAGE-001 reviewer converged on by itself, which is decent evidence that it is the natural shape. It never detaches, it is explicit about where the commit goes, and the review branch is disposable.

**Option B - assume the detachment.** Keep `--detach`, make it explicit rather than accidental, and push with the same `HEAD:<branch>` refspec. Fewer refs left behind, but it leaves the reviewer working in a state most readers find alarming, and any `git push` written without the refspec silently does nothing.

Whichever is chosen, add a **guard** immediately after the worktree is created:

```
git symbolic-ref -q HEAD >/dev/null || { echo "detached HEAD, stop"; exit 1; }
```

The guard is the part that actually matters. It converts a silent failure at step 11 into a loud failure at step 3, which is the only place a reviewer can still do something about it.

## Out of scope

- The review checklist, the verdict format, the number of rounds, the Writer / Reviewer separation. None of them change.
- `bin/review_shots` and the capture pipeline, which `SITE-FIX-001` owns.

## Acceptance criteria

1. Following `review.md` step 3 literally, with the item branch already checked out in another worktree, produces a worktree on a named branch, not a detached HEAD.
2. The guard fires and stops the round if a detached HEAD is reached anyway.
3. `.claude/reviewer-append.txt` describes the same procedure as `review.md`. They cannot diverge: both reviewer launchers read the append file, and a divergence between an attended and an unattended round is exactly the drift the shared file exists to prevent.
4. The chosen option is recorded as a D-row, with the rejected one named.
5. Verified by actually running a round, not by reading. A procedure defect that was invisible to reading is what created this item.

---

## Second delivery: closing round 3 (branch `fix/worktree-de-revue-r3`)

PR #21 shipped Option A and was merged on 7 August with round 3 still at CHANGES
REQUESTED. The remaining findings are closed on a follow-up branch rather than by
reopening the merged PR. Rounds 1 to 3 stay exactly as written in
`docs/reviews/SITE-FIX-002-review.md`; a merged record is annotated, never
rewritten (D053).

Round 3's blocker, step 6 mandating a `code-review` skill that D033 had retired,
**closed itself**: SITE-FIX-004 reinstated the skill in both files (D056, D057)
and was merged into the base. No action was owed on it.

What this delivery changes:

| Round 3 finding | Fix |
|---|---|
| IMPORTANT, step 13 claimed a residual branch escapes step 3's guards | The clause is deleted. The first guard does catch it, verified by replay; what the teardown buys is a next round that starts at all |
| IMPORTANT, "steps 5 to 12" excluded the mandatory step 13 | The no-ID path now names steps 3, 4 and 13 inapplicable and says why. See D065 |
| IMPORTANT, three documents disagreed on where the review file lives | `review.md` step 10 and `REVIEWER.md` file-convention and commit sections all now describe the review worktree plus the refspec push. Acceptance criterion 3 holds across all three |
| IMPORTANT, step 13 opened on `cd`, absent from the autonomous allowlist | Rewritten with `git -C` and absolute paths, no `cd` at all. The allowlist is left untouched: adding an entry for a command the procedure no longer contains would put back the dead entry SITE-FIX-001 deliberately removed |
| IMPORTANT, launchers seed the reviewer from a possibly stale tree | `bin/lib/fraicheur.sh`, sourced by both launchers. See D064 |
| SUGGESTION, relative path in step 13 | Closed by the `git -C` rewrite |
| SUGGESTION, `--force` masks an uncommitted review file | Plain remove first; force only after confirming nothing is unsaved |
| SUGGESTION, no exit from a non-fast-forward push | Step 11 documents the rebase recovery, and warns that incoming commits may have staled the round's findings |
| SUGGESTION, step 4 diffed the local ref, step 3 forked the remote one | Step 4 now diffs `origin/<branch>` |
| SUGGESTION, rationale fused with instruction | Steps 3 and 13 split into why, where from, and do this |
| SUGGESTION, `CLAUDE.md` hero lines | Out of scope, tracked by `I18N-001` |

Two latent bugs were found and fixed while writing the guard, neither reported by
any round: both launchers resolved `$(dirname "$0")` **after** `cd`, which breaks
on a relative `$0`; and the guard's own first draft inherited that shape.

### Verification actually run

- Step 3 nominal, in the exact D052 scenario: `refs/heads/review-test-r4`, no detachment.
- Step 3 collision, `review-test-r4` pre-existing: `fatal: a branch named 'review-test-r4' already exists`, non-zero exit, first guard fires. This is what makes the corrected step 13 wording true.
- Step 13 as written, `git -C` plus absolute paths, no `--force`: worktree and branch both gone, no residue.
- Freshness guard, three cases: current tree passes; tree 27 commits behind exits 1 with the remediation printed; non-git directory exits 1.

### Not covered here

The autonomous allowlist entry `Bash(npm ci:*)` does not match the compound form
(`cd <worktree> && npm ci`) a reviewer naturally writes for step 7. Rounds 1 to 3
ran regardless, so the harness tolerates it. Flagged, not changed: it is a
pre-existing shape and outside this item's scope.
