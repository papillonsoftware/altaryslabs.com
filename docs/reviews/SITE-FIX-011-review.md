# SITE-FIX-011 - Review

Work item: `docs/work-items/SITE-FIX-011.md`. Branch `fix/conventions-variables-et-perimetre-de-revue`, PR #38, base `refonte-multipages`.

## Round 1 - 2026-08-08
**Verdict**: CHANGES REQUESTED

Round run in a dedicated worktree, `review-site-fix-011`, forked from `origin/fix/conventions-variables-et-perimetre-de-revue` at `fb4f416`, on a branch and not detached, read-only on source. A stale `review-site-fix-011` worktree left by an earlier attempt was found at the start and removed before step 3, as the procedure requires, rather than worked around.

`npm ci`, `npm run build` and `npm run check` were re-run independently here: build green, 26 pages, sitemap generated, `astro check` 0 errors / 0 warnings / 0 hints on 65 files. `npx tsc --noEmit` exits 0, which is the command D117 exists to make pass, and the failure it fixes was reproduced by a sub-agent restoring `baseUrl` (TS5101). Nothing is suppressed: no `any`, no `@ts-ignore`, and `Dictionary` is still `Translated<typeof fr>` derived from `fr.ts`, untouched.

`src/i18n/fr.ts` is edited, so a visual non-regression pass was run rather than argued away. `npm run preview` served on **port 4324**, not 4321, 4322 or 4323, which were all held by other worktrees; the listener's `cwd` was confirmed with `lsof` to be this review worktree before any capture. Home and Contact were captured at 360, 768 and 1440 px in both languages with `bin/review_shots`. No delta: navy and gold only, no amber, no teal, no violet; the same thirteen page labels in the header, the footer and the contact select; PCS still "Disponible T3 2026"; RCCM `CI-ABJ`; "Papillon Corporate Finance Suite" keeping its "Suite" on both sides; three products and no ALTARYS ENTERPRISE. The Turnstile widget renders a connection error on `localhost`, which is the expected consequence of the widget's hostname allow-list and is not a finding.

What the diff does is correct on every point it claims. The `page-names.ts` extraction preserves the derivation rather than copying it, `satisfies Record<PageKey, string>` still guards the table, no file under `server/` or `functions/` imports `fr` any more, and the 28 KB Worker bundle was reproduced independently. `.env.example` genuinely does not exist and has never been tracked, so dropping the negation is safe. D100 is annotated and its original text is intact. No file gains a list of environment variables or a count, so D110 holds. D115 to D118 collide with no other local or remote ref. No em-dash and no interpunct appear in any added line.

The two findings below are both documentation defects, and both are introduced by this PR in files whose only job is to be exact.

### Blockers

- [ ] **[BLOCKER]** `CLAUDE.md:193-194`, `.claude/personalities/REVIEWER.md:158`, `docs/DECISIONS.md:135` (D116) - The review-corpus count is wrong in all three files, and two of the three contradict each other. `docs/reviews/` holds **eleven** files, of which **six** are French (`FORM-FIX-001`, `I18N-001`, `I18N-FIX-001`, `SITE-FIX-002`, `UI-001`, `UI-004`) and five are English (`FORM-001`, `PAGE-001`, `PAGE-002`, `UI-002`, `UI-FIX-003`). `CLAUDE.md` says "Four existing ones are French"; `REVIEWER.md` says "Four existing files are French (`UI-004-review.md`, `FORM-FIX-001-review.md`) or English (`FORM-001-review.md`, `PAGE-002-review.md`)", which counts four files in total and only two French. Six files are named nowhere. The root cause is visible in `docs/work-items/SITE-FIX-012.md:55-60`: the original round quoted four files as **examples** of a mix, and this PR read that enumeration as exhaustive. This blocks rather than waits, for three reasons. `CLAUDE.md` is the authoritative contract and a wrong sentence there is what the maximal bar exists for; `REVIEWER.md` seeds every round, so the error is re-read by every future reviewer; and D116 is a journal row that this repository's own rule annotates and never rewrites, so merging makes the miscount permanent and only correctable by a second row. -> Remove the count rather than correct it, exactly as D110 removed the variable count for the same reason: a number that can drift will drift. "The existing files are mixed, French and English; they are left as they are, and no new round may add to the mix." If a count is wanted, it is eleven files, six of them French, and the same figure has to appear in all three places.

### Important

- [ ] **[IMPORTANT]** `docs/work-items/SITE-FIX-012.md:26` - "Points 1 to 5 are kept below, struck through, for the record" describes something the document does not contain. The file has zero `~~` markers and the diff leaves items 1 to 5 at lines 47 to 65 byte-identical; nothing is struck through. The consequence is not cosmetic: point 4 still reads "**This needs a founder decision covering both families, then the D-row, in one direction or the other**" in bold, while D116 took that decision on the same day, so the list reads as open work on the one point the PR is proudest of settling. The section heading "Only 6 and 7 remain open" mitigates but does not correct it. -> Either apply the strikethrough the sentence promises to points 1 to 5, or reword the sentence to say the points are kept intact below with the mapping table above marking them settled. The second is the smaller change and matches what the document actually does.

### Suggestions

- **[SUGGESTION]** `docs/DECISIONS.md:115` (D096) - "The interest is rendered through `fr.pageName`" now names a symbol `server/notify-resend.ts` no longer imports, the table having moved to `PAGE_NAMES_FR`. This is explicitly **not** a defect: `docs/AI_Development_Workflow.md:202` says a superseded clause in an existing D-row is not one, and it is why the finding is non-blocking. It is raised only because D115 chose to annotate D100 for a comparable case in this same PR, so a one-clause pointer to D118 on D096 would leave the log internally consistent about when it annotates.
- **[SUGGESTION]** `wrangler.jsonc:64` - "et c'est deliberé" carries a single accent in a comment block that is otherwise deliberately unaccented ASCII, and the word is misspelled either way. Pre-existing, untouched by this PR, and a formatting matter no tool enforces. -> `delibere`.

### Correctness (code-review skill)

`code-review:code-review` was invoked by its fully qualified plugin name on PR #38 and completed: eligibility check, CLAUDE.md discovery, change summary, five parallel reviewers (CLAUDE.md compliance, shallow bug scan, git history, prior PR comments, code-comment guidance), confidence scoring, and its own PR comment. It posted one finding.

- [ ] **[BLOCKER]** `CLAUDE.md:193-194`, `.claude/personalities/REVIEWER.md:158`, `docs/DECISIONS.md:135` - The review-corpus miscount. Confirmed independently against the eleven files on disk before being promoted; it is the same defect as the blocker above and is not counted twice in the verdict.

Three candidates were discarded after checking them against the code:

- The shallow bug scan, the code-comment pass and the history pass each returned nothing, and their negative results were re-verified: every consumer of `t.pageName` and `t.contact.interestOther` still resolves to the same values, `en.ts` is structurally unaffected, and no comment or D-reference in the ten files read was left dangling.
- The D096 staleness, kept as a suggestion above under the `AI_Development_Workflow.md:202` rule rather than promoted.
- A finding about a document under `docs/kb/` was returned and is discarded without being restated: D116 puts that directory outside the review perimeter at any severity, and citing its contents here would be the finding the decision exists to stop.

### Summary

The change itself is sound: the platform rule is now stated in full in both files that carried the truncated form, the tsconfig fix is the terminal one rather than a silencer, and the `page-names.ts` extraction narrows the Worker bundle while keeping the single-table derivation D096 requires. What blocks is a fact this PR writes three times and gets wrong: `docs/reviews/` holds eleven files and six are French, not four, and one of the three places is a decision row that the repository never rewrites. A PR whose subject is that a half-stated rule costs an hour should not ship a miscounted one.
