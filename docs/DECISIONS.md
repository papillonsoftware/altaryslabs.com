# Decision log - altaryslabs.com

Every structural decision, editorial call, design choice or scope decision is recorded here as a D-row before the session that made it closes, citing the work item it came from.

**Before assigning a new D-number**, grep for the highest one across **every open branch**, not only the current one. D-numbers collide the same way work-item IDs do:

```
grep -rhoE "^\| D[0-9]{3}" docs/DECISIONS.md | sort -u | tail -1
git branch -a --format='%(refname:short)' | while read b; do git show "$b:docs/DECISIONS.md" 2>/dev/null; done | grep -oE "^\| D[0-9]{3}" | sort -u | tail -1
```

**A D-row is a dated journal entry.** It is annotated when it is superseded, never rewritten. A clause made obsolete by a later decision is not a defect; it is the record doing its job. Add a new row that supersedes it and say so in the Rationale column.

Nomenclature, work item types and prefixes: see `docs/AI_Development_Workflow.md`.

---

| D | Date | Item | Decision | Rationale | Rejected alternatives |
|---|---|---|---|---|---|
| D001 | 2026-07-30 | (pre-dates the nomenclature) | Adopt an explicit AI-assisted development workflow, documented in `docs/AI_Development_Workflow.md` | Work was being done without a written contract on gates, branches or review. The failure modes on a marketing site are silent credibility defects, which need a checklist to be caught at all. | Keep working ad hoc; adopt the full seven-personality pipeline from renew-insurance |
| D002 | 2026-07-30 | (pre-dates the nomenclature) | Two personalities only: TECH_LEAD and REVIEWER | No legal exposure in a marketing page, no data model, no cross-module architecture. Seven personalities would be ceremony without return. Revisit if the site grows a real application surface. | The seven-personality pipeline; a single all-in-one personality with no independent review |
| D003 | 2026-07-30 | (pre-dates the nomenclature) | Writer / Reviewer separation is non-negotiable: the REVIEWER is always a separate, fresh session | An author reviewing their own work is biased toward the choices they just made. This is the single rule that buys the most defect detection. | Self-review with a checklist; review by the same session after a context reset |
| D004 | 2026-07-30 | (pre-dates the nomenclature) | Work item nomenclature STORY / FIX / REF / CHR, with the site-specific prefixes SITE, PAGE, UI, I18N, SEO, FORM, OPS | Defects, internal-quality changes and repo hygiene are recurring work; without their own IDs they end up mislabelled as stories or untracked entirely. | Story-only tracking; free-form branch slugs with no IDs |
| D005 | 2026-07-30 | (pre-dates the nomenclature) | Maximal bar on latent defects: the REVIEWER blocks on any verified defect regardless of whether the PR introduced it | Deferring a real defect silently is how it gets forgotten. Only the founder may consciously accept one as tracked debt. | Bounded bar, where only defects introduced by the PR block |
| D006 | 2026-07-31 | `SITE-CHR-001` | Adopt CLI launchers `bin/tech-lead`, `bin/reviewer`, `bin/autonomous_reviewer` plus the `/tech-lead` and `/review` slash commands | A personality that has to be pasted by hand drifts between sessions. A launcher makes the seeding reproducible. | Pasting the personality per session; a single generic launcher taking a role argument |
| D007 | 2026-07-31 | `SITE-CHR-001` | The stable review procedure lives in `.claude/reviewer-append.txt`, shared by both reviewer launchers and injected with `--append-system-prompt` | Keeps the invocation down to `<ID> (PR #<num>)`. The procedure cannot silently differ between an attended and an unattended round, which is exactly where drift would hide. | Restating the procedure in each prompt; duplicating it in both scripts |
| D008 | 2026-07-31 | `SITE-CHR-001` | The autonomous reviewer is authorized by a targeted allowlist in `.claude/autonomous-reviewer-settings.json`, never by `--dangerously-skip-permissions` | The allowlist grants writes to `docs/reviews/**` and nothing else. "The reviewer is read-only on source" becomes a structural guarantee rather than an instruction it could talk itself out of. | `--dangerously-skip-permissions`; attended review only |
| D009 | 2026-07-31 | `SITE-CHR-001` | Documentation writes are delegated to the `file-writer` Haiku subagent once the content is final; source files are written directly | Persisting a long document does not need Opus. Drafting does. The split keeps reasoning capacity where it matters. | Writing everything with Opus; delegating drafting as well as persistence |
| D010 | 2026-07-31 | `SITE-CHR-001` | The decision log lives at `docs/DECISIONS.md` in a single flat table | The project is small enough that one table stays readable. A per-module ledger would be premature structure. | One log per area; no log at all, relying on commit messages |
