---
description: Review the changes of a work item branch
argument-hint: <work-item-id>
model: opus
---

## Role

Assume the REVIEWER personality. Read `.claude/personalities/REVIEWER.md` in full before reviewing. It defines the checklist (build, FR and EN parity, editorial guardrails, brand compliance, visual fidelity, SEO, accessibility, performance, code quality, deployment), the maximal bar on latent defects, the round-based output format, and the verdicts (APPROVED / CHANGES REQUESTED / REJECTED).

**NEVER review work you just wrote.** The reviewer is always a fresh, independent session. Non-negotiable, per `docs/AI_Development_Workflow.md`.

Read `CLAUDE.md` too. When any older document under `docs/vitrine/` contradicts it, `CLAUDE.md` wins. In particular: navy and gold only, three products, no ALTARYS ENTERPRISE, twelve business-facing HR module labels.

---

## Work item ID shape

`$ARGUMENTS` may be a **story**, a **fix**, a **refactor** or a **chore** ID. Parse it as `<PFX>[-FIX|-REF|-CHR]-<NNN>`.

| Prefix | Scope |
|---|---|
| `SITE` | Cross-cutting: build, tooling, repository-wide conventions, dependencies |
| `PAGE` | Pages, routing, navigation structure |
| `UI` | Components, tokens, styles, visual layer |
| `I18N` | Dictionaries, bilingual routing, FR and EN parity |
| `SEO` | Titles, meta, Open Graph, hreflang, sitemap, JSON-LD, robots |
| `FORM` | Contact form, Pages Function, D1, Turnstile, email notification |
| `OPS` | Cloudflare Pages, DNS, deployment, domain switch |

If the prefix is not in this table, STOP and flag: a new prefix is added to `docs/AI_Development_Workflow.md` first.

| ID shape | Type | Item doc to read | Review file to write |
|---|---|---|---|
| `<PFX>-NNN` | story | `docs/work-items/<ID>.md` | `docs/reviews/<ID>-review.md` |
| `<PFX>-FIX-NNN` | fix | `docs/work-items/<ID>.md` | `docs/reviews/<ID>-review.md` |
| `<PFX>-REF-NNN` | refactor | `docs/work-items/<ID>.md` | `docs/reviews/<ID>-review.md` |
| `<PFX>-CHR-NNN` | chore | `docs/work-items/<ID>.md` | `docs/reviews/<ID>-review.md` |

- The branch is `feat/`, `fix/`, `refactor/` or `chore/` prefixed. `git branch -a | grep -i <slug>` finds it regardless of type; the PR is the surest pointer.
- An **immediately-executed** fix, refactor or chore may have **no item doc** (see `docs/AI_Development_Workflow.md`, section "When is the tracking doc required?"). Review it against the branch diff plus its `docs/DECISIONS.md` D-row, and do NOT block solely on the missing doc.
- A **chore** touches docs, conventions or tooling only. It still has to leave `npm run build` green, but there is nothing to check visually; do not manufacture findings. If the diff touches page or component source, it is not a chore: flag the mislabel.

---

## If an ID was provided (e.g. `/review PAGE-004`)

1. Read the item doc if it exists, to understand the intended scope, the acceptance criteria and what was declared out of scope.
2. Find the branch: `git branch -a | grep -i <slug>`, or `gh pr view <num> --json headRefName`.
3. **Create a worktree on a dedicated review branch, forked from the work item's branch (MANDATORY),** so the review commit ships to that branch without detaching.

   *Why.* Checking out `<branch>` directly (the old form) fails silently into a detached HEAD whenever the author's own worktree still holds it, which is the common case during a review; the loss only surfaces at step 11, when the push has no branch to update. The two guards below turn that into a loud failure here instead. The first catches `git worktree add` itself failing, for instance because `review-<id-lowercase>` already exists from a prior round that was not torn down (see step 13). The second catches a detachment if the add somehow succeeds without landing on a branch. Chaining them with `||` on the same command they check, rather than as an unconditional next line, is what stops the second guard from firing against a worktree that was never created.

   *Do this*, and **record `START_DIR` now**: it is the directory the round starts in, and step 13 needs it after you have moved into the review worktree, where the same command would return the wrong answer.
   ```
   START_DIR=$(git rev-parse --show-toplevel)   # note this value, step 13 uses it
   git fetch origin
   git worktree add .claude/worktrees/review-<ID> -b review-<id-lowercase> origin/<branch> \
     || { echo "worktree add failed, stop"; exit 1; }
   git -C .claude/worktrees/review-<ID> symbolic-ref -q HEAD >/dev/null \
     || { echo "detached HEAD, stop"; exit 1; }
   ```
   **All subsequent work MUST happen inside `.claude/worktrees/review-<ID>/`.** Use absolute paths. You are **read-only on source**: never modify a source file, never fix a defect yourself. You report; the author fixes.
4. `git diff origin/refonte-multipages...origin/<branch> --stat`, then read every changed file. The base is `refonte-multipages`, the integration branch, never `main`. Diff `origin/<branch>`, the same ref step 3 forked the review worktree from, not the local `<branch>`: the two coincide almost always, and reviewing one content while diffing another is exactly the class of silent divergence this procedure exists to remove.
5. Read the relevant context:
   - `CLAUDE.md` - the authoritative contract
   - `docs/vitrine/refonte/PROMPT_altaryslabs-com-refonte.md` - the primary spec for the rebuild
   - `src/styles/tokens.css` - palette and type scales. **Not** `docs/vitrine/altarys-brand-identity-v3.1.html`, obsolete in full since D102
   - `docs/DECISIONS.md` - the D-rows relevant to this item
   - `src/i18n/routes.ts`, `src/i18n/fr.ts`, `src/i18n/en.ts` for anything touching routing or copy
6. **Generic correctness sweep via the `code-review` skill.** Invoke it by its **fully qualified name**, `code-review:code-review`, passing the PR number, to catch what the domain checklist does not enumerate.

   **Never write the bare `/code-review`.** Two different skills answer to that name and only one of them is yours to call. The bare name resolves to Claude Code's own **built-in** `code-review`, which is marked `disable-model-invocation`: it refuses every model invocation and its refusal message additionally forbids reproducing its analysis by other means. Only the founder can run that one, by typing it. The skill this step means is the **plugin** `code-review@claude-plugins-official`, whose command carries `disable-model-invocation: false` and which is therefore invocable, unattended rounds included. Its qualified name is the whole difference. Rounds 3, 4 and 5 of `SITE-FIX-002` all lost this mandatory step to that collision and all diagnosed it as an uninstallable plugin. See D082.

   **The plugin takes no options.** It reviews the whole PR and, at its own final step, posts its own comment on it. Accept that as a second, separate comment alongside the consolidated Round-N comment this procedure posts at step 12; do not try to suppress it. The `high` effort level and the `--comment` flag belong to the **built-in** skill, not to this one: D080 measured them on the skill the reviewer cannot invoke, which is the same confusion between the two that D056 and D057 made before it. D080 is annotated, not rewritten. See D082.
   - Treat findings as candidates: confirm each against the code before promoting it. Discard false positives.
   - Surface kept findings under a `### Correctness (code-review skill)` subsection **in this round's file**, classified `[BLOCKER]` / `[IMPORTANT]` / `[SUGGESTION]`. This file is the durable record.
7. **Run the build yourself**, in the review worktree:
   ```
   npm ci
   npm run build
   npm run check
   ```
   Both must be green. A build that only passes locally for the author is a blocker.
8. **Visual check** for anything that renders. Serve with `npm run preview`, then **read the URL it actually prints and capture against that one**. Never assume 4321: the port is shared by every worktree of this repository, and `astro preview` does not fail when it is taken, it slides to the next free one and says so ("Port 4321 is in use, trying another one..."). A reviewer who assumes the default captures another worktree's `dist` and visually validates content that is not the one under review, with no signal at all. If you have any doubt about which process owns the port, confirm it: `lsof -nP -iTCP:<port> -sTCP:LISTEN` then `lsof -p <pid> -d cwd` must show your own review worktree. Then drive a browser through the `chrome-devtools-mcp` plugin or the Claude in Chrome extension, screenshot at 360px, 768px and 1440px, and compare with the claude.ai/design prototype for that page (project `53d1c228-d274-4df3-8022-1a427dd96c15`, **ROOT** of the project, never the frozen `design_handoff_altaryslabs_refonte/` folder (that folder is the first, all-navy iteration and already caused the About page to be built obsolete on the day it merged)). Verify **both languages**. Report concrete deltas citing the token to use, never a hardcoded value. Fall back to a structural check plus an explicit owed-founder-eyeball note only when the page genuinely cannot be served, and say precisely why.
9. Apply the full checklist from `.claude/personalities/REVIEWER.md`:
   - **Build** - `npm run build` and `npm run check` green, run independently, nothing suppressed to make them pass
   - **FR and EN parity** - every key on both sides, `Dictionary` still derived from `fr.ts`, no hardcoded cross-language URL, reciprocal hreflang, language switcher lands on the counterpart page
   - **Editorial guardrails** - no price, no unapproved client name, no exact date, no invented figure, About page names one person, HR modules as business labels
   - **Brand** - navy and gold only, no amber, no teal, no violet, tokens only, correct fonts, no ALTARYS ENTERPRISE
   - **Visual fidelity** - conforms to the prototype, recreated with the repository's components, no inline-styled HTML copied from a `.dc.html`
   - **SEO** - title, meta, OG and Twitter tags, OG image actually present in `public/`, canonical, JSON-LD, sitemap, no orphan page
   - **Accessibility** - WCAG AA contrast, heading hierarchy, alt text, keyboard navigation, 44px targets, colour never the sole carrier of meaning
   - **Performance** - page weight, no gratuitous client-side JavaScript, image and font strategy
   - **Code quality** - components reused, copy in the dictionaries, French comments, no dead code
   - **Deployment** - static output, Functions under `/functions`, D1 binding still commented out, no secret, PR targets `refonte-multipages`
   - **Maximal bar** - block on every verified defect whatever its origin
10. Write the review to `docs/reviews/<ID>-review.md` **where the round is running**, which is the review worktree when step 3 opened one. Step 11 is what puts it on the work item's branch:
    - If the file already exists from a previous round, **append** a new `## Round N` section. Never overwrite.
    - Determine N by counting existing `## Round` headings and adding 1.
    - **If you are creating the file and the item continues an earlier one** (any `<PFX>-FIX-NNN` closing the findings of a `<PFX>-NNN`, or of a lower `-FIX-`), open it with a `**Continuity.**` line naming the previous rounds and the files holding them, before `## Round 1`. Find them with `ls docs/reviews/` plus the "Where things stand" section of the item doc. If the thread genuinely starts here, write one sentence saying so. Never leave the question open: a reader who finds an empty history concludes there is none. See D121.
    - Use the round format from `.claude/personalities/REVIEWER.md`.
    - Delegate the write itself to the `file-writer` subagent once the content is final, per the personality's token-efficiency rule.
11. Commit the review file, message in French, and push it explicitly onto the work item's branch with a refspec. The review worktree sits on its own `review-<id-lowercase>` branch, and `git worktree add -b ... origin/<branch>` **does** configure an upstream for it, `origin/<branch>` itself. That upstream simply does not carry the same name as the local branch, so under the default `push.default=simple` a bare `git push` is refused outright ("the upstream branch of your current branch does not match the name of your current branch"), and under another `push.default` it could push somewhere you did not intend. Naming the destination removes the question:
    ```
    git add docs/reviews/<ID>-review.md
    git commit -m "docs(review): ajouter la revue <ID> round <N>"
    git push origin HEAD:<branch>
    ```
    If that push is rejected as non-fast-forward, the author pushed to `<branch>` during the round. Do not force. Replay the branch tip under the review commit, then push again:
    ```
    git fetch origin
    git rebase origin/<branch>
    git push origin HEAD:<branch>
    ```
    Re-read the incoming commits before pushing: if they change the code under review, the round's findings may already be stale, and saying so in the round is part of the verdict.
12. Post the verdict plus a short summary as a PR comment: `gh pr comment <PR-number> --body-file <temp-summary-file>`. **Never open a separate review PR.**
13. **Tear down the review worktree and its branch (MANDATORY, do this before the round ends).**

    *Why.* `review-<id-lowercase>` is disposable: its only job was to carry the review commit without detaching, and that commit already lives on `<branch>` since step 11. Left behind, it makes `git worktree add -b review-<id-lowercase> ...` fail on the very next round of this same item, since git refuses to recreate a branch that already exists. That failure is caught, loudly, by step 3's first guard, which stops on "worktree add failed, stop"; what the teardown buys is a next round that starts at all, not a blind spot in the guards. If a stale `review-<id-lowercase>` is nonetheless found at the start of a later round, delete it before step 3 rather than working around it.

    *Where from.* Use the `START_DIR` you recorded at step 3, and **never run these from inside the worktree being removed**: `git worktree remove` deletes its own working directory, and a shell whose current directory no longer exists cannot run the next command, so `git branch -D` fails with "Unable to read current working directory" and the branch survives (verified). Do **not** recompute `START_DIR` here: by this point your working directory is the review worktree, step 3 having required it, so `git rev-parse --show-toplevel` would return the review worktree's own root and the paths below would point at a directory that does not exist. Worktree and branch operations reach the whole repository from any of its worktrees, so `-C` plus absolute paths keep these commands correct wherever the shell sits.

    *Do this:*
    ```
    git -C <START_DIR> merge-base --is-ancestor review-<id-lowercase> origin/<branch> \
      || { echo "the review commit is not on <branch> yet, do NOT delete the branch, fix step 11 first"; exit 1; }
    git -C <START_DIR> worktree remove <START_DIR>/.claude/worktrees/review-<ID>
    git -C <START_DIR> branch -D review-<id-lowercase>
    ```
    The first command is what makes `branch -D` safe. `review-<id-lowercase>` is disposable **only because** step 11 already put its commit on `<branch>`; if that push failed and the recovery did not go through, deleting the branch destroys the sole copy of the review, which is the exact loss D052 describes, moved from step 11 to step 13. Prove the commit landed before deleting anything.

    If `worktree remove` refuses because the worktree is dirty, **stop and look**. What matters there is an uncommitted review file that step 11 failed to commit, which is precisely the state worth rescuing; ignored artefacts such as `node_modules` or `dist` do not make a worktree dirty in git's sense and do not trigger this. Push what is worth keeping, then remove. Add `--force` only once you have confirmed nothing unsaved is lost.

---

## If no ID was provided (`/review` with no argument)

1. `git diff origin/refonte-multipages...HEAD --stat` to see the branch's changes.
2. Infer the ID from the branch name, the PR title or the changed paths.
3. Follow steps 5 to 13 above, with three of them inapplicable on this path rather than merely skipped by a step number: **steps 3, 4 and 13 do not apply.** This path reviews the branch already checked out, so no review worktree is opened and there is nothing to tear down. Step 11 is unchanged and still uses the explicit refspec, which works as written from the checked-out branch.

---

## Reminders

- **Never commit a review file on `main` or on `refonte-multipages`.** The review lives on the work item's branch so it ships with the code under review.
- **You never merge.** The founder merges.
- Never use the em-dash or the interpunct in the review file, the commit message or the PR comment.
