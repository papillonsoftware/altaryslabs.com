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
3. **Create a worktree on a dedicated review branch, forked from the work item's branch (MANDATORY)**, so the review commit ships to that branch without detaching:
   ```
   git fetch origin
   git worktree add .claude/worktrees/review-<ID> -b review-<id-lowercase> origin/<branch> \
     || { echo "worktree add failed, stop"; exit 1; }
   git -C .claude/worktrees/review-<ID> symbolic-ref -q HEAD >/dev/null \
     || { echo "detached HEAD, stop"; exit 1; }
   ```
   Checking out `<branch>` directly (the old form) fails silently into a detached HEAD whenever the author's own worktree still holds it, which is the common case during a review; the loss only surfaces at step 11, when the push has no branch to update. The two guards above turn that into a loud failure here instead: the first catches `git worktree add` itself failing (for instance because `review-<id-lowercase>` already exists from a prior round that was not torn down, see step 13), the second catches a detachment if the add somehow succeeds without landing on a branch. Chaining them with `||` on the same command they check, rather than as an unconditional next line, is what stops the second guard from firing against a worktree that was never created. **All subsequent work MUST happen inside `.claude/worktrees/review-<ID>/`.** Use absolute paths. You are **read-only on source**: never modify a source file, never fix a defect yourself. You report; the author fixes.
4. `git diff origin/refonte-multipages...<branch> --stat`, then read every changed file. The base is `refonte-multipages`, the integration branch, never `main`.
5. Read the relevant context:
   - `CLAUDE.md` - the authoritative contract
   - `docs/vitrine/refonte/PROMPT_altaryslabs-com-refonte.md` - the primary spec for the rebuild
   - `docs/vitrine/altarys-brand-identity-v3.1.html` - brand identity
   - `docs/DECISIONS.md` - the D-rows relevant to this item
   - `src/i18n/routes.ts`, `src/i18n/fr.ts`, `src/i18n/en.ts` for anything touching routing or copy
6. **Generic correctness sweep via the `code-review` skill.** Run `/code-review <PR-number>` to catch what the domain checklist does not enumerate. The skill takes no `--effort` or `--comment` flag: it reviews the whole PR and, at its own final step, posts its own comment on it. Accept that as a second, separate comment alongside the single consolidated Round-N comment this procedure posts at step 12 - do not try to suppress it.
   - Treat findings as candidates: confirm each against the code before promoting it. Discard false positives.
   - Surface kept findings under a `### Correctness (code-review skill)` subsection **in this round's file**, classified `[BLOCKER]` / `[IMPORTANT]` / `[SUGGESTION]`. The skill's own PR comment is not the durable record, this file is.
7. **Run the build yourself**, in the review worktree:
   ```
   npm ci
   npm run build
   npm run check
   ```
   Both must be green. A build that only passes locally for the author is a blocker.
8. **Visual check** for anything that renders. Serve with `npm run preview`, drive a browser through the `chrome-devtools-mcp` plugin or the Claude in Chrome extension, screenshot at 360px, 768px and 1440px, and compare with the claude.ai/design prototype for that page (project `53d1c228-d274-4df3-8022-1a427dd96c15`, **ROOT** of the project, never the frozen `design_handoff_altaryslabs_refonte/` folder (that folder is the first, all-navy iteration and already caused the About page to be built obsolete on the day it merged)). Verify **both languages**. Report concrete deltas citing the token to use, never a hardcoded value. Fall back to a structural check plus an explicit owed-founder-eyeball note only when the page genuinely cannot be served, and say precisely why.
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
10. Write the review to `docs/reviews/<ID>-review.md` **on the work item's branch**:
    - If the file already exists from a previous round, **append** a new `## Round N` section. Never overwrite.
    - Determine N by counting existing `## Round` headings and adding 1.
    - Use the round format from `.claude/personalities/REVIEWER.md`.
    - Delegate the write itself to the `file-writer` subagent once the content is final, per the personality's token-efficiency rule.
11. Commit the review file, message in French, and push it explicitly onto the work item's branch, since the review worktree sits on its own `review-<id-lowercase>` branch, not on `<branch>`, and a bare `git push` would have no upstream to update:
    ```
    git add docs/reviews/<ID>-review.md
    git commit -m "docs(review): ajouter la revue <ID> round <N>"
    git push origin HEAD:<branch>
    ```
12. Post the verdict plus a short summary as a PR comment: `gh pr comment <PR-number> --body-file <temp-summary-file>`. **Never open a separate review PR.**
13. **Tear down the review worktree and its branch (MANDATORY, do this before the round ends), from the repository's main checkout, never from inside the worktree you are about to remove:**
    ```
    cd ../../..   # back out of .claude/worktrees/review-<ID>/ to the repository root
    git worktree remove .claude/worktrees/review-<ID> --force
    git branch -D review-<id-lowercase>
    ```
    `git worktree remove` deletes its own working directory; a shell whose cwd no longer exists cannot run the next command, so `git branch -D` fails with "Unable to read current working directory" and the branch survives (verified). This is why the `cd` above comes first, not why it can be skipped.

    `review-<id-lowercase>` is disposable: its only job was to carry the review commit without detaching, and that commit already lives on `<branch>` since step 11. Leaving it behind makes `git worktree add -b review-<id-lowercase> ...` fail on the very next round of this same item, since git refuses to recreate a branch that already exists - the round-2 failure mode step 3's guard cannot itself detect, because it happens one command earlier. If this step is somehow skipped and a stale `review-<id-lowercase>` is found at the start of a later round, delete it before step 3 rather than working around it.

---

## If no ID was provided (`/review` with no argument)

1. `git diff origin/refonte-multipages...HEAD --stat` to see the branch's changes.
2. Infer the ID from the branch name, the PR title or the changed paths.
3. Follow steps 5 to 12 above.

---

## Reminders

- **Never commit a review file on `main` or on `refonte-multipages`.** The review lives on the work item's branch so it ships with the code under review.
- **You never merge.** The founder merges.
- Never use the em-dash or the interpunct in the review file, the commit message or the PR comment.
