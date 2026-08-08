# SITE-FIX-014 - Review

## Round 1 - 2026-08-08
**Verdict**: CHANGES REQUESTED

Reviewed `origin/fix/docs-check` at `8ec4ee2` against `origin/refonte-multipages`,
in a dedicated review worktree on `review-site-fix-014`. PR #41, base
`refonte-multipages`, correct.

### What was verified independently

- `npm ci`, `npm run build`: green, 26 pages built. `npm run check`: 0 errors,
  0 warnings, 0 hints. Neither was made to pass by a suppression: the diff
  touches no TypeScript, no Astro file and no `package.json`.
- The diff touches `bin/` and `docs/` only. No page, component, token,
  dictionary, route, `wrangler.jsonc`, `functions/` or `public/` file is
  modified, so **no rendered surface changes**. The visual-fidelity pass is
  inapplicable here rather than skipped: there is nothing to compare against a
  prototype, and manufacturing a delta would be noise. `npm run build` was still
  run to prove the tree stays buildable.
- Bilingual parity, editorial guardrails, palette, typography, SEO surfaces,
  accessibility and Cloudflare configuration: no surface touched. `wrangler.jsonc`
  was read anyway under the maximal bar; the comma after `pages_build_output_dir`
  is present and `database_id` is a real identifier.
- No em-dash and no interpunct anywhere in the diff, including the new script,
  the four D-rows and the two fiches.
- No new dependency. `bin/docs_check` imports `node:fs`, `node:child_process`
  and `node:path` only, and the file is committed `100755` like its siblings.
- The two benches were replayed. Against `1818413` the tool returns the six
  findings the fiche names, at the exact lines it names, including the unclosed
  backtick at `I18N-FIX-002.md:23`. Against `2678c6f` it returns 7 gaps. On the
  delivery tree it returns the 7 gaps `SITE-FIX-016` lists, at the lines it
  lists. The `D-UNDEF`, `D-DUP`, `ITEM-NOFILE`, `STATUS`, `D108-QUOTE` and
  `MD-BROKEN` checks were each exercised on a synthetic tree and each fired.
- `D129` to `D132` do not collide. The highest number taken across all open
  branches is `D133`, on `fix/typographie-des-libelles-anglais`.

The tool works, its benches hold, and its self-declared blind spots are real and
honestly recorded. What follows is what the round found on top of that.

### Blockers

- [ ] **[BLOCKER]** `docs/work-items/SITE-FIX-014.md:105` and `docs/DECISIONS.md` -
  the fiche states the seven delivery gaps "are carried by `SITE-FIX-016`, with
  its own decision row", and `docs/work-items/SITE-FIX-016.md:5` cites `D129` as
  that row. `grep -n 'SITE-FIX-016' docs/DECISIONS.md` returns nothing. D129 to
  D132 are all four about `bin/docs_check` itself; not one of them opens
  `SITE-FIX-016`. The repository rule is a fiche **plus** a D-row, and D113 and
  D114 apply it twice on this very lineage, each opening its follow-up in the
  row's own first sentence, "SITE-FIX-012 is opened" and "SITE-FIX-013 is
  opened". The follow-up is therefore half-materialised, and the fiche asserts
  a compliance it does not have, which is worse than the omission alone -> add a
  D-row in the D113 shape, opening `SITE-FIX-016` in its first sentence to carry
  the seven gaps the tool returns on the integration branch, and point
  `SITE-FIX-016.md:5` at it rather than at D129.

- [ ] **[BLOCKER]** `bin/docs_check:244`, `:276`, `:311`, `:643` - three of the
  seven checks can switch themselves off in complete silence while the tool
  prints `AUCUN ECART, comptabilite de la prose juste` and exits 0. Confirmed by
  execution, three separate reproductions:
  1. a `docs/DECISIONS.md` that exists but yields no `| Dnnn |` row leaves
     `dDefinis` empty; the guard at `:244` only fires when the file is **absent**,
     so `verifierDUndef` returns at `:276` and `D-DUP` never runs. A tree
     carrying a live reference to an undefined decision number reports
     `AUCUN ECART` and exits 0;
  2. an absent `docs/work-items/` makes `verifierItemNofile` return at `:311`
     with no message of any kind. A tree containing a live "deferred to
     SITE-FIX-999" reference reports `AUCUN ECART` and exits 0;
  3. `--check`, the mode the header and the fiche both recommend before a push,
     gates the `ghDesactive` warning behind `if (!silencieux)` at `:643`, so an
     absent or unauthenticated `gh` drops `PR-STATE` with **zero bytes on stderr**
     and the run can exit 0 on six checks out of seven. Verified: `--check` with
     `gh` failing prints nothing at all.
  Both reachable preconditions for 1 and 2 are the `--root <old-commit>` bench
  workflow the header itself prescribes at `:95-101`. This is exactly the failure
  D132 was written to forbid, a coverage claim wider than the coverage, occurring
  inside the tool that records it -> never let a check disable itself without
  saying so, on stderr, in every mode including `--check`; and never print
  `AUCUN ECART, comptabilite de la prose juste` when a check did not run. Report
  the checks that actually ran, or exit 2 when one could not.

  Same site, opposite direction and part of the same fix: the message at `:244`
  is **not** gated by `silencieux`, so it prints under `--check`, which `:92`
  calls "silencieux, code de sortie seul".

### Important

- [ ] **[IMPORTANT]** `bin/docs_check:261-265` - `D-UNDEF` is blind to the plural
  `**Decisions**` header, which is the standard place a work item fiche declares
  its decision references. `D_CITATION` lists the singular `Decision` and the
  regex then demands `\s+`, which cannot match inside "Decisions". Verified on a
  synthetic tree, the plural line silent and the singular one caught:

  ```
  **Decisions** D404, D405 and D406 in `docs/DECISIONS.md`   -> nothing
  **Decision** D407 in `docs/DECISIONS.md`                   -> D-UNDEF
  ```

  Fifteen fiches under `docs/work-items/` use the plural form,
  `SITE-FIX-014.md:5` among them, so the tool cannot see its own item's decision
  references. D131 presents the whitelist as a deliberate under-detection of
  historical narrative; a reader will not infer from it that the fiche header is
  outside coverage -> add `s?` after `Decision` in `D_CITATION`, and record the
  form in D131 so the boundary stays stated.

- [ ] **[IMPORTANT]** `bin/docs_check:31-32` - the header cites D119 as settled
  fact ("D119 comptait quatre versions d'un commentaire la ou git log en montre
  trois"). D119 is defined nowhere on this branch nor on `refonte-multipages`;
  it lives on `fix/commentaire-en-ts`. On merge this becomes a dangling decision
  reference in the header of the tool built to catch dangling decision
  references, invisible to it only because the scan is `.md` only. D130 and D132
  deliberately avoid the number and say "the round 2 finding on a version count";
  the script did not follow them -> use the same wording as D132, or wait for
  `fix/commentaire-en-ts` to land before naming D119.

- [ ] **[IMPORTANT]** `bin/docs_check:391-395` - `MD-BROKEN` reports the wrong
  line for an unclosed `**` whenever the block also contains a backtick span that
  crosses a line. `texte.replace(/`[^`]*`/g, ' ')` collapses that span's newlines
  because `[^`]` matches `\n`, so `horsCode.split('\n')` no longer aligns with
  `tampon`, and `ligneOuvrante` indexes into a shorter array. Reproduced on a
  three-line file whose unmatched `**` sits on line 2: the tool reports line 1.
  The comment at `:358-361` promises the line where the delimiter stays open, and
  landing on the right line is the property the fiche cites as its strongest
  bench result -> replace the span by a same-length blank rather than by one
  space, or compute the bold parity per line on `tampon` with the spans stripped
  line by line.

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:138` - the table jumps from D114 to D129
  with no note. `docs/DECISIONS.md` annotates this exact situation twice already,
  for the D033 to D035 gap ("The gap is deliberate, not a missing entry") and for
  the D110 to D114 one. Fourteen unexplained missing numbers is a larger hole than
  either, in the file whose accounting this item exists to protect, and no check
  in `docs_check` sees a gap -> add a note naming D115 to D128 and the three
  branches holding them, in the shape the file already uses.

- [ ] **[IMPORTANT]** `docs/work-items/SITE-FIX-014.md:94` - "The same run shows
  the six findings above gone where the author fixed them, which validates the
  tool in both directions". Measured: at `2678c6f` five of the six are gone, and
  the sixth is not. The fiche calling pull request 31 open survives, and the tool
  still reports it, at `docs/work-items/I18N-FIX-002.md:43`. That reverse-direction
  claim is the item's own proof that the checks do not fire on repaired prose, and
  it is the claim the PR body repeats -> state five of six and name the survivor,
  which incidentally is gap 2 of `SITE-FIX-016` and strengthens the case for it.

- [ ] **[IMPORTANT]** `docs/BACKLOG.md:49` - `SITE-FIX-016` is placed at order 0
  in a table titled "Open, in dependency order", with `SITE-FIX-014` named in its
  own "Blocked by" column, while `SITE-FIX-014` is itself order 0. Every other
  order-0 row reads "nothing", and the table's own precedent puts a blocked item
  one level below its blocker (`SEO-FIX-001`, order 1, blocked by `I18N-FIX-001`;
  `FORM-001`, order 4, blocked by `PAGE-002` at order 3) -> move `SITE-FIX-016`
  to order 1.

### Suggestions

- **[SUGGESTION]** `docs/work-items/SITE-FIX-014.md:19` - "126 counting branches".
  Measured today across `refonte-multipages` and the three branches holding
  numbers: 114 plus D115 to D128 plus D133, so 129. The line is presented as a
  founder measurement at a point in time, which is defensible, but a bare count
  in prose is the class D132 names as out of mechanical reach; dating it or
  writing "more than 125" removes the decay.

- **[SUGGESTION]** `docs/BACKLOG.md:169` - the new rule says to run
  `bin/docs_check` before opening a pull request. The command exits 1 on the
  integration branch today and will keep doing so until `SITE-FIX-016` lands, so
  every author meets a red gate on seven defects none of them caused. Worth
  saying in the bullet, otherwise the first three authors learn to ignore the
  exit code, which is the adoption failure D131 argues against on the noise side.

- **[SUGGESTION]** `bin/docs_check:375` - `clore` takes a `fin` parameter that is
  never read; the two call sites pass `i` and `i + 1` as if it were. Drop the
  parameter or use it.

- **[SUGGESTION]** `docs/DECISIONS.md:136` (D131) and
  `docs/work-items/SITE-FIX-014.md:97` - "Proven on a synthetic tree". The two
  bench commits are citable and replayable by anyone, which is what makes them
  convincing; the synthetic tree is neither, since no fixture is committed. A
  four-line recipe in the fiche, or a fixture under `docs/`, would put the third
  proof on the same footing as the first two.

- **[SUGGESTION]** `bin/docs_check:261-263` - the `per` and `under` alternatives
  in `D_CITATION` carry no word boundary, so they can match inside a longer word.
  No false positive was observed on the corpus; a `\b` would close it.

### Correctness (code-review skill)

`code-review:code-review` was run on PR #41 and posted its own comment. Its
findings were re-verified here before promotion; six survived and are already
listed above, at the classification this round gives them rather than the
skill's:

- **[BLOCKER]** `SITE-FIX-016` claimed to have a decision row that does not exist.
- **[BLOCKER]** `--check` hides the `gh` degradation warning, and the
  `docs/DECISIONS.md introuvable` message escapes the same gate in the other
  direction.
- **[BLOCKER]** `D-UNDEF`, `D-DUP` and `ITEM-NOFILE` self-disable silently under
  an empty `dDefinis` or a missing `docs/work-items/`, with `AUCUN ECART` printed
  anyway.
- **[IMPORTANT]** `MD-BROKEN` wrong line with a multi-line backtick span.
- **[IMPORTANT]** `D-UNDEF` blind to the plural `**Decisions**` header.
- **[IMPORTANT]** the header cites D119, undefined on this branch.

Discarded as false positives after checking against the code:

- shared `g`-flagged regexes leaking `lastIndex` across lines and files.
  `String.prototype.matchAll` clones the regex and `replace` resets `lastIndex`;
  no leak is observable.
- `AVERTISSEMENT_SEUL` not really flipping `.claude/` and `CLAUDE.md` to blocking
  when emptied. `.some` on an empty array is always false, so `bloquant` becomes
  true for those files. The claim at `:64-65` holds.
- the `docs/reviews/` tier not being `D-UNDEF` only. Verified on a synthetic
  review file carrying both an undefined D-number and deliberately broken
  markdown: only `D-UNDEF` fired.

### Summary

The tool is real, its two benches replay exactly as the fiche describes, and its
recorded blind spots are honest; this is the right third application of the D048
gesture. It is blocked on two things: `SITE-FIX-016` is named everywhere as
having its own decision row and has none, which is the half-materialised
follow-up this lineage was blocked on twice; and three of the seven checks can
turn themselves off in silence while the run prints that the prose's accounting
is right, which is the exact coverage-wider-than-coverage failure D132 was
written to forbid, occurring inside the tool that forbids it.

## Round 2 - 2026-08-08
**Verdict**: CHANGES REQUESTED

Reviewed `origin/fix/docs-check` at `7087064` against `origin/refonte-multipages`
at `84d86c5`, in a dedicated review worktree on `review-site-fix-014`. PR #41,
base `refonte-multipages`, correct. Round 1 was run at `8ec4ee2`; the round 1
fixes are commit `7087064`.

### What was verified independently

- `npm ci`, `npm run build`: green, 26 pages built. `npm run check`: 0 errors,
  0 warnings, 0 hints. Nothing suppressed: the diff touches no TypeScript, no
  Astro file, no `package.json`.
- The diff touches `bin/` and `docs/` only. No page, component, token,
  dictionary, route, `functions/`, `public/` or `wrangler.jsonc` file changes,
  so **no rendered surface changes** and the visual-fidelity pass is inapplicable
  rather than skipped. A palette and guardrail sweep was run anyway under the
  maximal bar: no hardcoded hex outside `tokens.css`, no amber, no teal, no
  violet, no ALTARYS ENTERPRISE as a live product line, three products only.
- No em-dash and no interpunct anywhere in the diff or in the three commit
  messages.
- **Both round 1 blockers are genuinely fixed, verified by execution, not by
  reading the commit message.** `D134` exists and `SITE-FIX-016.md:5` points at
  it. A `docs/DECISIONS.md` with no `| Dnnn |` row and an absent
  `docs/work-items/` now both exit 2 with no verdict. The `gh` degradation
  warning now prints under `--check`.
- Five of the six round 1 IMPORTANT findings are fixed and were re-measured:
  the plural `**Decisions**` is now recognised (fifteen fiches use it, counted);
  `MD-BROKEN` now lands on the right line across a multi-line code span
  (reproduced on a four-line fixture, reported line 3, correct); the D119
  citation is gone from the header; the D114 to D129 gap is annotated in the
  file's own established shape, and the three branch holdings it names are
  exact, checked branch by branch; `SITE-FIX-016` sits at BACKLOG order 1 under
  its blocker. The five suggestions are all treated.
- **The two benches replay exactly as the fiche now describes.** At `1818413`:
  12 gaps, including the six named, at the exact lines named, the unclosed
  backtick at `I18N-FIX-002.md:23`. At `2678c6f`: 7 gaps, five of the six gone,
  the survivor being `I18N-FIX-002.md:43`, precisely as the corrected fiche
  states. The documented `D-UNDEF` recipe was executed verbatim and produced
  exactly the three `D-UNDEF` lines and the two `ITEM-NOFILE` artefacts the
  fiche announces.
- The seven delivery gaps are still all live on the integration branch after
  PR #31 merged into it, and each of the seven citations in `SITE-FIX-016.md`
  was checked line by line against its file. All seven are exact.
- `D-DUP`, `D108-QUOTE` in both directions, `PR-STATE` anchoring, the warning
  tier and the journal tier were each exercised on synthetic trees and each
  behaved as documented.
- The `D131` row is rewritten in place rather than annotated. That is
  legitimate here and should not be re-raised: the row was born on this branch
  at `8ec4ee2` and has never been merged, which is the exception round 3 of the
  `SITE-FIX-002` review already established.

The tool is sound and the round 1 work is real. What follows is what survives.

### Blockers

- [ ] **[BLOCKER]** `bin/docs_check:497` and `:459-461` - **`STATUS` still
  disables itself in complete silence**, which is the third site of the round 1
  blocker, left unguarded while the other two received `refuser`.
  `tablesBacklog` returns `null` when `docs/BACKLOG.md` is absent, and
  `verifierStatus` opens with `if (!backlog) return;` with no message of any
  kind. Reproduced on one tree, twice, changing nothing but the presence of the
  backlog: with `docs/BACKLOG.md` present the tool reports
  `SITE-999.md:3 [STATUS] la fiche se dit close alors que docs/BACKLOG.md la
  range dans les ouverts` and exits 1; with the same file removed it prints
  `AUCUN ECART sur les six controles qui ont tourne` and exits 0 on the same
  contradiction. A second, softer form of the same hole: renaming the backlog's
  `## Done` and `## Open` headings leaves `tablesBacklog` returning two empty
  sets, and the fiche-against-backlog half of `STATUS` reports nothing, again in
  silence and again with exit 0.

  Two aggravating facts. First, both end-of-run messages, `:687` and `:707`,
  then state "six controles sur sept" and "les six controles qui ont tourne"
  when five ran, so the tool does not merely stay quiet, it prints a false
  count of its own coverage. Second, the reachable precondition is not
  hypothetical: the `D-UNDEF` recipe this very item documents at
  `docs/work-items/SITE-FIX-014.md:111-116` builds a tree that copies
  `DECISIONS.md` alone, so `STATUS` does not run there either, and the paragraph
  at `:122-127` that enumerates what the fixture disabled names `PR-STATE` only.
  This is the coverage-claim-wider-than-coverage failure D132 forbids, in the
  tool that forbids it, in the same place round 1 found it -> guard
  `docs/BACKLOG.md` with `refuser` exactly as `docs/DECISIONS.md` and
  `docs/work-items/` are guarded at `:269`, `:276` and `:280`, and derive the
  "six sur sept" wording from the number of checks that actually ran rather than
  hardcoding it.

### Important

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:134` (D129) - the row still reads
  "replayed against `2678c6f` those six are gone where the author fixed them".
  That is the exact claim round 1 blocked at `docs/work-items/SITE-FIX-014.md:94`.
  The fiche was corrected to "five of the six" and now names the survivor; the
  decision row was left byte-identical to its `8ec4ee2` version. Measured here:
  at `2678c6f` five of the six are gone and `I18N-FIX-002.md:43` still fires.
  The branch therefore contradicts itself, and it does so in the durable record
  rather than in the working document. Correcting the row is legitimate for the
  same reason correcting D131 was, the row having been born on this branch and
  never merged -> bring D129 into line with the fiche, five of six and the
  survivor named.

- [ ] **[IMPORTANT]** `bin/docs_check:620` - "Le modele de forme est
  UI-FIX-004." `UI-FIX-004` exists nowhere on this branch nor on
  `refonte-multipages`; searching every remote branch finds it only as
  `docs/work-items/UI-FIX-004.md` on `origin/fix/commentaire-en-ts`, which is
  unmerged. On merge this becomes a pointer to an item that does not exist,
  inside the tool written to catch pointers to items that do not exist, invisible
  to it only because the scan is `.md` only. It is the same defect round 1
  raised for the D119 citation at `:31-32`; the fix was applied to the one
  instance named rather than to the class, and this second one predates it,
  having shipped in `8ec4ee2` -> name a model that exists on the integration
  branch, or describe the expected shape without naming an item.

- [ ] **[IMPORTANT]** `bin/docs_check:489-490` and `:518-519` - `STATUS` has no
  negation awareness. `STATUT_CLOS` and `STATUT_OUVERT` are bare word searches
  over the free text of the `**Status**` line, so "NOT DONE" reads as DONE and
  "not OPEN yet" reads as OPEN. Reproduced in both directions on synthetic
  fiches: a fiche saying `**Status**: NOT DONE, waiting on legal review` while
  the backlog lists it open is reported as "la fiche se dit close alors que
  docs/BACKLOG.md la range dans les ouverts", exit 1. No fiche in the repository
  uses a negated form today, so this is latent rather than live, but it is a
  blocking false positive in the blocking tier, and a tool that cries wolf is
  the adoption failure the header at `:53-54` argues against -> require the
  status word to open the field, or refuse to arbitrate a status line carrying a
  negation, on the model of the deliberate abstention on IMPLEMENTED and IN
  REVIEW at `:515-517`.

- [ ] **[IMPORTANT]** `docs/work-items/SITE-FIX-014.md:5` - the header declares
  "**Decisions** D129, D130, D131 and D132", while `:133` of the same file says
  the follow-up is "opened by D134" and `docs/DECISIONS.md:138` attributes D134
  to `SITE-FIX-014`. The fiche omits its own fifth decision row, so the item
  whose subject is the accounting of the repository's prose does not account for
  itself. The pull request body repeats the same omission, "Decisions : **D129 a
  D132**". Nothing mechanical can catch it, an omission having no form -> add
  D134 to the header, and to the pull request body.

- [ ] **[IMPORTANT]** `docs/work-items/SITE-FIX-014.md:19` - "114 on the
  integration branch, 126 counting branches, as measured on 8 August 2026".
  Measured today, branch by branch: 114 on the integration branch, plus the
  fourteen numbers D115 to D128 held on the three unmerged branches, plus D133
  on the typography branch, which is 129; counting this branch's own five rows
  it is 134. 126 is reachable from no reading. Round 1 raised the figure as a
  suggestion and the fix dated the line instead of correcting it, which turns an
  ageing number into a dated false one. It is aggravated by this same commit:
  the note added at `docs/DECISIONS.md:141-147` enumerates exactly the numbers
  that make the count 129, so the branch now contradicts itself inside one
  commit. D132 names that class, "a count written in one document and
  contradicted by another", as the tool's blind spot; the item ships an instance
  of it -> write 129, or drop the second figure and keep the note as the
  authority.

- [ ] **[IMPORTANT]** `bin/docs_check:692`, `:65`, `:148` and
  `docs/DECISIONS.md:135` (D130) - the whole warning tier rests on
  `SITE-FIX-015`, and the tool prints "hors perimetre de SITE-FIX-014, voir
  SITE-FIX-015" to the user at runtime whenever a `.claude/` or `CLAUDE.md` gap
  is found. `SITE-FIX-015` has no fiche under `docs/work-items/` on any branch,
  no decision row, and no row in `docs/BACKLOG.md`. D130 states the tier exists
  because "repairing those files belongs to the `SITE-FIX-015` this item may not
  touch", which is a definite reference to a document that does not exist. This
  is the half-materialised follow-up shape D113 and D114 each recorded, and that
  round 1 of this item blocked a third time for `SITE-FIX-016`. The fiche's own
  "Out of scope" at `:150` uses the indefinite article, which by D131's own
  grammar rule marks a mention rather than a reference, so the fiche is
  consistent; the runtime string and D130 are not -> either materialise
  `SITE-FIX-015` as a fiche plus a row like `SITE-FIX-016` received, or stop
  pointing the user and the decision log at an identifier that resolves to
  nothing.

### Suggestions

- **[SUGGESTION]** `bin/docs_check:292` - `See` and `Voir` are each given both
  cases in `D_CITATION`, `per` and `under` only lowercase, and the regex carries
  no `i` flag. Verified on a synthetic tree, the lowercase form caught and the
  two capitalised ones silent:

  ```
  Opened under D902.   -> D-UNDEF
  Opened Under D903.   -> nothing
  Opened Per D905.     -> nothing
  ```

  This falls inside the under-detection direction D131 deliberately chose, so it
  is not a defect against the stated design, but the asymmetry with `See` and
  `Voir` looks unintended and is documented nowhere. The example above is fenced
  on purpose: written as prose it makes this very round fail `D-UNDEF`, which is
  the fenced-code exclusion at `bin/docs_check:202-215` working as intended.

- **[SUGGESTION]** `bin/docs_check:258-263` - the comment reads "suit le
  precedent de bin/og_images, qui refuse d'ecrire quand une police n'a pas
  charge [...] : sortie 2, aucun verdict". `bin/og_images:303` exits **1** on
  that font refusal; it reserves exit 2 for the missing-Chrome precondition at
  `:40`, which is in fact the closer analogue of what `docs_check` does. The
  sentence can also be read as stating `docs_check`'s own answer rather than
  `og_images`', so I cannot confirm it asserts something false; a comma or a
  line reference would settle it.

- **[SUGGESTION]** `docs/work-items/SITE-FIX-016.md` - the fiche carries no
  blockquote, and its own gaps 6 and 7 flag other fiches for exactly that.
  Raised and **discarded as a false positive** after checking D108: the rule
  binds a follow-up item born from a review, and `SITE-FIX-016` is born from the
  tool's delivery run, not from a reviewer's sentence. Recorded here so the next
  round does not spend itself re-raising it.

### Correctness (code-review skill)

`code-review:code-review` was invoked on PR #41 by its qualified plugin name and
ran its five parallel passes. Every finding it returned was re-verified here
before promotion, by execution against synthetic trees, and is classified below
at the severity this round assigns rather than the skill's.

- **[IMPORTANT]** D129 contradicting the fiche on the bench 2 count. Confirmed
  by replaying `2678c6f`.
- **[IMPORTANT]** `UI-FIX-004` cited at `:620` and existing only on an unmerged
  branch. Confirmed by searching every remote branch.
- **[IMPORTANT]** `STATUS` blind to negation. Confirmed in both directions.
- **[SUGGESTION]** `per` and `under` case-sensitive. Confirmed.
- **[SUGGESTION]** the `bin/og_images` exit-code citation. Confirmed as to the
  fact, not as to the reading.

Discarded as false positives after checking against the code:

- CLAUDE.md non-compliance. None found: the script's comments and all three
  commit messages are French, the documents are English, the branch targets
  `refonte-multipages`, and no em-dash or interpunct appears anywhere.
- `SITE-FIX-016` violating D108 for lack of a verbatim quote. D108 binds items
  born from a review; this one is born from the tool's own output.
- the in-place rewrite of D131 breaking the never-rewrite-a-D-row rule. The row
  was born on this branch and never merged, which the `SITE-FIX-002` round 3
  precedent covers.

The skill's own eligibility pass additionally reported the pull request
ineligible, having mistaken round 1's own comment for a prior run of itself.
That was overridden after checking: the pull request is open, not a draft, and
the skill had posted nothing on `7087064`.

### Summary

Round 1 was answered well: both blockers are genuinely closed, the benches
replay exactly as the corrected fiche now claims, and the tool is a sound third
application of the D048 gesture. It is blocked again on one thing of substance
and five smaller ones, all of the same family: `STATUS` is the third check that
could turn itself off in silence and it was the one left unguarded, so the run
can still print a clean verdict and a false coverage count over a contradiction
it did not look for; and the branch still carries four accounting statements
that contradict measurement or contradict each other, in the item whose whole
subject is that no accounting statement should.
