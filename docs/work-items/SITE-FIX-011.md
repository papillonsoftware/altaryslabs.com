# SITE-FIX-011 - Conventions: the complete variable rule, and the `docs/kb/` review boundary

**Type** FIX | **Status** DONE, awaiting review
**Branch** `fix/conventions-variables-et-perimetre-de-revue` | **Base** `refonte-multipages`
**D-rows** D115, D116, D117, D118. D100 annotated.

## Why this item exists

Two conventions were stated incompletely, and each cost real time. Plus the
three non-blocking suggestions of `FORM-001` round 1.

This item is **not** the blocking findings of that round: those belong to
`FORM-FIX-001` and landed in PR #36.

## Scope, five points

### 1. The platform rule, stated in full (D115)

D100 said Cloudflare stops reading dashboard variables "for the build". True,
and half the rule. The missing half is that **no plain-text variable reaches
the project at runtime either**, and only secrets stay manageable. Read as
written, D100 implies runtime works, which sent an investigation to the wrong
side for an hour.

The same truncation had already produced a failure: `CONTACT_NOTIFY_EMAIL`
could not even be **created** as Text, so it never existed, and three real
contact requests were stored with no notification sent.

The truncated sentence lived in two files, both corrected here:

- `CLAUDE.md`, the Build and Deploy bullet, which is what the next session
  reads before the code.
- `wrangler.jsonc`, where round 2 of `FORM-FIX-001` added "a Text variable is
  INERT on this project, for the reason explained just below" above a paragraph
  explaining the build case only. The cross-reference pointed at nothing.

Both now carry an explicit instruction not to repeat the short form.
D100 is **annotated** to point at D115, never rewritten.

**No list of variables and no count is added anywhere**, per D110. The single
enumeration stays the `Env` interface of `functions/api/contact.ts`.

### 2. Two counter-intuitive facts, verified in session (D115)

Both cost debugging time, both are recorded in D115 rather than in `docs/kb/`,
that directory having been placed out of scope for this item by the founder.

- **A variable is attached to the deployment, not to the project.** Changing
  one has no effect until a new deployment is produced. Retesting immediately
  after a correction reproduces the old behaviour, and the correction looks
  wrong when it was right.
- **Turnstile accepts the subdomains of an authorised hostname.**
  `altaryslabscom.pages.dev` in the widget list already covers every per-branch
  preview URL. No widget reconfiguration is needed to test a preview.

### 3. The language frontier, and the review boundary (D116)

Founder's decision. The repository rule gains an explicit frontier:
**design documentation in English, learning material in French.**

- **`docs/kb/` is the only French side, and is excluded from review scope
  entirely** - not its language, not its accuracy, not its formatting, at any
  severity. It holds tutorials and reference notes the founder asks for to
  build his own knowledge base; he is their only reader.
- **`docs/reviews/` stays English**, being written for the next reviewing agent
  rather than for the founder alone. The four existing files are mixed, are
  left as they are, and no new round may add to the mix.

Written into the three files a round is seeded from: `CLAUDE.md`,
`.claude/personalities/REVIEWER.md` and `docs/AI_Development_Workflow.md`.
Recording it in one only would leave the other two contradicting it.

`FORM-001` round 1 reported the runbook as a language violation, correctly
against the rule as written. The rule is what needed fixing.

### 4. `tsconfig.json` (D117)

`npx tsc --noEmit` failed with `TS5101: Option 'baseUrl' is deprecated`,
invisible to `npm run check`, while `docs/work-items/FORM-001.md` claimed the
server layer had been verified with `tsc --strict`.

`baseUrl` is **removed**, not silenced with `"ignoreDeprecations": "6.0"`,
which expires when TypeScript 7 removes the option outright.

**The trade-off was found by verification, not by reasoning.** The first
attempt kept the non-relative target and failed with `TS5090: Non-relative
paths are not allowed when 'baseUrl' is not set`. The target is therefore
`"~/*": ["./src/*"]`. Both halves are recorded in the file so the next author
does not restore `baseUrl` to fix a symptom.

### 5. `server/notify-resend.ts` and `.gitignore` (D118)

The Function pulled the entire 20 KB French dictionary to resolve fourteen
strings. The labels move to `src/i18n/page-names.ts`, imported by `fr.ts` and
by the Function.

**The derivation is preserved, not replaced by a copy.** D096 requires a page
rename to reach the email without anyone thinking about it. A local `Record`
would satisfy the bundle while diverging silently in the one place nobody
would notice. One table, two readers. `satisfies Record<PageKey, string>`
stays, so adding a route without its label still fails the build.

`INTEREST_OTHER_FR` travels with the page labels because the notification must
render all seven values of the select, not six.

`.gitignore` drops `!.env.example`, which re-included a file that does not
exist. The "quatre variables" comment on the same block was already corrected
by `FORM-FIX-001` under D110.

## Acceptance criteria

1. The complete platform rule is stated identically in D115, `CLAUDE.md` and
   `wrangler.jsonc`; D100 is annotated and its original text intact; no file
   gains a list of variables or a count.
2. The frontier is written into `CLAUDE.md`, `REVIEWER.md` and
   `AI_Development_Workflow.md`; `docs/kb/` is named out of review scope and
   `docs/reviews/` is named English.
3. `npx tsc --noEmit` exits 0 with the `~/*` alias still resolving;
   `notify-resend.ts` no longer imports `fr`; `.gitignore` no longer
   re-includes a non-existent file.
4. `npm run build` and `npm run check` green; D-numbers re-swept across every
   local and remote ref immediately before committing.

## Verification performed

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm run check` | 0 errors, 0 warnings, 0 hints, 65 files |
| `npm run build` | 26 pages |
| Worker bundle, `npx wrangler pages functions build` | **44 KB before, 28 KB after** |
| Dictionary absent from bundle | `Aller au contenu principal` not found |
| Labels still present in bundle | `Papillon Corporate Finance Suite` found |
| `~/*` alias | resolves, 26 pages built from `src/pages/**` |

No rendered surface changed, so no browser pass at 360, 768 and 1440 px was
required. `fr.ts` is edited but every key and every value is unchanged: the
`pageName` table and `interestOther` are re-exported from the new module.

## Out of scope

- Everything PR #36 touched, which is now merged: the Turnstile `data-language`
  blocker, input preservation on error, panel focus, the `siteverify` hostname
  check, the double-submission guard.
- The `readField` split between "absent" and "longer than the maximum" in
  `functions/api/contact.ts`. It needs an error state able to carry a reason.
- Points 6 and 7 of `SITE-FIX-012`: the French colon spacing in three English
  `aria-label`s, and the unused off-palette `--ok` and `--err` tokens. Both are
  interface code and would force a full visual pass on a documentary PR.
- Any edit to `docs/kb/`, on the founder's instruction.
- Any page, component, style, route or dictionary key.

## Relationship to `SITE-FIX-012`

`SITE-FIX-012` was opened by `FORM-FIX-001` while this item was already in
flight, held by a parallel session; that is why D114 skipped to `012`. Its
points 1 to 5 are delivered here. Its fiche is reduced to points 6 and 7 in
this PR, with the mapping table kept rather than deleted.

## Incident recorded

A `cd` to the main checkout persisted across tool calls, and two commands ran
there instead of in this item's worktree: a `git checkout --` on three
unmodified files, and a `git merge` that fast-forwarded `refonte-multipages` to
`origin/refonte-multipages`. No commit was created, nothing was pushed, and no
change was destroyed in either tree. The rule broken is the personality's
"always in the worktree, always absolute paths"; every later command used
`git -C <absolute path>`.

## Merge order

PR #36 was merged during this item's implementation. This branch merged
`refonte-multipages` afterwards and resolved one conflict in
`server/notify-resend.ts`, keeping the `CONTACT_EMAIL` import that D106 added
alongside the new `page-names` import.
