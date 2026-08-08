# altaryslabs.com - AI-Assisted Development Workflow

*v1.0 - showcase website - ALTARYS LABS, Cote d'Ivoire*

---

## Purpose

A pragmatic AI workflow for the ALTARYS LABS showcase website, sized for a solo founder plus Claude. It is deliberately lighter than the workflow used on the product repositories: this is a static bilingual marketing site, not a multi-tenant application.

Two things it keeps from the heavier pipeline, because they are what actually prevents defects:

1. **Fresh-session personalities**, so each step gets unbiased input.
2. **The Writer / Reviewer separation**, so nobody reviews their own work.

Everything else is trimmed.

---

## What makes this project different

The failure modes here are not crashes. They are **credibility failures**, and they are silent:

- an English sentence on a French page
- a page that exists in French but not in English
- a violet accent that belongs to a product not yet launched
- an Open Graph image referenced but never uploaded, killing every WhatsApp preview
- a client name published without approval
- a fabricated figure that a prospect can disprove in one question

The visitor is an Ivorian executive (DG, DSI, DRH) evaluating IT contractors for tenders worth 20 to 100 million FCFA. The site has about 30 seconds to establish that ALTARYS LABS is a serious engineering company. That is the quality bar.

---

## Deployed files

| Content | Location |
|---|---|
| Personality system prompts | `.claude/personalities/*.md` |
| CLI launchers | `bin/tech-lead`, `bin/reviewer`, `bin/autonomous_reviewer` |
| Slash commands | `.claude/commands/*.md` |
| Shared reviewer procedure | `.claude/reviewer-append.txt` |
| Autonomous reviewer allowlist | `.claude/autonomous-reviewer-settings.json` |
| Write-delegate subagent | `.claude/agents/file-writer.md` |
| This workflow | `docs/AI_Development_Workflow.md` |
| Project AI context | `CLAUDE.md` |
| Reference documents (spec, brand, PRD, blueprint) | `docs/vitrine/` |
| Redesign mission and design brief | `docs/vitrine/refonte/` |
| Decision log | `docs/DECISIONS.md` |
| Work item docs | `docs/work-items/<ID>.md` |
| Reviews | `docs/reviews/<ID>-review.md` |
| Design handoffs and mockups | `docs/design/` |

Folders that do not exist yet are created by the first work item that needs them.

---

## The two personalities

| # | Personality | File | Launcher | Role |
|---|---|---|---|---|
| - | *Human: founder* | - | - | Sets editorial and commercial direction, approves the plan, approves the done gate, merges |
| 1 | **TECH_LEAD** | `.claude/personalities/TECH_LEAD.md` | `bin/tech-lead`, `/tech-lead` | Architect + product owner + developer + designer, in one session with a single plan gate |
| 2 | **REVIEWER** | `.claude/personalities/REVIEWER.md` | `bin/reviewer`, `bin/autonomous_reviewer`, `/review` | Independent review: build, bilingual parity, brand, editorial guardrails, SEO, accessibility, performance, deployment |
| - | *Human: founder* | - | - | Merges the PR, then updates `CLAUDE.md` with anything the next session must know |

A third, non-personality helper sits alongside them: `.claude/agents/file-writer.md`, a Haiku subagent that persists finalized documentation writes. See "Write delegation" below.

**Why fresh sessions matter**: Claude will not be biased toward content or code it just wrote. Always launch a new session for the REVIEWER. Never reuse the TECH_LEAD session. This is non-negotiable and no deadline justifies waiving it.

The heavier product repositories run seven personalities (analyst, legal auditor, architect, designer, product owner, developer, reviewer). Two is enough here because there is no legal exposure in a marketing page, no data model, and no cross-module architecture. If the site ever grows a real application surface, revisit this.

---

## Launching a personality

Each launcher in `bin/` is a thin wrapper around `claude --system-prompt-file .claude/personalities/<ROLE>.md`. Run them from the repository root.

```bash
bin/tech-lead "PAGE-004 page-contact"          # plan gate kept, founder in the loop
bin/reviewer "PAGE-004 (PR #17)"               # attended review round
bin/autonomous_reviewer "PAGE-004 (PR #17)"    # unattended background round
```

Inside an existing session, the equivalent slash commands are `/tech-lead <ID> [slug]` and `/review <ID>`.

The two reviewer launchers share `.claude/reviewer-append.txt`, which carries the stable review procedure. That is why the call itself only passes `<ID> (PR #<num>)`: the procedure is not retyped per prompt, so it cannot silently drift between rounds.

**`bin/autonomous_reviewer` differs from `bin/reviewer` on three points only**: it drops the plan gate (it is pre-authorized to run the review end to end), it runs headless with `-p`, and it takes its permissions from the targeted allowlist in `.claude/autonomous-reviewer-settings.json` rather than from `--dangerously-skip-permissions`. That allowlist grants write access to `docs/reviews/**` and nothing else, which is how "the reviewer is read-only on source" is enforced structurally rather than by good intentions. Autonomy covers the **review**, never a founder decision: it still never merges, never edits a page, and stops on any editorial or commercial call.

## Write delegation

`.claude/agents/file-writer.md` is a Haiku subagent that only persists text. Both personalities delegate their bulky documentation writes to it, once the content is final, so the Opus session keeps its capacity for reading and reasoning.

It **never drafts**. If you find yourself asking it to compose something, that is a misuse: compose in-session, delegate the write.

Source files (`.astro`, `.ts`, `.css`) are written directly, not delegated.

---

## End-to-end flow for one work item

```
1  Founder states the need                                    (human)
2  TECH_LEAD orients: CLAUDE.md, DECISIONS.md, docs/vitrine/,
   routes.ts, dictionaries, tokens                            (Claude - fresh session)
3  TECH_LEAD presents a unified plan                          (Claude)
4  Founder approves the plan                          [PLAN GATE - human]
5  TECH_LEAD writes the work item doc + D-rows               (Claude)
6  TECH_LEAD implements, in a dedicated worktree              (Claude)
7  TECH_LEAD presents the done gate                   [DONE GATE - human]
8  Founder approves, PR is opened via /commit-push-pr         (human + Claude)
9  REVIEWER reviews, round R1                                 (Claude - fresh session)
10 Fix, push, then R2, then R3 if needed                       (Claude)
11 Founder merges                                             (human)
12 Founder updates CLAUDE.md if anything durable changed      (human)
```

Steps 4, 7 and 11 are **human gates**. They cannot be automated, inferred or self-granted. A question that times out with an invitation to proceed is **not** an approval; the session waits.

Ship **one work item at a time**. Never batch.

---

## Follow-up items born from a review

A round that returns CHANGES REQUESTED usually spawns one or more follow-up items. Two rules apply to them, and both exist because both were broken once.

**Quote the scope from the review, never summarise it.** When a follow-up item's scope comes from a review, the plan must carry the reviewer's own defining sentence **verbatim**, not a paraphrase. A paraphrase silently converts the author's preference into an apparent requirement, and the founder then has to argue with a document instead of with the author. This happened on `FORM-001` round 1: the review named a single follow-up item and scoped it to "the blocker and the important findings", while the plan presented a two-item split as what the review demanded, quietly deferring three `IMPORTANT` findings to the second item. **The plan gate cannot catch a mislabelled premise**, which is why this rule is mechanical rather than a matter of care.

**Classify by the severity the reviewer assigned, never by how cheap the fix looks.** A one-line correction to a comment that states something false is a defect the reviewer graded, not housekeeping. Grouping findings by effort and then naming the group after its most trivial member is how an `IMPORTANT` finding ends up inside a `CHR` item. Severity comes from the review; effort belongs in the plan's sequencing and nowhere else.

---

## Work item nomenclature

The pipeline formally models a change of any kind. Decide the type first.

First question: **does a visitor see a difference?**

```
"does a visitor see a difference?"
|- YES ........................................ STORY  <PFX>-NNN
|- NO, but something was broken ............... FIX    <PFX>-FIX-NNN   (incl. a doc that LIES)
|- NO, and nothing was broken
     |- "is code or configuration touched?"
          |- YES ............................... REF    <PFX>-REF-NNN
          |- NO ................................ CHR    <PFX>-CHR-NNN
```

A document that asserts something false is a **FIX**, not a chore: the defect is the false claim, not the file extension. Posing a new convention that simply did not exist yet is a **CHR**: nothing was broken.

### Prefixes (LOCKED)

| Prefix | Scope |
|---|---|
| `SITE` | Cross-cutting: build, tooling, repository-wide conventions, dependencies |
| `PAGE` | Pages, routing, navigation structure |
| `UI` | Components, tokens, styles, visual layer |
| `I18N` | Dictionaries, bilingual routing, FR and EN parity |
| `SEO` | Titles, meta, Open Graph, hreflang, sitemap, JSON-LD, robots |
| `FORM` | Contact form, Pages Function, D1, Turnstile, email notification |
| `OPS` | Cloudflare Pages, DNS, deployment, domain switch |

### Table

| Type | ID | Branch | Tracking doc | Review |
|---|---|---|---|---|
| Story | `<PFX>-NNN` | `feat/<slug>` | `docs/work-items/<PFX>-NNN.md` | `docs/reviews/<PFX>-NNN-review.md` |
| Fix | `<PFX>-FIX-NNN` | `fix/<slug>` | `docs/work-items/<PFX>-FIX-NNN.md` | `docs/reviews/<PFX>-FIX-NNN-review.md` |
| Refactor | `<PFX>-REF-NNN` | `refactor/<slug>` | `docs/work-items/<PFX>-REF-NNN.md` | `docs/reviews/<PFX>-REF-NNN-review.md` |
| Chore | `<PFX>-CHR-NNN` | `chore/<slug>` | `docs/work-items/<PFX>-CHR-NNN.md` | `docs/reviews/<PFX>-CHR-NNN-review.md` |

- **Separate counter per (prefix, type)**, each starting at `001`, three digits. `PAGE-004` and `PAGE-REF-001` do not collide.
- Re-grep before reserving an ID, **on every open branch, not only the current one**. IDs collide the same way D-numbers do.
- `grep -rhoE "PAGE-(FIX-|REF-|CHR-)?[0-9]{3}" docs | sort -u | tail -1`

### When does an item need an ID and a doc?

- `FIX` and `REF` always bear an ID.
- `CHR` bears an ID only when it must be **tracked**: either it is deferred, or it carries a D-row because it poses a durable convention. Otherwise a slug-only branch is normal and sufficient.
- The **tracking doc is required for a deferred item** (it is what a future session picks up) and **optional for an item executed immediately** (branch plus D-row plus review suffice).

---

## Decision log

Every structural decision, editorial call, design choice or scope decision goes into `docs/DECISIONS.md` as a **D-row** before the session closes, citing the work item ID.

Format:

```markdown
| D | Date | Item | Decision | Rationale | Rejected alternatives |
|---|---|---|---|---|---|
| D001 | 2026-07-30 | PAGE-001 | FR at the root, EN prefixed under /en/ with translated slugs | ... | ... |
```

Grep for the highest D-number before assigning new ones, across every open branch. An unrecorded decision is future drift.

**A D-number can be born after your survey.** Grepping every open branch at plan time is necessary and not sufficient: a review round routinely adds D-rows to a branch that is already open, so a number that was free when the plan was written can be taken by the time the work is committed. **Re-check immediately before committing.** `FORM-FIX-001` reserved D102 to D106 against a survey that showed `UI-FIX-003` holding D101 alone; that item's own review round then added D102, and the collision surfaced as a merge conflict.

A superseded clause in an existing D-row is **not** a defect. A D-row is a dated journal entry: it is annotated, never rewritten.

---

## Branch and worktree discipline

- **`refonte-multipages` is the integration branch and receives no direct commits.** Every work item lives in its own branch or worktree and lands through a PR targeting `refonte-multipages`.
- **Never work in the main checkout.** Every work item gets its own worktree: `git worktree add -b <type>/<slug> .claude/worktrees/<slug> refonte-multipages`
- **Never commit on `main`, and never target `main` in a PR.**
- **`main` still serves the legacy one-page site through GitHub Pages**, and the rebuild deletes `CNAME`. `refonte-multipages` is merged into `main` only once the rebuild is complete and validated on the Cloudflare preview URL. That merge is a founder decision, made once, deliberately.
- **A review round gets its own disposable branch, `review-<id-lowercase>`, forked from the work item's branch.** The reviewer's worktree checks out this branch rather than the item's own, which would otherwise silently detach whenever the author's worktree still holds it. The review commit is pushed onto the item's branch by explicit refspec (`git push origin HEAD:<branch>`), then the `review-<id-lowercase>` branch and its worktree are torn down before the round ends. See `docs/work-items/SITE-FIX-002.md` and D054.
- **Always invoke `bin/reviewer` and `bin/autonomous_reviewer` via the copy that lives in the work item's own worktree** (`.claude/worktrees/<slug>/bin/reviewer "<ID> (PR #<num>)"`), never via the main checkout. Both scripts `cd` to their own containing directory before reading `.claude/personalities/REVIEWER.md` and `.claude/reviewer-append.txt`, so invoking the main checkout's copy seeds the round with whatever those files say there - which drifts the moment nobody pulls it, and is wrong by construction for an item that edits the review tooling itself. See D056 to D058.
- **Both launchers refuse to start when the three files that seed a round are behind `origin/refonte-multipages`** (`.claude/personalities/REVIEWER.md`, `.claude/reviewer-append.txt`, `.claude/commands/review.md`), since that tree is where they read the reviewer's instructions. The convention above says which copy to invoke; this guard, in `bin/lib/fraicheur.sh`, checks that the copy is actually current. It was added after a round was seeded with instructions that D033 and D037 had already annulled, without the round having any way to notice. The check is deliberately narrow: an item branch is behind the integration branch by construction, and counting every commit blocked every open PR. The `/review <ID>` path inside an existing session is not covered, since no shell runs there. Merge the integration branch into the item branch, then relaunch; do not work around it. See D078.

---

## Critical rules

1. **Plan before execute.** No file written, no command run that changes state, before the founder has explicitly approved the plan. A timeout is not an approval.
2. **Fresh session for the REVIEWER, always.** The author never reviews their own work.
3. **FR and EN parity is complete.** All 11 pages exist in both languages. `Dictionary` is derived from `fr.ts` so a missing English key fails the build; never weaken that derivation to unblock yourself.
4. **English is a readaptation, not a translation.** Audiences: anglophone Africa, international investors, donors and NGOs. OHADA and CIMA spelled out, emphasis on offline-first and multi-country rather than on CNPS and ITS.
5. **`routes.ts` is the single source of truth for routing.** Slugs are translated, so no URL can be derived from the other language. Never hardcode a cross-language URL.
6. **Palette is strict: navy and gold only.** Amber and teal are gone; they belonged to a product split that no longer exists. Violet belongs to altarys.ai, which is not launched. Do not reintroduce any of them, whatever an older document under `docs/vitrine/` says: `CLAUDE.md` wins.
7. **Never invent.** No client name without approval, no figure, no testimonial, no exact date, no price. Every factual claim traces to a document under `docs/vitrine/` or to a recorded founder decision.
8. **Products before Services in the navigation**, a deliberate positioning choice. The visitor is an executive evaluating a supplier, not a SaaS early adopter.
9. **Three products only**: Papillon Collection Solution, Papillon HR Suite, Papillon Corporate Finance. ALTARYS ENTERPRISE no longer exists.
10. **Never merge into `main` before the DNS cutover.**
11. **One work item at a time.** No umbrella branches.
12. **Code comments and commit messages in French**, specs and documentation in English.

---

## Typography rule (machine-wide)

The em-dash and the middle dot are never used in generated text, file content, commit messages or comments. Use `-`, `.`, `;` or `|` instead.

---

*Document version 1.0 - initial workflow for the showcase site.*
