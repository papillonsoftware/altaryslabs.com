# Review - I18N-FIX-003

Item: `docs/work-items/I18N-FIX-003.md` | Branch: `fix/typographie-des-libelles-anglais` | PR #40 | Base: `refonte-multipages`

## Round 1 - 2026-08-08
**Verdict**: CHANGES REQUESTED

### What was verified in this round

- `npm ci`, `npm run build` and `npm run check` run independently in a dedicated review worktree forked from `origin/fix/typographie-des-libelles-anglais`. Build green, 26 pages. `astro check`: 0 errors, 0 warnings, 0 hints on 64 files.
- `npm run preview` served on **port 4322**, not 4321. The default was already held by another worktree; the listener on 4322 was confirmed with `lsof -p <pid> -d cwd` to have this review worktree as its working directory before any capture was taken.
- 24 captures via `bin/review_shots http://localhost:4322`, at 360, 768 and 1440 px, on `/`, `/en`, `/a-propos`, `/en/about`, `/mentions-legales`, `/en/legal-notice`, `/contact`, `/en/contact`. Compared with `Header.dc.html` and `Footer.dc.html` at the **ROOT** of the design project `53d1c228-d274-4df3-8022-1a427dd96c15`.
- Generic-correctness sweep delegated to the `code-review:code-review` plugin skill on PR #40. One finding survived confirmation and is carried below under its own subsection; it also posted its own comment on the PR.
- The three accessible names the item targets were read on the **built** HTML, in both languages, on all 13 English pages.

### Blockers

- [ ] **[BLOCKER]** `src/components/LegalPage.astro:39` - **A third occurrence of the exact defect this item exists to remove, and the only one a visitor can actually read.** The line is `<p class="legal-updated mono">{t.legal.lastUpdated} : {t.legal.updatedOn}</p>`: a hardcoded ` : ` joining two dictionary strings inside a component shared by both languages, which is the same pattern as `Header.astro:60` and `LangSwitcher.astro:25`. `dist/en/legal-notice/index.html` and `dist/en/privacy/index.html` both serve `Last updated : 30 July 2026`, confirmed in the browser at 1440 px on `/en/legal-notice`. Unlike the three `aria-label`s corrected here, this one is **visible body text on a legal page**, so it is the more damaging of the two: a director evaluating a contractor reads it, and French spacing in an English legal notice reads as a page that was machine-copied rather than adapted. `LABEL_SEPARATOR` was created for precisely this and is not applied to it. -> `import { LABEL_SEPARATOR }` in `LegalPage.astro` and write `{t.legal.lastUpdated}{LABEL_SEPARATOR[locale]}{t.legal.updatedOn}`. `LABEL_SEPARATOR.fr` is `' : '`, so the French rendering stays byte-identical, which keeps acceptance criterion 3 intact.

- [ ] **[BLOCKER]** `docs/work-items/I18N-FIX-003.md:59` and `src/i18n/config.ts:40` - **Both assert that the pattern has exactly two occurrences, and both are false**, per the blocker above. The fiche says "**Exactly two occurrences**, both already named by the review", under a four-pass search table whose pass D is described as "any literal ` : ` string" and whose whole point is stated as being "cited so a later round does not have to repeat it". The docblock says "les deux seules occurrences du motif". `LegalPage.astro:39` is a literal ` : ` string in `src/`, so pass D did not do what it claims. This is worse than an ordinary stale comment: the fiche explicitly instructs the next round not to redo the sweep, so it converts a miss into a standing instruction to keep missing it, and `docs/vitrine/` traceability is the repository's own credibility mechanism. -> Fix `LegalPage.astro`, then correct both sentences to the real count, and either re-run pass D and say what it actually covered or drop the "so a later round does not have to repeat it" claim.

### Important

- [ ] **[IMPORTANT]** `src/i18n/config.ts:26` - The docblock offers `"Change language: English"` as an example of a composed label. That string cannot be produced. `LangSwitcher.astro:33` builds the name as `${t.common.switchLanguage}${LABEL_SEPARATOR[locale]}${LOCALE_LABEL[target]}` with `target = otherLocale(locale)`, so the sentence is always in the page language and the language name always in the other one: an English page renders `Change language: Français`, a French page `Changer de langue : English`. The comment added by the same commit at `LangSwitcher.astro:23` states the correct example, so the two comments now contradict each other on the single point the docblock exists to teach. Confirmed on the built HTML of `dist/en/index.html` and `dist/index.html`. -> Replace the second example with `"Change language: Français"`, or use the French-page pair `"Changer de langue : English"`.

- [ ] **[IMPORTANT]** `src/components/LangSwitcher.astro:32` - **The element declares the accessible name to be in the wrong language, and this PR's own comment now says the opposite.** The anchor carries `lang={HTML_LANG[target]}`, and the `lang` attribute governs the element's contents **and the text of its attributes**, `aria-label` included. On an English page the built markup is `<a ... lang="fr" aria-label="Change language: Français">`, so the English sentence "Change language" is declared French and is announced with French phonemes; the French page is symmetrically wrong. The comment this PR adds at lines 18 to 25 states "Le libelle est une phrase de la page, donc dans la langue de la page", which is exactly what `lang="fr"` denies. The visible content is only `<span aria-hidden="true">FR</span>`, so the attribute buys nothing on the rendered text; its only purpose is to pronounce the language name, at the cost of the rest of the label. Markup and specification verified; the announcement follows from them. -> Drop `lang` from the anchor, keep `hreflang`, and carry the name in visually hidden inline markup so only the language name is tagged: a hidden span with `{t.common.switchLanguage}{LABEL_SEPARATOR[locale]}` plus a second hidden span with `lang={HTML_LANG[target]}` around `{LOCALE_LABEL[target]}`, the `FR`/`EN` span staying `aria-hidden`. That is also the only shape in which the cedilla restored here does any work.

- [ ] **[IMPORTANT]** `src/i18n/config.ts:18` - The `LOCALE_LABEL` docblock reads "Libelles du selecteur de langue, toujours affiches dans la langue cible." They are never displayed. The only consumer is the `aria-label` at `LangSwitcher.astro:33`; the visible content of the switcher is `target.toUpperCase()`, so `Français` and `English` reach a screen reader and nothing else. The imprecision is pre-existing, but it sits two lines above the value this PR changes and it is the reason the cedilla correction has no visible effect anywhere, which a reader of this docblock would not expect. -> "Nom de la langue cible, expose dans le libelle accessible du selecteur et jamais affiche."

### Correctness (code-review skill)

The `code-review:code-review` plugin ran on PR #40: eligibility check, CLAUDE.md audit, shallow bug scan, git-history pass, prior-PR-comment pass, code-comment pass, then per-issue confidence scoring. One finding scored above the 80 threshold and is confirmed here; it is listed above in full rather than duplicated:

- **[IMPORTANT]** `src/i18n/config.ts:26` - the unreachable `"Change language: English"` example. Scored 100 and re-verified against `otherLocale`, both dictionaries and the built HTML.

Discarded after confirmation: the CLAUDE.md pass, the shallow bug scan, the git-history pass and the prior-PR pass all returned clean, and the code-comment pass asserted the "deux seules occurrences" claim was accurate. **That last assertion is a false negative** and is corrected by the second blocker above: the agent's grep looked for compound *accessible names* and skipped `LegalPage.astro:39`, which is the same pattern in visible text.

### Suggestions

- **[SUGGESTION]** `src/pages/contact.astro` and `src/pages/en/contact.astro`, inline `<script is:inline>` - the built contact pages ship 9498 bytes of inline script of which **4583 bytes are French `//` comments**, about 16 percent of a 29 KB HTML document, on the site's only conversion page and to every visitor including those on 3G. Pre-existing, from `FORM-001`, untouched here. The prose is genuinely valuable, but it belongs where it does not travel. -> Move the reasoning into the `.astro` frontmatter or a sibling doc and leave short pointers in the shipped script.

- **[SUGGESTION]** `docs/work-items/I18N-FIX-003.md` - the fiche states that no visual pass was required because no CSS file changed. That inference is sound for this diff, but the reviewer checklist requires the pass anyway on any surface that renders, as a non-regression check; it was run here and found nothing. Worth phrasing as "no visual delta expected" rather than "no visual pass needed", so the next item does not read it as a licence to skip.

### What is correct and worth recording

- The fix itself is the right shape. One table indexed by the page language, read by both components, no locale branch duplicated in a component. Built output confirms `Products: Open menu`, `Services: Open menu` and `Change language: Français` on all 13 English pages, and `Produits : Ouvrir le menu`, `Services : Ouvrir le menu`, `Changer de langue : English` unchanged on the French side.
- The `locale` versus `target` trap is correctly resolved in code, and the comment at `LangSwitcher.astro:18-25` is the right place to record it.
- Brand rules hold: no CSS changed, captures at three widths in both languages show navy and gold only, no amber, no teal, no violet, three products, no ALTARYS ENTERPRISE. Header and footer match the ROOT `Header.dc.html` and `Footer.dc.html`.
- Editorial guardrails hold: no price, no client name, no exact date, `Disponible T3 2026` and `Available Q3 2026` still come from the single `availability.pcs` dictionary constant.
- Parity holds: no dictionary key added or removed, `Dictionary` still derived from `fr.ts`, `routes.ts` untouched, no cross-language URL hardcoded, hreflang and the switcher target unchanged.
- Deployment untouched: no adapter, no `wrangler.jsonc` change, D1 binding still commented out, no secret, PR targets `refonte-multipages`.
- The D-number reservation note is accurate, and was checked rather than trusted: `fix/conventions-variables-et-perimetre-de-revue` does carry D115 to D118 and `fix/commentaire-en-ts` does carry D119 to D123. D124 to D126 collide with nothing.
- The scope note refusing to redirect the three `SITE-FIX-011` references is correct: PR #38 is open on that branch and the pointers resolve.
- Typography rule respected: no em-dash and no interpunct anywhere in the diff.

### Summary

The fix delivered is correct, well argued and verified on built output rather than on source, and D124 to D126 are exemplary. It is blocked on one thing: the sweep that the fiche presents as exhaustive missed `LegalPage.astro:39`, where the same hardcoded ` : ` renders `Last updated : 30 July 2026` as **visible text** on `/en/legal-notice` and `/en/privacy`, and both the fiche and the new docblock now assert in writing that only two occurrences exist. Three further findings are important: an unreachable example in the docblock, an `aria-label` whose element declares it to be in the wrong language, and a `LOCALE_LABEL` docblock that says its values are displayed when they never are.

## Round 2 - 2026-08-08
**Verdict**: CHANGES REQUESTED

### What was verified in this round

- `npm ci`, `npm run build` and `npm run check` run independently in a review worktree forked from `origin/fix/typographie-des-libelles-anglais` at `9b61736`. Build green, 26 pages. `astro check`: 0 errors, 0 warnings, 0 hints on 64 files.
- `npm run preview` served on **port 4322**, not 4321. Ownership confirmed before any capture: `lsof -nP -iTCP:4322 -sTCP:LISTEN` gives pid 99054, and `lsof -a -p 99054 -d cwd` returns `.claude/worktrees/review-I18N-FIX-003`.
- 24 captures via `bin/review_shots http://localhost:4322` at 360, 768 and 1440 px over `/`, `/en`, `/produits`, `/en/products`, `/services`, `/en/services`, `/mentions-legales`, `/en/legal-notice`. Header and footer compared with `Header.dc.html` and `Footer.dc.html` at the **ROOT** of design project `53d1c228-d274-4df3-8022-1a427dd96c15`.
- Generic-correctness sweep delegated to the `code-review:code-review` plugin skill on PR #40. See its own subsection below.
- **A sweep of computed accessible names over all 26 pages**, driven through the Chrome DevTools protocol (`Accessibility.getFullAXTree`) against the served site, rather than over the text of the built HTML. This is the check the fiche claims to have run, and it is what produced the first blocker below.
- **A build of `origin/refonte-multipages` served in parallel on port 4399** and measured the same way, so every before/after claim in this round is a measured difference and not an inference.

### Blockers

- [ ] **[BLOCKER]** `src/components/ProductCard.astro:53` and `src/components/ServiceCard.astro:38` - **The twelve English card links still announce French colon spacing, exactly as they did before this PR. The change to these two components alters nothing at all, in either language.** Measured on the served pages through Chrome's own accessible-name computation, branch build on 4322 against a `refonte-multipages` build on 4399:

  | Surface | Base `refonte-multipages` | This branch | Delta |
  |---|---|---|---|
  | `/en` card links | `Learn more : Papillon HR Suite` | `Learn more : Papillon HR Suite` | **none, still wrong** |
  | `/en/products` | `Learn more : Papillon Collection Solution` | idem | **none, still wrong** |
  | `/en/services` | `Learn more : Sovereign AI` | idem | **none, still wrong** |
  | `/` card links | `En savoir plus : Papillon HR Suite` | idem | none, was already correct |
  | `/en` header disclosures | `Products : Open menu` | `Products: Open menu` | fixed |
  | `/en` language switcher | `Change language : Francais` | `Change language: Français` | fixed |

  Twelve links across `/en`, `/en/products` and `/en/services`. **The cause is that an accessible name is not the HTML text.** When a name is computed from descendants, Chrome inserts a space at the inline element boundary whenever the accumulated text does not already end in whitespace. Astro strips the source whitespace, so `dist/en/index.html` really does read `>Learn more<span class="visually-hidden">: Papillon...`, which is why an inspection of the built markup passes it; the browser then re-adds a space and announces `Learn more : Papillon...`. A separator placed at the **start of a sibling span can therefore never produce** `Learn more: X`. On the French side the inserted space merges with the intended `' : '` and the result is right by accident, which is also why occurrences 4 and 5 were misdiagnosed: `En savoir plus: Papillon HR Suite` was never announced by anything.

  The two shapes this PR gets right show the rule by contrast. `Header.astro` composes a flat `aria-label`, so no boundary exists. `LangSwitcher.astro` puts the separator at the **end** of the first span, so the accumulated text already ends in a space and none is added; the footer's `E-mail :` / `Email:` label works for the same reason, and announces correctly in both languages.

  -> Give the card anchors a flat accessible name. Both halves are in the same language here, so D128's reason for refusing `aria-label` in `LangSwitcher`, that a flat string cannot carry a `lang` on one word, does not apply to these two components. Compose the whole name into a single `aria-label` on the `<a>`, joining `linkLabel`, `LABEL_SEPARATOR[locale]` and `name` in one template literal, and drop the visually hidden span. That produces `Learn more: Papillon HR Suite` and `En savoir plus : Papillon HR Suite`, and also removes the decorative arrow noted below. Whatever shape is chosen, re-verify it on computed accessible names, not on `dist/` text.

- [ ] **[BLOCKER]** `docs/work-items/I18N-FIX-003.md`, `src/i18n/config.ts:52-58` and `docs/DECISIONS.md` D124 - **The verification method is asserted to be authoritative in three places, and it is not.** The fiche says the sweep "collects every accessible name" and "reports zero defects in both languages"; acceptance criterion 1 says no rendered string carries the other language's convention, "verified on the built HTML of all 26 pages"; the docblock says in bold that "le balayage qui fait foi se fait sur le HTML produit"; D124 says the same and adds that the five occurrences "share only what they render, which is why the built output is the authority". **The built output is the authority for visible text. It is not the authority for an accessible name**, which is a computed value and differs from the markup exactly in the case that matters here. The measurement above is the counter-example.

  This is round 1's second blocker one level deeper, and it carries the same aggravating factor: the fiche again presents the sweep as something a later round need not repeat, so the miss is written down as a standing instruction to keep missing it. Concretely wrong today: the occurrence table's rows 4 and 5 describe a French defect that never existed; the twelve real English occurrences appear nowhere; "Cinq occurrences, not two" is again the wrong count.

  -> Fix the two components, then correct the three documents to the measured result, and state the sweep in terms of computed accessible names, naming the tool that computes them. D124 is dated and must be annotated rather than rewritten, per the log's own rule and the precedent this item set for D113.

### Important

- [ ] **[IMPORTANT]** `src/styles/global.css:365-369` - `.link-arrow::after { content: ' \2192'; }` injects a purely decorative arrow into the accessible name of every card link, in both languages, on all six pages that carry cards: the measured names end `... Papillon HR Suite →` and `... Sovereign AI →`. Generated content is part of the name computation, so a screen reader announces the arrow as a character. Pre-existing and untouched by this PR, but it sits inside the exact string this item exists to get right, it was surfaced by this item's own subject matter, and it costs nothing to remove. -> `content: ' \2192' / '';`, the CSS alternative-text form, or let it disappear with the `aria-label` fix in the first blocker. If the author takes a shape that leaves it in place, it needs its own tracked follow-up rather than silence.

- [ ] **[IMPORTANT]** `src/components/ProductCard.astro:11-17`, `src/components/ServiceCard.astro:11-17`, and the twelve `locale={locale}` call sites in `HomeContent.astro`, `ProductsHub.astro` and `ServicesHub.astro` - the new required `locale` prop and its twelve call-site edits currently change no rendered output and no announced name, per the measurement above, while the JSDoc on both props asserts a defect ("Le deux-points y etait ecrit en dur, donc colle dans les deux langues, ce que le francais ne fait pas") that the French side never exhibited. The prop becomes load-bearing as soon as the first blocker is fixed, so this is not a request to revert it; it is a request that the two JSDoc blocks stop describing a defect that was not there. -> Correct both prop docblocks once the real defect is fixed.

### Correctness (code-review skill)

The `code-review:code-review` plugin ran on PR #40: eligibility check, CLAUDE.md audit, shallow bug scan, git-history pass, prior-PR-comment pass, code-comment pass. **All five review agents returned clean and no finding reached the confidence threshold, so the skill posted no comment this round**, per step 6 of its own procedure. Its round 1 finding, the unreachable `"Change language: English"` docblock example, is confirmed fixed.

Two of its results are worth recording because they were checked and are sound:

- the git-history pass established that `lang` on the switcher anchor traces to the single Astro migration commit `12025d91` with no reasoning attached, so D128 undoes no deliberate decision;
- the prior-review pass confirmed every round 1 finding is delivered and that `SITE-FIX-012` point 6 is correctly struck through rather than deleted.

**One result is a false negative and is corrected by the first blocker above.** The shallow-bug agent and the code-comment agent both built the project and inspected `dist/`, and both concluded the card links were correct in both directions, quoting `Learn more: Papillon Collection Solution` from the markup. That string is in the markup and is not what is announced. They read the built HTML, which is precisely the blind spot the item's own sweep has, so the skill reproduced the defect's own reasoning rather than catching it. Worth knowing for future rounds: for any finding about an accessible name, the built HTML is not evidence.

### What is correct and worth recording

- Round 1's blocker on `LegalPage.astro` is properly fixed. `Last updated: 30 July 2026` read in the browser at 1440 px on `/en/legal-notice` and `/en/privacy`; `Dernière mise à jour : 30 juillet 2026` unchanged on the two French pages.
- Round 1's four other findings are all delivered. The header disclosures announce `Products: Open menu` and `Services: Open menu` on all 13 English pages, measured; the two `config.ts` docblocks are now accurate; D128's shape is right and verified, `Change language: Français` on English pages and `Changer de langue : English` on French ones, with `lang` scoped to the language name alone and `hreflang` left on the anchor.
- No layout movement from D128. `.visually-hidden` is `position: absolute`, and the 24 captures at 360, 768 and 1440 px in both languages show the switcher unchanged in place and size.
- Brand rules hold: no CSS file changed, captures show navy and gold only, no amber, no teal, no violet in `dist/`, three products, no ALTARYS ENTERPRISE on any page. The only occurrence in the tree is a historical comment in `tokens.css` explaining the removal.
- Editorial guardrails hold: no price, no client name, no exact date, `Disponible T3 2026` and `Available Q3 2026` still from the single dictionary constant, About unchanged.
- Parity holds: no dictionary key added or removed, `Dictionary` still derived from `fr.ts`, `routes.ts` untouched, no cross-language URL hardcoded, hreflang reciprocal and `x-default` present, `<html lang>` correct on both sides.
- SEO untouched and intact: both OG images exist in `public/`, `og:image` resolves per language, canonical and JSON-LD still central in `BaseLayout.astro`, no new route.
- Deployment untouched: static output, `pages_build_output_dir` still `./dist` and still followed by its comma, the D1 binding carries the real `database_id`, no secret, PR targets `refonte-multipages`.
- The D-number reservation note is accurate and was checked rather than trusted: `fix/conventions-variables-et-perimetre-de-revue` carries D115 to D118, and `fix/commentaire-en-ts` carries D119 to D123 **and D127**, in its commits and in its working tree. D124, D125, D126 and D128 collide with nothing.
- `SITE-FIX-012` is amended correctly: point 6 struck through and marked delivered, point 7 retained, the acceptance criteria line reduced accordingly, nothing renumbered.
- Typography rule respected: no em-dash and no interpunct anywhere in the diff.

### Summary

Four of round 1's five findings are properly fixed and verified, and D128 is the right shape for the language switcher. The item is blocked because its central claim is not true: the twelve card links on `/en`, `/en/products` and `/en/services` still announce `Learn more : Papillon HR Suite`, byte-identical to the base branch, because an accessible name is computed and not read off the markup, and Chrome inserts the space the English side must not have. The same misreading makes the fiche, the `config.ts` docblock and D124 describe a French defect that never existed while omitting the English one that does.
