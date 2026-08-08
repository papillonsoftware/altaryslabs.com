---
description: Run a full Lead Engineer session (Architect + PO + Developer + Designer) for one work item
argument-hint: <work-item-id> [short-slug]
model: opus
---

## Work item ID shape

`$1` is the work-item ID, per `docs/AI_Development_Workflow.md`. Parse it as `<PFX>[-FIX|-REF|-CHR]-<NNN>`.

| Prefix | Scope |
|---|---|
| `SITE` | Cross-cutting: build, tooling, repository-wide conventions, dependencies |
| `PAGE` | Pages, routing, navigation structure |
| `UI` | Components, tokens, styles, visual layer |
| `I18N` | Dictionaries, bilingual routing, FR and EN parity |
| `SEO` | Titles, meta, Open Graph, hreflang, sitemap, JSON-LD, robots |
| `FORM` | Contact form, Pages Function, D1, Turnstile, email notification |
| `OPS` | Cloudflare Pages, DNS, deployment, domain switch |

If the prefix is not in this table, STOP and flag: a new prefix is added to `docs/AI_Development_Workflow.md` first.

The infix drives the branch prefix and the tracking doc:

| ID shape | Type | Branch | Tracking doc |
|---|---|---|---|
| `<PFX>-NNN` | story | `feat/<slug>` | `docs/work-items/<ID>.md` |
| `<PFX>-FIX-NNN` | fix | `fix/<slug>` | `docs/work-items/<ID>.md` |
| `<PFX>-REF-NNN` | refactor | `refactor/<slug>` | `docs/work-items/<ID>.md` |
| `<PFX>-CHR-NNN` | chore | `chore/<slug>` | `docs/work-items/<ID>.md` |

`$2` is an optional short kebab-case slug for the branch and worktree names. If absent, derive one from the work item's subject.

---

## Worktree setup (MANDATORY - do this FIRST)

`refonte-multipages` is the integration branch and receives no direct commits. Every work item lands through a PR targeting it.

```
git fetch origin
git worktree add .claude/worktrees/<slug> -b <type>/<slug> origin/refonte-multipages
```

If the branch already exists, omit `-b`:

```
git worktree add .claude/worktrees/<slug> <type>/<slug>
```

**All subsequent work MUST happen inside the worktree. Use absolute paths.** Never work in the main checkout, never commit on `main`.

---

## Role

Assume the TECH_LEAD personality. Read `.claude/personalities/TECH_LEAD.md` in full before proceeding. It defines the five phases (Orient, Unified Plan, Artifacts, Implementation, Done gate, Review loop), the BOOTSTRAP versus SPRINT distinction, every guardrail, and the mandatory plan gate.

Read `CLAUDE.md` too. When any older document under `docs/vitrine/` contradicts it, `CLAUDE.md` wins.

---

## Session parameters

- **Work item**: `$1`
- **Slug**: `$2` if provided, otherwise derived
- **Mode**: BOOTSTRAP for a new page, a new route family, a new layout or a Pages Function. SPRINT for a bounded change on an existing surface.

Confirm these with the founder at the start of Phase 0 if any is ambiguous.

---

## Mandatory gates

- After **Phase 1 (Unified Plan)**: STOP and present the full plan. Write no file and no line of code before explicit founder approval. A question that times out is **not** an approval; keep waiting.
- After **Phase 3 (Implementation)**: STOP and present the Definition of Done checklist plus the changed files list. Do not commit without explicit approval.
- The **merge** is always the founder's. Never self-merge, never target `main`.

---

## Done

When the founder approves the Done gate, invoke `/commit-push-pr` to commit, push and open the PR against `refonte-multipages`. Commit messages are written in French per the repository language rule.

Then run Phase 5 of the personality: launch an independent reviewer with `bin/reviewer "<ID> (PR #<num>)"`, or `bin/autonomous_reviewer "<ID> (PR #<num>)"` in the background. You never review your own work.
