# PAGE-001 - Review log

Work item: `docs/work-items/PAGE-001.md`. Branch `feat/page-a-propos`, PR #14, base `refonte-multipages`.

## Round 1 - 2026-07-31
**Verdict**: CHANGES REQUESTED

### What was actually run

Review worktree forked from `origin/feat/page-a-propos` at `7c674d5` (detached), never on `main` or `refonte-multipages`, read-only on source.

- `npm ci` clean.
- `npm run build` green, 26 pages, sitemap generated.
- `npm run check` : 0 error, 0 warning, 0 hint.
- `npm run preview` served on port 4331; both pages driven in headless Chrome over CDP with explicit device metrics, at 360px, 768px and 1440px, in FR and EN. Six renders inspected.
- Prototype `design_handoff_altaryslabs_refonte/a-propos.dc.html` read from the claude.ai/design project and compared block by block.
- Contrast ratios computed from the composited token values rather than eyeballed. Numbers are quoted in the findings.

Two procedural notes, both stated rather than worked around:

1. The `code-review` skill named in `REVIEWER.md` is **not installed** in this session; the skill list carries `security-review` and `simplify` but no `code-review`. The generic-correctness sweep was therefore done by hand over the eight changed files (imports, unused bindings, dead branches, slot wiring, scoped-style reach, list semantics, hydration). Nothing mechanical was found. `REVIEWER.md` should either register the skill or drop the mandatory step.
2. Two blockers below are pre-existing and sit outside this PR's scope. `REVIEWER.md` asks that such blockers be materialized as a tracked work item plus a D-row. The autonomous allowlist grants writes to `docs/reviews/**` only, so **I could not create those files**. They are specified below and owed to the next TECH_LEAD session. Tracking is owed in addition to the block, not instead of it.

### Blockers

- [ ] **[BLOCKER]** `src/components/AboutContent.astro:120` - `.leadership-label` renders the "Direction" / "Leadership" eyebrow in `--gold-65` at `font-size: 10px` on the `--navy-mid` card. Composited that is `rgb(139,109,50)` on `#1a2740`, a contrast ratio of **3.06:1**. WCAG AA requires 4.5:1 for text under 18.66px bold / 24px regular. The label is visibly faint in every one of the six renders. Introduced by this PR. -> Switch the color to `var(--gold-light)` (7.87:1 on `--navy-mid`) or `var(--gold)` (5.40:1). Do not hardcode a hex.

- [ ] **[BLOCKER]** `src/styles/global.css:169` - `.section-label` uses `--gold-65` at `font-size: 10px`, which is **3.49:1** on `--navy-deep`. Same AA failure, site-wide, and this PR consumes it twice more (the "A propos" eyebrow in `PageHeader` and the new "Notre approche" eyebrow). Pre-existing, but real and verified, so it blocks under the maximal bar. -> `var(--gold-light)` gives 10.01:1 on `--navy-deep` and `var(--gold)` gives 6.86:1; either keeps the eyebrow gold and passes. Owed follow-up: work item `UI-FIX-NNN` "Eyebrow and legal-line contrast", plus a D-row recording the token change.

- [ ] **[BLOCKER]** `src/components/Footer.astro:134` and `src/components/Footer.astro:150` - the footer legal line is `--ink-25` at 10.5px (**2.09:1**) and the "Mentions legales" / "Politique de confidentialite" links are `--ink-40` at 10.5px (**3.61:1**). Both fail AA, on every one of the 26 pages, and the legal links are also the only route to the two legal pages. The PR description discloses the first of the two and defers it; disclosure is not a waiver, and the second was not spotted. -> `--ink-50` gives 5.05:1 and `--ink-60` gives 5.91:1 on `--navy-footer`. Fold into the same `UI-FIX-NNN` item as above. Only the founder may accept this as tracked debt and merge anyway.

### Important

- [ ] **[IMPORTANT]** `CLAUDE.md:123` and `CLAUDE.md:145` - `CLAUDE.md` names the third product "Papillon Corporate Finance", while every dictionary key, every nav entry, every footer entry, every page title and the new `D017` row in this PR say "Papillon Corporate Finance **Suite**". `CLAUDE.md` is declared the authoritative contract that wins over every other document, so a stale product name in it will make a future session rename the product across 26 pages in good faith. The PR is what surfaces the conflict, by writing `D017` down. -> Reconcile in one direction. If the founder call recorded in `D017` stands, update the `CLAUDE.md` sitemap row and Product Lines bullet to "Papillon Corporate Finance Suite". This is a documentation fix, not a source change; it belongs on this branch or on a small `SITE-FIX` item, not silently deferred.

### Suggestions

- **[SUGGESTION]** `src/components/AboutContent.astro:38` - the "Notre approche" block opens with a `.section-label` eyebrow and no `.section-title`, so the three `h2` card titles hang under no section heading. Everywhere else on the site the eyebrow is paired with a section title (`SectionHeader`). Not a WCAG failure, but a screen-reader user browsing by heading gets three principles with no announced parent. -> Either add a short section title or drop the eyebrow and let the cards stand alone, as `DomainGrid` already does.

- **[SUGGESTION]** `src/components/AboutContent.astro:41` - `<ul class="grid-3 approach-grid">` with `list-style: none` loses list semantics in Safari with VoiceOver. Same pattern as `DomainGrid`, `FeatureGrid` and `ModuleGrid`, so this is a house convention rather than a regression. -> If it is ever fixed, fix it in all four at once by adding `role="list"`.

- **[SUGGESTION]** `src/components/AboutContent.astro:88` - `.card-text.is-last { margin-bottom: 0 }` is now declared in at least `AboutContent` and `DomainGrid`. Scoped styles force the repetition, but `is-last` has become a shared modifier. -> Promote it to `global.css` next to `.card-text`.

- **[SUGGESTION]** `src/components/AboutContent.astro:137` - the legal line is set at 10.5px. Contrast is fine at `--muted-soft` (6.51:1), so this is not a blocker, but 10.5px is below the size at which the RCCM number is comfortably readable on a phone, and it is precisely the string a procurement officer will try to read. -> 12px would cost nothing visually.

### Visual fidelity against the prototype

Verified against `a-propos.dc.html` at 360px, 768px and 1440px, FR and EN.

Matches: block order, eyebrow, `clamp(32px,4vw,48px)` H1, the two lede paragraphs, the leadership card at `--gold-15` border and `--radius-card`, the 22px Cormorant name over the 14px `--muted-soft` role, the legal line in Space Mono, the CTA gradient `--navy-mid` to `--navy`, and the single gold primary button. Everything is recreated with repository components on tokens; no inline-styled markup and nothing from `support.js`. The prototype's `CI-ABI` RCCM is correctly superseded by `CI-ABJ`, per `D020`.

Deltas, all deliberate and none blocking:

- The prototype centres a single 820px column. The implementation left-aligns the header at 820px and the grid, card and legal line at 1000px, matching `DomainGrid` and `ApproachCard` on the services pages. At 1440px this leaves roughly 270px of empty gutter on the right, and the leadership card carries three short lines across 1000px. Consistent with the rest of the site, so it reads as a site-wide layout decision rather than an About-page slip. Owed founder eyeball, not a finding.
- The prototype sets "ALTARYS LABS" in ivory bold inside the lede; the implementation does not.
- The "Notre approche" block is an addition, out of prototype, covered by `D023`.

### Checklist results

- **Bilingual parity**: every `about` key present on both sides, `Dictionary` still derived from `fr.ts` with no annotation added, no cross-language URL hardcoded. `hreflang` fr / en / x-default reciprocal and correct on both pages. The switcher on `/a-propos` points to `/en/about` and back. No language leak in either direction, including `lang`, the skip link, the nav ARIA labels and the meta descriptions. EN is a genuine readaptation: OHADA and CIMA spelled out in the lede, acronyms kept out of the card titles per `D024`, CNPS and ITS replaced by "country payroll and social contribution rules".
- **Editorial guardrails**: no price anywhere; no client or partner name; no exact date; one person named, Emmanuel Blonvia, Fondateur et President, no org chart and no headcount; the banking / insurance / complex secure systems claim is the sentence already live on the home page (`fr.ts:121`), so `D026` checks out; no invented figure or testimonial; the three principles trace to `platform-saas-blueprint.md`. `availability.pcs` remains the single "Disponible T3 2026" constant and this PR does not touch it. Three products only, no ALTARYS ENTERPRISE outside the explanatory comment in `tokens.css`.
- **Brand**: navy and gold only. No amber, no teal, no violet, in source or in the built CSS. Every color on both pages comes from `tokens.css`; no hex in `AboutContent.astro`. Cormorant for the H1, card titles and the leader name; DM Sans for body and button; Space Mono for the eyebrows, the "Direction" label and the legal line. Logomarks untouched.
- **SEO**: unique title and description per page and per language, canonical correct, OG and Twitter complete, `og:locale` `fr_CI` and `en`, `og-image.png` and `og-image-en.png` both present in `public/` and emitted to `dist/`. Everything still centralized in `BaseLayout.astro`; neither page hand-rolls a tag. Both routes appear in the sitemap. Page reachable from the header nav and the footer.
- **Accessibility**: one `h1`, no level skipped, focus visible via the global `:focus-visible`, `prefers-reduced-motion` honoured by `.fade-in`, no image without a text equivalent, CTA target well over 44px at every width. Contrast is where it fails; see the blockers.
- **Performance**: no new client-side JavaScript, no new dependency, no new asset. The page adds about 1.4 KB of scoped CSS.
- **Code quality**: `PageHeader`, `CtaBanner` and `BaseLayout` reused; all copy in the dictionaries; the `PageHeader` default slot is genuinely inert for the six existing consumers, which pass only `slot="actions"`; comments in French; no dead code.
- **Deployment**: static output preserved, `pages_build_output_dir` still `./dist`, D1 block still commented out with the comma warning intact, no `/functions` change, no secret, PR targets `refonte-multipages`.

### Summary

The page itself is well built: faithful where it should be, deliberate where it departs, bilingual parity clean, guardrails respected, build and check green in an independent worktree. It is blocked on contrast only. One AA failure is introduced here (the "Direction" eyebrow at 3.06:1) and two are pre-existing and verified (`.section-label` at 3.49:1, the footer legal line and links at 2.09:1 and 3.61:1); under the maximal bar all three block, and the two pre-existing ones need a tracked `UI-FIX` item that the reviewer allowlist prevented me from creating. The one non-contrast item is a documentation conflict this PR surfaces: `CLAUDE.md` still calls the third product "Papillon Corporate Finance" while the site and the new `D017` call it "Papillon Corporate Finance Suite".
