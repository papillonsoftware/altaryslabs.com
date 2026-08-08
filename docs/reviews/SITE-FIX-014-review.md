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
