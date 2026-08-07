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

## Second delivery: closing rounds 3 to 6 (branch `fix/worktree-de-revue-r3`)

PR #21 shipped Option A and was merged on 7 August. **The last round before that
merge was round 5**, not round 3: rounds 4 and 5 (both 2026-08-05) also returned
CHANGES REQUESTED, and an earlier version of this section was written as if they
did not exist, which left three of their findings untriaged. Round 6 caught that.
Rounds 1 to 6 stay exactly as written in `docs/reviews/SITE-FIX-002-review.md`; a
merged record is annotated, never rewritten (D053).

The blocker that rounds 3, 4 and 5 all carried, step 6 mandating a `code-review`
skill that could not be invoked, **closed itself twice over**: SITE-FIX-004
reinstated the skill (D056, D057), and round 6 is the first round that actually
executed it, at `high`, 27 agents and 28 verified findings.

### Findings from rounds 3, 4 and 5

| Finding | Fix |
|---|---|
| IMPORTANT, step 13 claimed a residual branch escapes step 3's guards | Clause deleted. The first guard does catch it, verified by replay; what the teardown buys is a next round that starts at all |
| IMPORTANT, "steps 5 to 12" excluded the mandatory step 13 | The no-ID path names steps 3, 4 and 13 inapplicable and says why. See D079 |
| IMPORTANT, three documents disagreed on where the review file lives | Aligned across `review.md`, `REVIEWER.md` and `reviewer-append.txt`. Acceptance criterion 3 holds |
| IMPORTANT, step 13 opened on `cd`, absent from the autonomous allowlist | Rewritten with `git -C` and absolute paths. **The first attempt then left the allowlist untouched, which was wrong and round 6 blocked on it**: see D081 below |
| IMPORTANT, launchers seed the reviewer from a possibly stale tree | `bin/lib/fraicheur.sh`, sourced by both. See D078 |
| IMPORTANT R4 and R5, D055 gap in the decision log | Closed by the merge of `UI-002` |
| **IMPORTANT R5, `Write(docs/reviews/**)` missing from the allowlist** | Restored. `Edit` needs an existing file, so a round-1 autonomous review could not write its file at all. See D081 |
| **IMPORTANT R5, `bin/review_shots` missing from the allowlist** | Added. The mandatory visual check was impossible in autonomous mode. See D081 |
| **IMPORTANT R4 and R5, preview base-url guessed** | Step 8 and `reviewer-append.txt` now require reading the URL `astro preview` actually prints, with `lsof` to confirm process ownership. `astro preview` slides ports silently, so an assumed 4321 captures another worktree's `dist` |
| 5 suggestions carried since R1 | All closed: absolute path, plain `remove` before `--force`, rebase recovery, step 4 on `origin/<branch>`, rationale split from instruction |
| SUGGESTION, `CLAUDE.md` hero lines | Out of scope; `I18N-001` shipped them, `footer.tagline` remains with `I18N-FIX-001` (D063) |

### Findings from round 6

| Finding | Fix |
|---|---|
| **BLOCKER, the freshness guard forbade reviewing its own PR** | The comparison is restricted to the three files that actually seed a round. Whole-tree counting made every item branch fail, this one included, measured at 4 commits behind. See D078 |
| **BLOCKER, step 13's `git -C` escaped the allowlist** | `Bash(git -C:*)` added, plus `Bash(git rebase:*)` for the recovery path. Removing a `cd` to avoid one missing entry had created two. See D081 |
| **BLOCKER, `REVIEWER.md` asserted a permission that did not exist** | `Write(docs/reviews/**)` restored, which makes the sentence true without rewriting it |
| IMPORTANT, `<START_DIR>` recipe returned the wrong directory | `START_DIR` is now captured at step 3, before any move, and step 13 forbids recomputing it |
| IMPORTANT, step 10 referenced step 3 artefacts on the no-ID path | Step 10 made path-neutral: write where the round is running |
| IMPORTANT, "no upstream to update" was false | Corrected in both files: the upstream exists, it just does not share the branch name, so `push.default=simple` refuses a bare push |
| IMPORTANT, `branch -D` was unconditional | Guarded by `git merge-base --is-ancestor`. Unproven, it destroys the only copy of the review, which is D052's loss moved from step 11 to step 13 |
| **IMPORTANT, a shell bug was claimed that never existed** | Retracted, see below |
| IMPORTANT, the delivery section skipped rounds 4 and 5 | This section, rewritten |
| IMPORTANT, the skill's interface was described falsely | Corrected in both files against the observed behaviour. See D080 |
| IMPORTANT, D064 silently reversed an alternative D058 had rejected | The row (renumbered D078) now says so explicitly and says why D058's reason no longer holds |
| IMPORTANT, the guard does not cover the `/review` path | Stated in D078 as a known limit, with its reason: no shell runs on that path, and it is attended |
| SUGGESTION, unguarded `rev-list` | Wrapped, with a clean diagnostic like the two other cases |
| SUGGESTION, `--force` paragraph narrower than reality | Reworded: ignored artefacts do not make a worktree dirty |
| SUGGESTION, `bin/tech-lead` has the same defect | Out of scope by founder ruling. Tracked by `SITE-FIX-008` |

### A claim this item made and retracts

An earlier version of this section reported "two latent bugs found and fixed":
that both launchers resolved `$(dirname "$0")` **after** `cd`, breaking on a
relative `$0`. **That bug never existed.** The old form is a single line,
`cd "$(dirname "$0")/.."`, and the command substitution is evaluated before `cd`
runs. Replayed: a script invoked as `bin/x` from its parent prints the expected
root, exit 0. The `RACINE=...` refactor is harmless and still useful, since the
absolute path is what lets the launcher source `bin/lib/` after the `cd`, but it
fixed nothing, and the comment it carried taught false shell semantics to the
next maintainer. Both comments are reworded.

The renumbering of D064 and D065 to **D078 and D079** is unrelated to any review:
`PAGE-002` took those two numbers on the integration branch while this branch was
using them.

### Verification actually run

- Step 3 nominal, in the exact D052 scenario: named branch, no detachment. Confirmed independently by six review rounds.
- Step 3 collision, branch pre-existing: `fatal: a branch named ... already exists`, non-zero exit, first guard fires.
- Step 13 as written, from an item worktree in the D058 shape: worktree and branch both gone, no residue.
- Freshness guard: current tree passes; a tree behind on the three watched files exits 1 with the offending commits listed; non-git directory exits 1.
- The `$(dirname "$0")` claim, disproved by replay.

### Not covered here

The allowlist entry `Bash(npm ci:*)` does not match the compound form
(`cd <worktree> && npm ci`) a reviewer naturally writes for step 7. Six rounds ran
regardless, so the harness tolerates it. Flagged, not changed: pre-existing shape,
outside this item's scope.
