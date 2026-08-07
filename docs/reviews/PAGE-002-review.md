# PAGE-002 - Contact pages, French and English

Review rounds for `feat/page-contact`, PR #26.

## Round 1 - 2026-08-07

**Verdict**: CHANGES REQUESTED

Round run in a dedicated worktree, `review-page-002` forked from
`origin/feat/page-contact` at `c98e2de`. `npm ci`, `npm run build` and
`npm run check` were run independently in that worktree: build green, 26 pages,
check clean at 0 errors / 0 warnings / 0 hints. Both pages were served and
driven through a real Chrome over the DevTools protocol, at 360, 768 and 1440 px
in both languages, plus the `?statut=envoye` and `?statut=erreur` states and the
blocked-submit state. `bin/contrast_sweep` returns `AUCUN ECHEC AA` over the
whole site and over the four state URLs.

The page is good work. The three-state markup is the right call, the trap
recorded in the work item (`display: flex` beating `[hidden]`) is genuinely
subtle and correctly fixed, the select derived from `pageName` is a real
improvement on the prototype, and both languages hold at all three widths. The
findings below are all repairable without touching that structure.

### Blockers

None. Nothing in this PR breaks the build, bilingual parity, the palette, the
editorial guardrails or the SEO surfaces.

### Important

- [ ] **[IMPORTANT]** `src/components/ContactContent.astro:225` - `pending.scrollIntoView({ behavior: 'smooth', ... })` forces a smooth scroll that ignores `prefers-reduced-motion: reduce`. The repository installs that contract itself, at `src/styles/global.css:98-101`, where the media query resets `scroll-behavior` to `auto`; the explicit `behavior` option in a `scrollIntoView` call overrides the computed CSS value, so this one call walks straight through the guard. Measured, not read: with `prefers-reduced-motion: reduce` emulated and `getComputedStyle(document.documentElement).scrollBehavior` returning `auto`, `window.scrollY` after the blocked submit samples `0, 0, 0, 1, 4, 15, 22, 27, 29, 31, 32, 33` across successive frames instead of landing in one step. -> Read the preference and pass the matching value, for example `behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'`. The same guard belongs in `FORM-001` if it keeps a scroll on the success path.

- [ ] **[IMPORTANT]** `src/components/ContactContent.astro:139` - `required` on `#contact-interest` never fires, and the field silently defaults to the one product that is not yet on sale. The first option carries a non-empty value, so the control is valid from the first paint: `document.getElementById('contact-interest').checkValidity()` returns `true` on a page nobody has touched, and its value is `Papillon Collection Solution`, the product `fr.ts:23` labels `Disponible T3 2026`. Every visitor who fills the form without opening the dropdown is recorded, and answered, as a PCS lead. On a page whose whole purpose is to qualify an inbound enquiry, that is a commercial defect and not only a markup one. -> Add a first option with an empty `value`, `disabled` and `selected`, and a prompt string in both dictionaries (`Choisissez` / `Select one`). `required` then means what it says, and the default stops being a claim about the visitor's interest.

- [ ] **[IMPORTANT]** `src/components/ContactContent.astro:156-158` - the `noscript` note sits **after** all six fields, which is the opposite of what it exists to do. The component's own comment at `ContactContent.astro:349-350` says "le message le dit avant les six champs remplis pour rien", and `docs/work-items/PAGE-002.md:43-46` repeats it ("rather than letting the visitor fill six fields for nothing"). In the rendered document the note comes after the message textarea: a visitor without JavaScript reads it having already filled the form. The comment and the work item are therefore also factually wrong about the delivered markup, which is a defect in its own right for whoever maintains this next. -> Move the `<noscript>` block above the first `.field-row`, or correct both the comment and the work item to describe what actually ships.

- [ ] **[IMPORTANT]** `wrangler.jsonc:26-29` - the new `PUBLIC_TURNSTILE_SITE_KEY` is absent from the file that inventories this project's Cloudflare variables. That comment block says "Variables d'environnement a definir dans le dashboard Cloudflare Pages (Settings > Environment variables), jamais en dur dans ce fichier" and lists two, `CONTACT_NOTIFY_EMAIL` and `TURNSTILE_SECRET_KEY`. D065 introduces a third and records it only in `docs/DECISIONS.md`. Two things compound: the site is static output, so `import.meta.env.PUBLIC_*` is baked in **at build time**, and an operator who sets the key as a runtime Function variable will see nothing change; and the fallback is silent, an empty 65px slot with no warning anywhere. Once `FORM-001` lands its server-side verification, a build made without that variable renders a form that looks perfect and loses every message sent through it. -> Add the variable to that comment block, marked explicitly as a build variable, and consider having `FORM-001` fail the build rather than fall back silently once the endpoint is real.

- [ ] **[IMPORTANT]** `docs/BACKLOG.md:9-10` - now false because of this PR: "Every page is final except the two Contact pages, which are still `PageScaffold` placeholders." This PR delivers both pages and deletes `PageScaffold.astro`. The backlog is the file a resuming session reads first, by its own preamble, so a wrong sentence there costs more than elsewhere. -> Update the sentence and move `PAGE-002` out of the open table in the same commit.

- [ ] **[IMPORTANT]** `.claude/personalities/REVIEWER.md:118` and `.claude/personalities/TECH_LEAD.md:116` - both instruct their session to reuse `PageScaffold` as an existing component ("`PageScaffold`, `BaseLayout`, `Header`, `Footer`, `LangSwitcher` and `Logo` already exist"). This PR deletes it. The next tech-lead session is seeded with a list naming a component that is no longer in the tree. -> Drop `PageScaffold` from both lists.

### Suggestions

- **[SUGGESTION]** `src/components/ContactContent.astro:140-141` - the seven `option` elements use their own translated label as `value`, so the same interest reaches `FORM-001` as `Conseil IT, RH & Corporate Finance` from one page and `IT, HR & Corporate Finance Consulting` from the other. Fine for an email notification, awkward for a D1 column anyone later wants to group by, and it will drift again the next time a `pageName` changes. -> Consider `value={key}` with the `PageKey` and `interestOther` as `other`, keeping the label as the option's text.

- **[SUGGESTION]** `src/components/ContactContent.astro:317-319` - `.field-optional { color: var(--slate-body) }` changes nothing: it sits inside `.field-label`, which `src/styles/global.css:649-652` already paints `--slate-body`. -> Either drop the rule or give the suffix a real distinction from the label it qualifies.

- **[SUGGESTION]** `src/styles/global.css:676-681` - the form controls ring at `outline-offset: 1px` while every other focusable element on the site rings at `3px`, measured by tabbing through the page (nav links, the header call to action, the submit button and the privacy link all report `3px`, the six controls report `1px`). This PR is the first page to render those rules, so the divergence becomes visible here even though the CSS came from `UI-001`. Not an accessibility failure: the ring is `2px solid #B8791E` in both cases, above the 3:1 required for a focus indicator. I checked the related claim that `:focus` rather than `:focus-visible` would make the fields ring on a mouse click alone, and it does not hold: measured with real mouse events, Chrome matches `:focus-visible` on click for `input`, `textarea` and `select` alike, so the two selectors behave identically here. -> Reviewer's taste only; unify to `3px` or record the 1px as deliberate.

- **[SUGGESTION]** `src/components/ContactContent.astro:59` - the prototype composes its heading block inside the same 640px column as the form; `PageHeader` centres it in 900px, so the title and the intro run wider than the fields below them at 1440px. Reusing the shared component is the right instinct and every other inner page does the same. -> Note only, unless the founder wants the Contact heading narrowed to match the form.

- **[SUGGESTION]** `src/components/ContactContent.astro:63-76` - the copy of all three state panels ships in the static HTML of `/contact`, including "Formulaire bientot disponible". `hidden` text is discounted by search engines and the meta description is explicit, so the risk of it surfacing in a snippet is low, but it disappears entirely once `FORM-001` removes the pending panel.

- **[SUGGESTION]** `src/components/ContactContent.astro:221-226` - after a blocked submit the panel is revealed and scrolled to, but focus stays on the submit button. `role="alert"` covers the announcement; moving focus to the panel would also serve a magnifier user. -> Optional, and it belongs with `FORM-001` if the real error path gets the same treatment.

### Correctness (code-review skill)

The skill was run on PR #26 as the procedure requires: eligibility check, CLAUDE.md audit, shallow bug scan, git-history pass, prior-PR-comments pass and code-comment-compliance pass. It posts its own comment on the PR; this section is the durable record.

Kept, after confirming each against the code:

- **[IMPORTANT]** the inert `required` on the interest select. Raised independently by the shallow bug scan and confirmed in the browser. Recorded in full above.
- **[SUGGESTION]** the focus-ring offset divergence on the form controls, first raised as a suggestion in `docs/reviews/UI-001-review.md` round 1 while the rules were still dormant and now live for the first time. Recorded above, with the mouse-click premise corrected by measurement.
- **[SUGGESTION]** the narrow reading of D040. `ContactContent.astro:240-243` argues in a code comment that its light-born classes need no `.section--light` peritext entry. The argument is correct, the component only ever renders on a light section, and `bin/contrast_sweep` confirms it. It is also the same reading `UI-001` applied to its own `.field-*` block. -> Worth a D-row rather than a code comment, since every other divergence in this PR got one.

Discarded as false positives, each checked before being dropped:

- "acceptance criterion 4 counts four `?statut=` states but only two exist". The arithmetic is right: two values across two languages is four URLs, plus the two default states makes the six the PR description cites.
- "`#form-sent` is missing `role="alert"` while the other two panels have it". The success panel is revealed during document parsing on a fresh page load, so it is read in normal document order; an alert role there would be redundant, and the two panels that do carry it are the ones revealed after load.
- "the form controls use `:focus` instead of `:focus-visible`, so they will ring on a mouse click alone". Measured with real mouse events: Chrome matches `:focus-visible` on click for `input`, `textarea` and `select`, so the two selectors are equivalent for these controls. Only the offset differs, kept as a suggestion above.

### Checklist evidence

- **Build**: `npm ci`, `npm run build` (26 pages), `npm run check` (0/0/0), all run in the review worktree. Nothing suppressed with `any`, `@ts-ignore` or a loosened `Dictionary`.
- **Bilingual parity**: the 25 keys of the new `contact` block exist on both sides, enforced by the `Dictionary` type still derived from `fr.ts`. No route change was needed. hreflang is reciprocal and carries `x-default` to the French page on both. The switcher lands on `/en/contact` from French and `/contact` from English. No French string on the English page and no English string on the French one, attributes included: placeholders, `aria-label`s and meta descriptions all check out.
- **Editorial guardrails**: no price, no client or partner name, no exact date, no invented figure. Only the three current products, "Papillon Corporate Finance Suite" keeps its "Suite" per D017, no trace of ALTARYS ENTERPRISE.
- **Brand**: navy and gold only, every colour a token from `tokens.css`, no hardcoded hex in the component, no amber, no teal, no violet. `--gold-65` unused, gold text on light is `--gold-deeper`, muted text is `--slate-body`, per D029 and D030.
- **Visual fidelity**: compared against `contact.dc.html` at the ROOT of the design project, not the frozen handoff folder. The page is recreated with the repository's own components; no inline-styled HTML and nothing from `support.js`. The documented divergences (select order and contents per D068, eyebrow colour per D029) are the correct ones.
- **SEO**: title, description, canonical, Open Graph, Twitter Card and JSON-LD all still emitted centrally by `BaseLayout.astro`. OG locales `fr_CI` and `en`. Both OG images exist in `public/` and ship to `dist/`. Both routes are in the generated sitemap, `robots.txt` is unchanged and coherent, and neither page is an orphan.
- **Accessibility**: one `h1` per page, no level skipped, the state panels are paragraphs and not headings. Tab order runs header, then the six controls in visual order, then submit, then the privacy link, with a visible ring on every stop. Touch targets at 360px measure 44 to 53px on all seven controls. Colour is never the sole carrier of meaning: the success card and the error banner differ by shape and by text. `lang` correct on both. The one gap is the reduced-motion finding above.
- **Performance**: no new dependency, no hydration, no framework. The contact page ships three small inline module scripts, the largest of which is the pre-existing header script; the guard script is 212 bytes minified. No render-blocking external resource is added while `PUBLIC_TURNSTILE_SITE_KEY` is unset.
- **Deployment**: static output preserved, build output still `./dist`, no adapter, no `/functions` directory yet, D1 binding still commented out, no secret committed. The PR targets `refonte-multipages`, not `main`.

### Summary

Solid page, correct in both languages at all three widths, and green on build, check and contrast. Six findings hold it: a smooth scroll that walks through the repository's own reduced-motion guard, an inert `required` that silently files every untouched enquiry under the one product that is not for sale yet, a `noscript` note placed after the fields it exists to spare, a new build-time Cloudflare variable recorded nowhere an operator will look, and three documents left naming a component this PR deletes. None of them touches the structure of the page.
