# SITE-FIX-006 - Make the review procedure actually executable

**Type** FIX | **Status** DONE, round 2 pending | **Branch** `fix/procedure-de-revue`
**Base** `refonte-multipages`

**Decisions** D084, D085 in `docs/DECISIONS.md`.

**Origin** Round 5 of `SITE-FIX-002`, then round 1 of this item (CHANGES REQUESTED, 5 blockers).

## Scope

Documentation and tooling only. Nothing under `src/`, `public/`, `astro.config.mjs`, `wrangler.jsonc` or `package*.json`, and no rendered surface in the diff.

## What round 1 changed about this item

Round 1 was right on all five blockers, and the branch was rebuilt on top of `refonte-multipages` rather than rebased, because five of the eight original corrections had meanwhile been solved upstream by PR #28, #26 and #30, several of them better than here:

| Original correction | Outcome |
|---|---|
| Teardown via `git -C` | Upstream, and `Bash(git -C:*)` now in the allowlist |
| `bin/review_shots` and `lsof` authorized | Upstream |
| No-ID path | Solved upstream differently, by naming steps 3, 4 and 13 inapplicable. That version is better and this one was dropped |
| Preview port guard | Solved upstream better: read the URL astro actually prints, then confirm ownership with `lsof -p <pid> -d cwd` |
| Non-fast-forward recovery | `Bash(git rebase:*)` now in the allowlist |
| D-rows D064 to D066 | Collided three times as the backlog moved. Renumbered D084 and D085 |

Three findings remained true and are what this branch now carries.

## What ships

1. **The qualified skill name.** Step 6 and `REVIEWER.md` call `code-review:code-review`. The bare `/code-review` resolves to Claude Code's built-in skill, which carries `disable-model-invocation`, refuses every model invocation, and forbids reproducing its analysis otherwise.
2. **`Bash(git symbolic-ref:*)`.** The step 3 guard, which is the entire substance of `SITE-FIX-002`, matched no allowlist entry and could not run in an unattended round.
3. **`Edit(**/docs/reviews/**)`.** An unattended round writes its review inside `.claude/worktrees/review-<ID>/docs/reviews/`, which matched nothing. The inert `Write(docs/reviews/**)` is dropped: `Edit` rules already cover every file-editing tool, and the entry made the harness warn on every launch.

## The two-skill confusion, twice

D056 and D057 concluded that installing the plugin made step 6 executable. It did not: the step was written with the bare name, which reaches the built-in skill.

D080 then measured the built-in skill's `high` effort level and `--comment` flag and wrote them into the procedure as if they applied to the invocable one. The plugin takes no options and always posts its own comment.

Same confusion between the two skills, on two different surfaces, three rounds apart. Both rows are annotated, never rewritten, per the log's own convention.

## A method note worth keeping

Batch permission probes are unreliable. Asked to attempt five actions and report each, the probe model conflated a non-zero exit code with a permission denial, and abandoned reporting after the first refusal. Two findings were nearly recorded backwards on that basis.

Two rules came out of it, and both were applied here: probe **one gesture per run**, and confirm the outcome by its **real effect** (the file present on disk, the command's actual stdout), never by the model's own report. A third artefact: the global "plan before execute" rule makes a probe session refuse to act at all, which reads exactly like a permission denial unless an autonomy preamble is passed.

## Verification by execution

| Test | Result |
|---|---|
| `code-review:code-review` invoked on PR #21 | Skill loaded, stopped at its own step 1 on the closed PR, posted nothing |
| `git symbolic-ref -q HEAD`, allowlist before | DENIED |
| `git symbolic-ref -q HEAD`, allowlist after | Executed |
| Write into `.claude/worktrees/review-*/docs/reviews/`, before | DENIED |
| Write into the same path, after | ALLOWED, file confirmed present on disk |
| Write into `docs/reviews/` after dropping the `Write` entry | ALLOWED, `Edit(docs/reviews/**)` alone suffices |
| Edit a source file under `src/` | DENIED, read-only on source still holds |
| `npm run build`, `npm run check` | Green |

## Acceptance criteria

1. The generic-correctness sweep is invocable by an unattended round, proven by execution. **Met.**
2. The step 3 guard runs under the autonomous allowlist. **Met.**
3. An unattended round can write its review file where the procedure puts it. **Met.**
4. The reviewer remains structurally unable to modify a source file. **Met, probed.**

## Out of scope

`src/`, `public/`, `astro.config.mjs`, `wrangler.jsonc`, `package*.json`; the review checklist, verdict format, round count and Writer / Reviewer separation; everything already solved upstream and listed in the table above; rewriting any existing review round or D-row.

## Noted, not owned

A `review-I18N-001` worktree is still registered on `feat/copie-handoff`, a teardown a previous round did not perform. Left untouched.
