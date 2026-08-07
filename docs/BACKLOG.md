# Backlog - altaryslabs.com rebuild

State of play at the close of 7 August 2026. This index exists so a session that
resumes the work does not have to reconstruct it from a conversation it cannot
read. Item details live in `docs/work-items/`; decisions in `docs/DECISIONS.md`.

## Where the rebuild stands

26 pages built, bilingual, `npm run check` clean. **Every page is final.**
`PAGE-002` delivered the two Contact pages and deleted `PageScaffold.astro`, the
provisional scaffold, which no longer exists in the tree.

What is not final is the contact form's **submission**: the markup ships inert
behind a guard script, and `FORM-001` makes it actually send. See D064.

**The site is light.** The July 2026 handoff turns it into an alternation of
cream and navy. `UI-001` installed that foundation dormant and `UI-002` threw
the switch on 2026-08-07: the default background is cream, every section
declares its surface explicitly rather than inheriting, and the footer is five
columns. Nothing about the palette is pending any more.

`main` still serves the legacy one-page site through GitHub Pages. Nothing has
been merged into it. The rebuild lives on `refonte-multipages`.

## Done

| Item | What it delivered |
|---|---|
| `PAGE-001` | About page, FR and EN |
| `UI-001` | Two-surface token system, `.section--light` peritext, twenty-three contrast corrections, `bin/contrast_sweep` |
| `SITE-FIX-001` | Reviewer tooling: `bin/review_shots`, correctness sweep spelled out, allowlist cleaned |
| `OPS-001` | Duplicate Cloudflare Pages project deleted, step 1 of 1 |
| `UI-002` | Light-surface switch across the whole site, five-column footer |
| `I18N-001` | The handoff copy deltas: both heroes, the consulting service name, the English leadership role |
| `PAGE-002` | Contact pages FR and EN, inert form, three states, `PageScaffold` deleted |
| `I18N-FIX-001` | The residual-string sweep: nine values still carrying the pre-handoff positioning, plus a stale comment |

## Open, in dependency order

| Order | Item | Blocked by | Doc |
|---|---|---|---|
| 0 | `SITE-FIX-002` | nothing, and see below | `docs/work-items/SITE-FIX-002.md` |
| 0 | `SITE-CHR-002` | nothing | `docs/work-items/SITE-CHR-002.md` |
| 0 | `SITE-FIX-007` | nothing | `docs/work-items/SITE-FIX-007.md` |
| 1 | `UI-FIX-001` | nothing | `docs/work-items/UI-FIX-001.md` |
| 1 | `SEO-FIX-001` | `I18N-FIX-001`, merged | `docs/work-items/SEO-FIX-001.md` |
| 3 | `UI-FIX-002` | nothing, `UI-002` has merged | `docs/work-items/UI-FIX-002.md` |
| 3 | `UI-REF-001` | nothing, `UI-002` has merged | `docs/work-items/UI-REF-001.md` |
| 4 | `FORM-001` | `PAGE-002` | `docs/work-items/FORM-001.md` |
| 5 | `OPS-002` | everything above | `docs/work-items/OPS-002.md` |

**`SITE-FIX-007` is order 0 for the same reason `SITE-FIX-002` is.** It corrects
two lines of `REVIEWER.md` that contradict `CLAUDE.md`, one of which tells every
reviewer that Services come before Products. Until it lands, each round can raise
a blocker against a correct site, and an unattended round has nobody to catch it.
Run it before the next review, not after.

**Next up, not yet written as an item**: the footer reorganisation. The updated
`Footer.dc.html` moves the contact details into their own column, sends `About`
down to Legal, and finally publishes an email and a phone number. That unblocks
D069, whose error state and no-JavaScript fallback on the Contact page are still
worded for a site that publishes no channel at all.

The `I18N-FIX-001` / `PAGE-002` collision this file used to warn about is
resolved: `PAGE-002` merged first with its `contact` block, and `I18N-FIX-001`
merged on top of it, its footer and meta keys sitting far from those.

**`SEO-FIX-001` waits on nothing technical**, only on the copy: the two Open Graph
thumbnails must carry the wording `I18N-FIX-001` settled, so they are exported
after it merges. It needs a founder ruling on the line each thumbnail carries.

**Watch the D-numbers.** `PAGE-002` merged with D064 to D071, and this branch had
already reserved D070 and D071 for other decisions, so it was renumbered to D072
to D075 on merge. **Two unmerged branches still claim rows that now exist**:
`fix/procedure-de-revue` holds D064 to D066 and `fix/worktree-de-revue-r3` D064
to D065. Both will have to renumber before they land.

The lesson is not "grep harder", which the header of `DECISIONS.md` already tells
you to do and which this branch did do. It is that **a reservation goes stale the
moment another branch merges**. Re-check immediately before opening the pull
request, not only when reserving, and rebase rather than assuming the base has
not moved.

**Order 0 touches no page and no token.** `SITE-FIX-002` edits the review
procedure, `SITE-CHR-002` edits a review file. Both are safe at any moment and
collide with nothing. `SITE-FIX-002` is listed first for a reason: it fixes a
worktree step that silently detaches and loses the review at its last step, so
every round run before it is one more round relying on the reviewer improvising
a rescue. Run it before the next review, not after.

**`UI-FIX-002` and `UI-REF-001` waited for `UI-002`**, and the reason was not
priority: `UI-002` rewrote `global.css` and every page, `UI-REF-001` promotes a
modifier into `global.css`, and `UI-FIX-002` edits four grid components. Running
either alongside `UI-002` would have meant resolving the same file twice, and
`UI-REF-001` in particular turns on a specificity tie that `UI-002` was actively
moving. **`UI-002` merged on 2026-08-07, so the wait is over** and both are
small. Order 3 is now a statement of size, not of dependency.

`OPS-002` is the DNS cutover and is a founder decision taken once, deliberately.

## Founder decisions still open

None of these blocks the items above, but each one will be asked eventually.

1. **Legal texts.** The notice and the privacy policy were adapted from
   papillon-collection.com and published pending a lawyer's review (D022). Their
   wording is locked against the handoff (D032), but not against a lawyer.
2. **Social accounts** for the footer. The handoff's five-column footer has no
   social column, and `UI-002` built it that way. Adding accounts now means
   editing a shipped footer rather than shaping one being written, so it is a
   small item rather than a free choice.
3. **Naming the technical stack** on the custom development page. Java, Spring
   Boot, React and TypeScript appear there today, and the handoff keeps them.
   Confirm or remove.
4. ~~**`en.ts:349`**, the Services hub meta description, opens with "IT, HR and
   finance consulting" in lower case.~~ **Closed on 2026-08-07 by D061**: it is
   the service name, it is capitalised, and the rule extends to all three
   services named in that sentence, in both languages.
5. **The legal line is set at 10.5px**, on the About page and in the footer. The
   contrast passes since `UI-001`, so this is a readability call, not an
   accessibility failure. It is the line carrying the RCCM number, which is
   what a procurement officer will try to read. `UI-FIX-002` asks the question
   and recommends 12px; it does not decide.

## Debt carried knowingly

`docs/reviews/UI-001-review.md` carries **three rounds, all CHANGES REQUESTED**,
and PR #15 was merged anyway. That is the founder's call, taken with the rounds
in hand. But no closing round was ever run, so the file now asserts open
findings whose current state nobody has checked.

`SITE-CHR-002` closes the same staleness on `PAGE-001`, where the four findings
were verified resolved. It deliberately does **not** cover `UI-001`: auditing
three rounds of another session and guessing which findings survived would be
invented work. Sizing that needs someone holding the `UI-001` context.

**That window has closed.** The note above wanted this done before `UI-002` built
on the same foundation; `UI-002` merged on 2026-08-07 with three review rounds of
its own, so the `UI-001` findings are now buried under a rewrite of the same
files. Whoever picks this up is auditing history, not protecting the next item.

## Working rules that cost time when forgotten

- **Read the prototypes at the ROOT** of the claude.ai/design project, never the
  frozen `design_handoff_altaryslabs_refonte/` folder. That folder is the first
  all-navy iteration and already caused a page to be built obsolete on the day
  it merged.
- **The prototypes are wrong on six points.** `CLAUDE.md` lists them with their
  decision rows. The repository wins on all six.
- **Run `bin/contrast_sweep` before declaring a UI item done.** Three review
  rounds in a row found colour classes that reading had missed. Measuring
  converges; enumerating does not. See D048.
- **D-numbers collide across branches.** Grep every open branch before
  reserving, as `docs/DECISIONS.md` explains at the top.
- Every branch that appends to `docs/DECISIONS.md` conflicts with every other
  one. The resolution is juxtaposition: the numbers are disjoint, no row is ever
  arbitrated against another.
