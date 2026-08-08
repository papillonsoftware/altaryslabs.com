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

---

## Round 2 - 2026-08-05
**Verdict**: CHANGES REQUESTED

Reviewed on a dedicated worktree forked from `origin/feat/surfaces-legeres-v2` at `8ca33fc`,
against `origin/refonte-multipages`. `npm ci`, `npm run build` and `npm run check` were run
independently in that worktree: build green, 26 pages, `astro check` clean (0 errors,
0 warnings, 0 hints). Pages served with `npm run preview` on port 4331 and captured with
`bin/review_shots` at 360, 768 and 1440 px in both languages, plus three interaction states
driven over the DevTools protocol (mobile accordion open with a dropdown expanded, desktop
dropdown open on `/services` and on `/en/services`). Prototypes read at the ROOT of the
claude.ai/design project `53d1c228-d274-4df3-8022-1a427dd96c15`, never the frozen
`design_handoff_altaryslabs_refonte/` folder.

R1's blocker and its seven important findings are all genuinely fixed, and verified as
such: the footer now renders five tracks side by side at 1440 px on every page in both
languages, `.lang-switcher` carries its own `:focus-visible` in its own file (the only
place Astro's scoping lets it work), `.skip-link` has its `--gold-deep` border, the sweep's
success message no longer says "reveillee", the gradient skip is now counted, and every
mobile control measures 44x44 (`.lang-switcher` 44x44, `.nav-toggle` 44x44,
`.nav-disclosure` 44x44, `.nav-cta` 109x44, `.nav-link` 274x48, measured with the accordion
open in a real 360 px viewport). The dead `.footer-legal-links` and `.section--alt` rules
are gone.

Two new defects came out of the fix commit itself, and both are reported below. One of them
is a visible regression the fix introduced.

### Blockers

- [ ] **[BLOCKER]** `src/components/Header.astro:313-321` - The R1 touch-target fix broke the
  mobile menu's close icon. `.nav-toggle` went from `display: block` with `padding: 8px` to
  `display: flex; flex-direction: column` with a 44x44 box. In block layout the three
  `span` bars' `margin: 5px 0` collapsed between siblings, putting their centres 7 px apart,
  and that 7 px is exactly what the open-state transforms compensate:
  `rotate(45deg) translate(5px, 5px)` moves a bar 5 x sqrt(2) = 7.07 px down in the page
  frame. A flex container does not collapse margins, so the centres are now 12 px apart and
  the transform no longer brings the bars together. Measured on the running preview at
  360 px: closed, bar centres at y = 24 / 36 / 48; open, the two visible bars land at
  y = 31.07 and y = 40.93 instead of both at 36. The control renders as a chevron pointing
  right, not as an X; the capture is in `menu-mobile-open` of this round's set. Reproduced
  the pre-PR geometry live by forcing `display: block; padding: 8px` on the same page: all
  three centres converge at 36.00, a correct X. The defect is on every page of the site, in
  both languages, at every viewport at or below 900 px, on the one control a mobile visitor
  must use to leave the menu.
  -> Keep the 44x44 target and restore the 7 px spacing under flex: `gap: 5px` on
  `.nav-toggle` with `margin: 0` on `.nav-toggle span`, or `margin: 2.5px 0` on the spans.
  Re-check the open state at 360 and 768 px afterwards.

### Important

- [ ] **[IMPORTANT]** `bin/contrast_sweep:26-28` - The usage recipe the file documents for a
  full-site run produces a silent false green on this machine. The header prescribes:
  `PAGES=$(cd dist && find ...)` then `bin/contrast_sweep http://localhost:4321 $PAGES`.
  Under zsh, this machine's shell, an unquoted parameter expansion is **not** word-split, so
  the 26 newline-separated paths reach the script as a single `argv` entry. Verified by
  instrumenting a copy of the script and running the documented recipe verbatim: the sweep
  navigates once to a single concatenated URL, lands on Astro's 404 page, sees 19 elements,
  finds nothing, and prints `AUCUN ECHEC AA, fondation en place` with no `NON MESURE` line
  at all. That is exactly the failure mode the file's own header says the tool exists to
  prevent, "le trou est ferme dans le journal et ouvert dans le code", and it is very
  probably where this PR's own green claim came from, since the PR reports zero failures
  and does not report the 22 unmeasured elements. Run correctly
  (`PAGES=(...)` array, `"${PAGES[@]}"`), the sweep does pass: 26 pages actually visited,
  zero AA failures, `NON MESURE (22)`. So acceptance criterion 2 holds; the recipe that
  certifies it does not.
  -> Make the recipe shell-independent (`find ... | xargs bin/contrast_sweep <url>`, or a
  `PAGES=(...)` array with `"${PAGES[@]}"`), and have the script reject an argument
  containing a newline so the collapsed form fails loudly instead of passing quietly.

- [ ] **[IMPORTANT]** `bin/contrast_sweep:112` - Same tool, the root cause underneath the
  recipe. `await send('Page.navigate', { url: base + p })` discards the CDP result, which
  carries `errorText`, and `Page.loadEventFired` fires on an error document just as it does
  on a real one. So any path that 404s contributes zero measurements, zero warnings and zero
  skipped, and the loop reports success. Verified directly:
  `bin/contrast_sweep http://localhost:4331 /page-qui-nexiste-pas /produits` prints
  `AUCUN ECHEC AA, fondation en place`. The `NON MESURE` counter D059 installed only warns
  when the pages actually rendered, so it does not close this hole; a typo in a path, a
  renamed route or a preview server on the wrong port all read as a clean sweep.
  -> Check `Page.navigate`'s `errorText`, and assert a floor on the measured element count
  or the presence of at least one `.section` before accepting a page's result.

- [ ] **[IMPORTANT]** `src/components/Hero.astro:54-56` - The comment added by this PR is
  false: "Seule section de l'accueil qui reste sombre a chaque bascule". The home page keeps
  three dark bands, not one: the hero, the services band
  (`src/components/HomeContent.astro:71`, `.section--deep`) and the closing call-to-action
  (`CtaBanner`, `.section--cta`). All three are visible on the 1440 px capture of `/`. The
  comment added to `src/styles/global.css:26-29` in the same commit lists exactly those
  three as the sections that stay dark, so the two comments contradict each other, and the
  wrong one sits on the file a maintainer opens to change the hero.
  -> Reword to what is actually singular about the hero: it is the only dark section that
  carries its surface in its own component stylesheet instead of a `.section--*` modifier.

- [ ] **[IMPORTANT]** `src/styles/global.css:26-31` - Same comment, second half. It names the
  hero among the sections that "portent desormais leur propre couleur de texte explicite",
  then sends the reader to "les regles `color` ajoutees ci-dessous a `.section--deep`,
  `.section--navy` et `.section--cta`". `.section--hero` (line 122) carries no `color`; the
  hero's colour is in `Hero.astro:64`. A maintainer following the pointer for the first item
  in the list finds nothing.
  -> Add the hero's real location to the pointer, or drop it from the list.

- [ ] **[IMPORTANT]** `src/styles/tokens.css:12`, `:41`, `:44`, `:47` and `:54` - This PR
  removed the last consumer of five tokens and left three of them documenting roles the
  codebase no longer has. Each had exactly one `var()` reference in `src/` before the diff
  and has none after it:
  `--navy-alt` (`/* fond des sections alternees */`) lost `.section--alt`, deleted in the fix
  commit, and there are no alternated sections any more;
  `--ink-72` (`/* liens de navigation au repos */`) lost `Header.astro:174`, and that role
  now belongs to `--slate-nav`, whose own comment says the same thing, so two tokens claim
  one role and only one of them is real;
  `--ink-08` (`/* bordures de panneaux */`) lost the dropdown border, now `--navy-10`, whose
  comment reads `/* bordure des menus deroulants */`;
  `--ink-40` and `--gold-08` are dead too but carry no role comment, so they are only dead,
  not misleading. D059 records removing the dead rules and is silent on the tokens they fed.
  -> Delete the five, or keep them deliberately as palette values and say so, the way
  `--ink-25` is kept with an explicit "below AA, do not use as text" rationale. Either way
  the three stale role comments have to go.

- [ ] **[IMPORTANT]** `src/styles/global.css:496-504` - The `.card--prominent` rule added in
  response to R1 is a no-op, and the comment justifying it is false. `ServiceCard` renders
  `<article class:list={['card', large ? 'card--prominent card--large' : 'card--service']}>`
  (`ServiceCard.astro:25`), so a prominent card always also carries `card` and is already
  matched by `.section--light.section--light .card` at line 489, which sets the same three
  declarations at the same (0,3,0) specificity. The component's own scoped
  `.card--prominent` compiles to (0,2,0) and loses to it regardless of order. The built CSS
  proves it: Lightning CSS merges the three selectors into one rule,
  `.section--light.section--light .card,...card--service,...card--prominent{background:var(--surface);border-color:var(--navy-08);box-shadow:var(--shadow-card)}`.
  So "sans cette regle, elle resterait sombre au milieu d'un hub devenu clair" is wrong; the
  card was already white before the rule existed. R1 was wrong to call the class uncovered
  and this round corrects itself. Harmless on screen, but the comment teaches the next
  author that every card modifier needs its own light-surface entry, which is the opposite
  of what D040 wants.
  -> Delete the rule and its comment, or fold `.card--prominent` into the line 489 selector
  list with a comment saying it is belt and braces.

- [ ] **[IMPORTANT]** `src/styles/global.css:563` - A second stale "dormant foundation"
  comment survives: "mesurees de 1.02:1 a 2.91:1 une fois la fondation **reveillee**", plus
  "forcerait UI-002 a les redecouvrir page par page" in the conditional. R1 flagged the
  identical defect at line 438 and the fix commit rewrote that one; D059 says "the stale
  'dormant foundation' comment is rewritten", singular. This paragraph sits at the head of
  the component-class peritext, the block most read when a new component needs covering, and
  it still speaks of UI-002 as future work and of an injection technique this PR removed.
  -> Rewrite it in the present, the same way lines 441-443 were.

- [ ] **[IMPORTANT]** `src/components/Header.astro:310-312` - The comment justifying the new
  44x44 says "comme `.nav-disclosure` plus haut dans ce meme fichier". `.nav-disclosure`
  above, at line 195, is 22x22 (measured at 1440 px); the 44x44 rule is **below**, at line
  390, and only inside `@media (max-width: 900px)`. The equivalent comment the same commit
  wrote in `LangSwitcher.astro:64-65` gets it right ("au meme point de rupture"); this one
  points a reader at a rule that says something else.
  -> "comme `.nav-disclosure` au meme point de rupture, plus bas dans ce fichier".

### Suggestions

- **[SUGGESTION]** `src/styles/tokens.css:73-74` - `--cream-header: #fbf9f4` and
  `--cream-header-94: rgba(251, 249, 244, 0.94)` restate the same colour in two places, and
  both are consumed (`Header.astro:130` for the sticky bar, `:364` for the mobile panel).
  Nothing links them, so changing the header cream desynchronises the two silently.
  -> `--cream-header-94: rgb(from var(--cream-header) r g b / 0.94)`, or `color-mix`.

- **[SUGGESTION]** `bin/contrast_sweep:58` and `:112-114` - `waitForLoad()` has no timeout. It
  is strictly better than the fixed 900 ms it replaced, but a page whose `load` never fires
  now hangs the sweep forever instead of producing a wrong number, with no output to say
  why. -> Race the promise against a generous timeout and report the path that timed out.

- **[SUGGESTION]** `docs/DECISIONS.md:73-74` - D059 is inserted between D053 and D055, so the
  table stops ascending by number at the two rows this branch adds. The choice of 059 over
  058 is correct, not a finding: D054 is reserved on `fix/worktree-de-revue` and D058 on
  `fix/convention-invocation-reviewer`, both unmerged. -> Move D059 after D057.

- **[SUGGESTION]** `src/components/LangSwitcher.astro:35-36` - `.lang-switcher` is 40x32 above
  the 900 px breakpoint. Below it the R1 fix takes it to 44x44, which is the case R1
  measured, and a desktop pointer is not a touch target, so this is a judgement call rather
  than a defect. Recording it so the next round does not re-open it.

### Out of scope, verified and not blocking

- `/en` still carries the old English hero, "Enterprise software built for African
  companies." with "West and Central Africa", instead of the line D037 and CLAUDE.md
  validate, "Your technology partner for businesses across Africa." with "OHADA and CIMA
  regions". This is not a UI-002 defect: `docs/work-items/UI-002.md` puts the copy changes
  out of scope explicitly, and `docs/work-items/I18N-001.md` carries the exact substitution
  with its D-rows. Flagged only so the founder knows the front door still reads the old
  positioning in English until I18N-001 lands.
- `/contact` and `/en/contact` still render the `PageScaffold` placeholder "Ossature de
  page. Le contenu editorial est redige en phase 3." on a dark surface, now the only dark
  page on a light site. Declared out of scope by the item and tracked by PAGE-002.

### Correctness (code-review skill)

Same situation as R1, re-verified this round: the `code-review` plugin is installed at
**project scope**, and its two registered `projectPath` entries are
`/Users/eblonvia/dev/workspace/altarys/labs/site-web-altaryslabs` and one unrelated repo
(`~/.claude/plugins/installed_plugins.json`). A review session runs from a worktree under
`.claude/worktrees/`, which is a different project path, so `/code-review 24` is not in the
session's skill list and cannot be invoked. D056 restored the delegation on the assumption
that installing the plugin makes it reachable from a review session; it does not, because
the reviewer never runs from the project root by construction (step 3 of
`.claude/commands/review.md` mandates a worktree). That mismatch is worth a founder decision:
either install the plugin at **user** scope, or accept that the sweep is executed manually
every round.

Rather than skip the mandated sweep, step 4 of the skill's own procedure was executed with
parallel review agents over the same diff: CLAUDE.md adherence, a shallow bug scan,
code-comment guidance, and git-history and D-row consistency. Findings were confirmed
against the code before promotion and are folded into the sections above rather than
duplicated here. The blocker did not come from an agent: it came from driving the mobile
menu in a real 360 px viewport and measuring the bars.

- CLAUDE.md adherence pass: **no violation**. No hardcoded hex outside `tokens.css`, no
  amber, no teal, no violet, no ALTARYS ENTERPRISE, no price, no client name, no date finer
  than a year, three products only, "Suite" retained on Papillon Corporate Finance, RCCM
  still `CI-ABJ`, About names one person, twelve business-facing HR module labels with no
  internal code. `--gold-65` never used as text; `--ink-25`, `--ink-40` and `#8A93A6` never
  used as small text, and this diff removes two `--ink-40` uses. All new comments in French,
  all four commit messages in French, no em-dash and no interpunct anywhere in the diff.
- Dictionary parity pass: **clean**. `columnLegal` present in both `fr.ts` and `en.ts`,
  `rights` removed from both with no remaining consumer, `Dictionary` still derived from
  `fr.ts`, `astro check` green.
- Bug-scan, comment and history passes: produced the two `contrast_sweep` findings, the five
  dead tokens, the no-op `.card--prominent` rule, the Hero comment, the `global.css:26-31`
  pointer, the second stale foundation comment, the `.nav-disclosure` cross-reference and
  the D059 ordering, all reported above and each re-verified here against the code or the
  built CSS before promotion. One candidate was discarded as a false positive: D055 was said
  to be silent on the removal of `footer.rights`, but the row on this branch already records
  it ("`footer.rights` and the copyright line disappear entirely, matching
  `Footer.dc.html`"), so R1's suggestion is closed.

A security pass is again not reported: this PR changes static CSS, Astro markup, two
dictionary strings and one Node review script. No user input, no network call, no secret, no
new dependency.

### Verified clean

- **Build**: `npm ci`, `npm run build` (26 pages) and `npm run check` (0/0/0) run
  independently in the review worktree. No `any`, no `@ts-ignore`, no loosened `Dictionary`.
- **Bilingual parity**: keys symmetric, no cross-language URL hardcoded, everything resolves
  through `ROUTES`, hreflang reciprocal on `/a-propos` and `/en/about` including `x-default`,
  switcher lands on the counterpart page, no French string on an English page and no English
  string on a French page (checked on `/en`, `/en/about`, `/en/products/papillon-hr-suite`,
  `/en/services`, `/en/contact`, `/en/legal-notice`).
- **Editorial guardrails**: no price, no client or partner name, no exact date, PCS still a
  teaser with a single external link to papillon-collection.com and its availability read
  from `t.availability.pcs`, HR Suite still twelve business-facing module labels, About still
  one person.
- **Brand**: navy and gold only, tokens throughout, Cormorant Garamond on headings, DM Sans
  on body and buttons, Space Mono on eyebrows and badges, Products before Services, no stock
  photography, logomark reused with only the surface variant added for the wordmark.
- **Visual fidelity**: `/`, `/produits/pcs`, `/produits/papillon-hr-suite`, `/services`,
  `/a-propos`, `/mentions-legales`, `/contact`, `/en`, `/en/about`,
  `/en/products/papillon-hr-suite` captured at 360, 768 and 1440 px and compared with their
  root prototypes. PCS closes on the hero with no CTA band, HR Suite alternates light, navy,
  light, the footer's five columns sit on one row at 1440 and fold to two then one at 900 and
  520, the desktop dropdown is a white card on `--shadow-menu` and holds the consulting entry
  without overflow in both languages, the mobile accordion is cream. Nothing inline-styled was
  copied from a `.dc.html`, nothing from `support.js`.
- **Contrast**: `bin/contrast_sweep` over all 26 routes, invoked correctly, returns zero AA
  failures with the foundation live, and now declares its own 22 unmeasured gradient-backed
  elements. Acceptance criterion 2 is met; see the IMPORTANT above about the recipe.
- **Accessibility**: focus rules verified in the built CSS
  (`.lang-switcher:focus-visible`, `.nav :focus-visible`, `.skip-link:focus-visible` and
  `.section--light :focus-visible` all resolve to `--gold-deep`); one `h1` per page with no
  level skipped on `/`, `/a-propos`, `/produits/papillon-hr-suite` and `/en`;
  `prefers-reduced-motion` honoured in two places in `global.css`; all mobile controls at
  44 px.
- **SEO**: canonical, hreflang, Open Graph with `fr_CI` and `en`, Twitter Card and JSON-LD all
  still centralised in `BaseLayout.astro`. `public/og-image.png` and `public/og-image-en.png`
  both exist and are the ones referenced. Sitemap generated, `robots.txt` coherent, no orphan
  page now that the footer carries a Legal column.
- **Performance**: no client-side JavaScript added, no dependency added, no image added, no
  render-blocking resource added.
- **Deployment**: static output preserved, build output still `./dist`, no adapter, D1 binding
  still commented out with its comma warning intact, no secret committed, PR #24 targets
  `refonte-multipages`.

### Summary

R1's eight findings are genuinely fixed and verified. The fix commit introduced one visible
regression: making `.nav-toggle` a flex container to reach 44x44 stopped its bars' margins
from collapsing, so the mobile menu's close control now draws a chevron instead of an X, on
every page and in both languages. A second pair of findings matters almost as much without
being visible: `bin/contrast_sweep` accepts a failed navigation as a measured page, and the
full-site recipe it documents collapses to a single argument under zsh, so the tool prints a
clean pass after measuring one 404 - the exact false green it was written to prevent. Five
stale or contradictory comments, five dead tokens and one no-op CSS rule make up the rest.
