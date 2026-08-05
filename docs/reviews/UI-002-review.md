# UI-002 - Review

## Round 1 - 2026-08-05
**Verdict**: CHANGES REQUESTED

Reviewed on a dedicated worktree forked from `feat/surfaces-legeres-v2` at `81cd2fd`,
against `origin/refonte-multipages`. `npm ci`, `npm run build` and `npm run check`
were run independently in that worktree: build green, 26 pages, `astro check` clean
(0 errors, 0 warnings, 0 hints). Pages served with `npm run preview` and captured with
`bin/review_shots` at 360, 768 and 1440 px, in both languages, plus two interaction
states (mobile accordion open, desktop dropdown open). Prototypes read at the ROOT of
the claude.ai/design project `53d1c228-d274-4df3-8022-1a427dd96c15`, never the frozen
`design_handoff_altaryslabs_refonte/` folder.

The switch itself is well executed: every section declares its surface explicitly, the
cream/navy alternation matches the prototypes page by page, the peritext covers the
component classes that render on light, and the two bugs the author found while
verifying (`.module p` matching nothing, `.card--prominent` uncovered) are real bugs
correctly fixed. The blocker below is a single line that was not updated when the
footer gained a column.

### Blockers

- [ ] **[BLOCKER]** `src/components/Footer.astro:65` - The footer now renders five grid
  children (`.footer-brand` plus four `.footer-column` nav blocks, since `columnLegal`
  was added at line 21) into a four-track grid: `grid-template-columns: 1.4fr repeat(3, 1fr)`
  was never widened. Above the 900px breakpoint the new "Legal" column does not sit
  beside the others; it wraps to an implicit second row under the brand column. Verified
  visually at 1440px on `/`, `/produits/pcs`, `/services`, `/a-propos`,
  `/mentions-legales`, `/contact` and on the English side (`/en/about`), so the defect
  is on every page of the site in both languages, on the desktop view an executive sees
  first. It also contradicts `Footer.dc.html`, which sizes the row
  `1.3fr .9fr .9fr .7fr .9fr`, acceptance criterion 1 of `docs/work-items/UI-002.md`,
  and D055's own wording ("The footer becomes five columns"). 360px and 768px are
  unaffected, which is why the capture set alone did not surface it.
  -> Widen to five tracks, ideally the prototype's own ratios
  `grid-template-columns: 1.3fr .9fr .9fr .7fr .9fr`, and re-check the two responsive
  overrides at lines 149 and 161.

### Important

- [ ] **[IMPORTANT]** `src/components/Header.astro:139-141` - The scoped rule
  `.nav :focus-visible { outline-color: var(--gold-deep) }` cannot reach the language
  switcher. Astro compiles it to
  `.nav[data-astro-cid-nen7h5rs] [data-astro-cid-nen7h5rs]:focus-visible` (confirmed in
  `dist/_astro/*.css`), and `LangSwitcher.astro` emits its anchor with
  `data-astro-cid-3s4v7zxg` (confirmed in `dist/index.html`). `LangSwitcher.astro`
  declares no `:focus-visible` of its own, so on keyboard focus the switcher falls back
  to the global `outline: 2px solid var(--gold)`, which is 2.47:1 on the cream header:
  exactly the failure the comment above the rule says it is fixing, on the only control
  in the chrome that is neither a link nor the CTA. Fails SC 1.4.11 and SC 2.4.11.
  -> Move the correction to `global.css` beside the existing
  `.section--light.section--light :focus-visible` rule, scoped to the header, or add
  `.lang-switcher:focus-visible { outline-color: var(--gold-deep) }` inside
  `LangSwitcher.astro`.

- [ ] **[IMPORTANT]** `src/styles/global.css:59-75` - `.skip-link` keeps
  `background: var(--gold)` with no border. It appears at the top left, over the header
  and the cream body, so its boundary against the surrounding surface is 2.47:1, under
  the 3:1 of SC 1.4.11. It is the same defect this PR correctly fixed for `.nav-cta`
  (Header.astro:297) and that D039 fixed for `.btn-primary`, and it became a defect only
  because this PR turned the surface behind it cream. Its focus ring is also the plain
  `--gold` outline, since the skip link sits outside `.nav` and outside any
  `.section--light`. It is the very first thing a keyboard user reaches.
  -> `border: 1px solid var(--gold-deep)` on `.skip-link`, plus a `--gold-deep` outline
  colour on `.skip-link:focus-visible`.

- [ ] **[IMPORTANT]** `bin/contrast_sweep:101` - The success line still prints
  `AUCUN ECHEC AA, fondation reveillee`. This PR removed the injection, and the file
  header was correctly rewritten to "fondation claire EN PLACE", but the message the
  operator actually reads still asserts the opposite. Acceptance criterion 2 turns on
  precisely that distinction ("with the foundation live rather than injected"), so the
  one line that reports the criterion is the one line that contradicts it.
  -> `AUCUN ECHEC AA, fondation en place`.

- [ ] **[IMPORTANT]** `bin/contrast_sweep:56-60` and `:76` - The new gradient guard turns
  a false positive into a silent false negative. `bgOf` returns `null` as soon as any
  ancestor carries a `background-image`, and the caller then does `if (!bg) continue`,
  dropping the element from the sweep with no trace in the report. Verified by
  instrumenting a copy of the script against the running preview: `.cta-title` is skipped
  on `/` and on `/a-propos`, and by extension on every page carrying a `CtaBanner`,
  after which the tool prints `AUCUN ECHEC AA`. The rule it can no longer verify,
  `.section--cta { color: var(--ivory) }`, is one this PR introduces. The guard itself is
  the right call; dropping the element without saying so is not.
  -> Collect skipped elements and print them as a `NON MESURE (n)` line so a zero-failure
  run states its own coverage, or compose the gradient's stops when they are all opaque.

- [ ] **[IMPORTANT]** `src/styles/global.css:438-439` - The comment "Aucune page n'utilise
  encore cette classe. La bascule du fond par defaut et la conversion des pages
  appartiennent a UI-002" is now false. This PR is UI-002: it flips the body default at
  lines 31-32 and applies `.section--light` across ten components. A comment that tells
  the next maintainer the foundation is dormant, sitting directly above the peritext that
  now drives every light page, misleads exactly where it is most read.
  -> Rewrite the paragraph to the present state, keeping the specificity rationale below
  it untouched.

- [ ] **[IMPORTANT]** `src/styles/global.css:127-131` and `:26-31` - `.section--alt` has
  no consumer left after `RoadmapWaves.astro` moved to `.section--deep` and
  `HomeContent.astro` moved to `.section--light` (verified: zero occurrences in `src/`
  outside `global.css`, zero in `dist/`). This PR added `color: var(--ivory)` to that dead
  rule, and the explanatory comment at line 30 still lists `.section--alt` among the dark
  sections that "portent desormais leur propre couleur de texte explicite", which no
  section does.
  -> Either delete the rule and drop it from the comment, or keep it deliberately as a
  surface primitive and say so, the way `.section--navy` is kept and still used by
  `PageScaffold`.

- [ ] **[IMPORTANT]** `src/components/Footer.astro:129-146` - `.footer-legal-links`,
  `.footer-legal-links ul`, `.footer-legal-links a` and `.footer-legal-links a:hover` are
  dead: the `<nav class="footer-legal-links">` block they styled was deleted from the
  template in this same diff. The D029 comment at line 135 now documents a contrast fix
  for a selector that can never match.
  -> Delete the four rules and the comment with them.

- [ ] **[IMPORTANT]** `src/components/LangSwitcher.astro` and
  `src/components/Header.astro:311-317` - Touch targets under the project bar. Measured in
  a real 360px viewport with the mobile menu open: `.lang-switcher` renders 40x32 and
  `.nav-toggle` renders 38x42. The REVIEWER checklist requires at least 44px, and the
  disclosure buttons next to them were sized to exactly 44x44 at Header.astro:385-386, so
  the intent is established in the same file. Latent rather than introduced, but this PR
  recoloured both controls without resizing them.
  -> Pad `.lang-switcher` to 44px minimum on the mobile breakpoint and widen `.nav-toggle`
  to 44px.

### Suggestions

- **[SUGGESTION]** `src/components/Header.astro:416` - The mobile `.nav-tail` separator
  keeps `border-top: 1px solid var(--gold-08)`, a dark-surface value, while every other
  divider in the light chrome moved to `--navy-08`. It renders as a barely visible warm
  line on the cream panel. -> `var(--navy-08)`, for consistency with lines 359 and 226.

- **[SUGGESTION]** `src/components/LangSwitcher.astro` - `Header.dc.html` draws the
  language control as an FR|EN pill with a gold active segment, and
  `docs/work-items/UI-002.md` repeats it ("The language pill keeps its gold active
  state"). The repository ships a single-target "EN" box instead, which is coherent with
  real translated routes and predates this item. Worth a founder call rather than a
  reviewer one, since it is a positioning choice, not a defect.

- **[SUGGESTION]** `docs/DECISIONS.md` D055 - The row records the bottom-bar
  recomposition but not that `footer.rights` and the `(c) {year} ALTARYS LABS` line
  disappear entirely. The removal matches `Footer.dc.html`, which has no copyright line,
  so the change is right; the decision row is simply silent on it.

### Correctness (code-review skill)

The `code-review` plugin is installed, but at **project scope for
`/Users/eblonvia/dev/workspace/altarys/labs/site-web-altaryslabs`** only
(`~/.claude/plugins/installed_plugins.json`). This session runs from the worktree
`.claude/worktrees/surfaces-legeres-v2`, a different project path, so `/code-review 24`
is not registered in its skill list and could not be invoked as a slash command. Rather
than skip the mandated sweep, its own procedure
(`~/.claude/plugins/cache/claude-plugins-official/code-review/unknown/commands/code-review.md`,
step 4) was executed manually with parallel review agents over the same diff: CLAUDE.md
adherence, shallow bug scan, and code-comment guidance. Findings were confirmed against
the code before promotion; the confirmed ones are folded into the sections above rather
than duplicated here.

- CLAUDE.md adherence pass: **no violation**. No hardcoded hex outside `tokens.css`, no
  amber, no teal, no violet, no ALTARYS ENTERPRISE, no price, no client name, no date
  finer than a quarter, three products only, About names one person. Every new gold on a
  light surface uses `--gold-deeper` for text and `--gold-deep` for borders, per D029 and
  D030. All new comments are in French. No em-dash and no interpunct in the diff.
- Dictionary parity pass: **clean**. `columnLegal` added to both `fr.ts` and `en.ts`,
  `rights` removed from both, `Dictionary` still derived from `fr.ts`, `astro check`
  green.
- Bug scan and comment-guidance passes: produced the footer grid blocker, the dead
  `.footer-legal-links` block, the `LangSwitcher` focus-ring gap, the `contrast_sweep`
  silent skip, the stale `global.css` foundation comment and the dead `.section--alt`
  rule. All are reported above.

A `security-review` pass was also started and is not reported: this PR changes only
static CSS, Astro markup and dictionary strings, with no user input, no network call, no
secret and no new dependency, so it has no security surface.

### Verified clean

- **Build**: `npm ci`, `npm run build` (26 pages) and `npm run check` (0/0/0) all run
  independently in the review worktree. No `any`, no `@ts-ignore`, no loosened
  `Dictionary`.
- **Bilingual parity**: keys symmetric, no cross-language URL hardcoded, everything
  resolves through `ROUTES`, hreflang reciprocal, switcher lands on the counterpart page,
  no French string on an English page and no English string on a French page (checked on
  `/en`, `/en/about`, `/en/products/pcs`, `/en/products/papillon-hr-suite`,
  `/en/contact`).
- **Editorial guardrails**: no price, no client or partner name, no exact date, PCS still
  a teaser reading its availability from the single `t.availability.pcs` constant, HR
  Suite still twelve business-facing module labels with no internal code, About still one
  person.
- **Brand**: navy and gold only, tokens throughout, correct type families, Services and
  Products hierarchy unchanged, no stock photography, logomark reused with only a surface
  variant added for the wordmark colour.
- **Visual fidelity**: `/`, `/produits`, `/produits/pcs`, `/produits/papillon-hr-suite`,
  `/services`, `/a-propos`, `/mentions-legales`, `/politique-confidentialite`,
  `/contact`, `/en`, `/en/about`, `/en/products/pcs`,
  `/en/products/papillon-hr-suite`, `/en/contact` captured at 360, 768 and 1440 px and
  compared with their root prototypes. PCS closes on the hero with no CTA band, HR Suite
  alternates light, navy, light, the desktop dropdown holds the renamed consulting entry
  without overflow at 1440 and the mobile accordion holds it at 360 (acceptance criterion
  5 met), the Contact page still renders coherently dark on `PageScaffold` as declared
  out of scope. Nothing inline-styled was copied from a `.dc.html`, nothing from
  `support.js`.
- **Contrast**: `bin/contrast_sweep` over the fourteen routes returns zero failures with
  the foundation live, subject to the coverage hole reported above.
- **SEO**: canonical, hreflang, Open Graph with `fr_CI` and `en`, Twitter Card and JSON-LD
  all still centralised in `BaseLayout.astro`, no page hand-rolls its own. Both
  `public/og-image.png` and `public/og-image-en.png` exist. Sitemap holds 26 entries,
  `robots.txt` coherent, and the new footer Legal column removes the last orphan risk.
- **Performance**: no client-side JavaScript added, no dependency added, no image added,
  no render-blocking resource added.
- **Deployment**: static output preserved, build output still `./dist`, no adapter, D1
  binding still commented out with its comma warning intact, no secret committed, PR #24
  targets `refonte-multipages`.

### Tracking note

The `.skip-link` contrast, the two undersized touch targets and the
`bin/contrast_sweep` coverage hole are latent rather than introduced by this item, and
the maximal bar blocks on them all the same. They should be materialised as a follow-up
work item plus a D-row. This round could not create that item: the autonomous reviewer
allowlist grants writes to `docs/reviews/**` only, by design. The founder opens it.

### Summary

The surface switch itself is correct, consistent with the root prototypes and clean on
build, parity, brand and editorial guardrails. One line blocks it: the footer grid was
never widened when the Legal column was added, so the new column wraps onto a second row
on every page at desktop width, in both languages. Seven further defects are confirmed,
three of them latent, the rest introduced or revealed by this change.
