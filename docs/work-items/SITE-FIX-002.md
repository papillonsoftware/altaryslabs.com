# SITE-FIX-002 - The review worktree lands on a detached HEAD

**Type** FIX | **Status** OPEN, not started | **Branch to create** `fix/worktree-de-revue`
**Base** `refonte-multipages`

**Decisions** D051 in `docs/DECISIONS.md`.

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
