# SITE-FIX-014 - `bin/docs_check`, mechanical verification of the repository's prose

**Type** FIX | **Status** IMPLEMENTED, pending review | **Branch** `fix/docs-check`
**Base** `refonte-multipages`
**Decisions** D129, D130, D131 and D132 in `docs/DECISIONS.md`

## The defect

Over three weeks, pull requests on this repository routinely took more than
three review rounds. The founder merged early to cope, which cost one pull
request merged with two live blockers on 8 August 2026. He measured the cause,
and it is neither the model's effort nor its care.

| Measured by the founder on the integration branch | |
|---|---|
| `docs/` | 13 322 lines, 66 files |
| `src/` | 6 097 lines, 61 files |
| review files alone | 4 662 lines, 35 per cent of `docs/` |
| D-rows | 114 on the integration branch, 126 counting branches, as measured on 8 August 2026 |

Distribution of BLOCKER and IMPORTANT findings over the four last reviews:

| Where the finding lives | Count |
|---|---|
| prose | 58 |
| source, tooling, configuration | 33 |

The prose is 2.2 times the size of the site and produces twice the blockers.
Most of that class is **accounting**: a cited D-number that does not exist, an
item status contradicting the backlog, a stale pull request number. Nothing in
the repository verified any of it, so it all reached review, where each finding
cost a round.

The repository has met this shape twice and solved it twice the same way,
by replacing a human enumeration with a command. D048 built `bin/contrast_sweep`
and stated the principle: enumerating by hand does not converge. D101 built
`bin/og_images` under the rule that nothing which can drift is written in the
script. The gesture had never been applied to prose. This item applies it.

## What was delivered

`bin/docs_check`, a Node script on the model of the existing tooling: shebang
`#!/usr/bin/env node`, imports limited to `node:*`, no new dependency, no change
to `package.json`.

```
bin/docs_check                 readable report, exit 1 if any gap remains
bin/docs_check --check         silent, exit code only, for use before a push
bin/docs_check --root <dir>    scan a tree other than the repository root
```

Seven checks, each with a real finding behind it:

| Check | What it catches |
|---|---|
| `D-UNDEF` | a reference to a D-number defined nowhere |
| `D-DUP` | the same D-number defined twice |
| `ITEM-NOFILE` | a reference to an item with no file under `docs/work-items/` |
| `STATUS` | a fiche status contradicting `docs/BACKLOG.md`, or the backlog contradicting itself |
| `PR-STATE` | a pull request described as open which `gh` reports merged or closed |
| `D108-QUOTE` | a follow-up item born from a review with no verbatim quote, which D108 requires |
| `MD-BROKEN` | an unclosed backtick or an unclosed bold |

`gh` is used by `PR-STATE` only. Absent or unauthenticated, that check disables
itself with a warning on stderr and the other six decide the exit code alone.

## Validation

D048 imposed the method: a tool proves nothing by passing on the current
state, it has to be replayed against a past state where the defects lived. The
`--root` flag exists for that, since the script does not exist on those commits.

**Bench 1, commit `1818413`**, the state round 1 of the `I18N-FIX-002` review
was run against. Of that round's 8 findings, the tool returns **6**:

| Finding | Returned as |
|---|---|
| backlog row calling merged pull request 31 open | `docs/BACKLOG.md:43` |
| backlog contradicting itself on `SEO-FIX-001` | `docs/BACKLOG.md:81` |
| fiche calling merged pull request 31 open | `I18N-FIX-002.md:36` |
| fiche status against the backlog | `SEO-FIX-001.md:3` |
| follow-up item with no verbatim quote | `PAGE-003.md:7` |
| unclosed backtick | `I18N-FIX-002.md:23` |

The paths in that table are written without their `docs/work-items/` prefix on
purpose: at the delivery commit, `PAGE-003` has no file on this branch, and a
full path would be a reference to something absent. `docs_check` caught that in
this very fiche.

The last one lands on the exact line the reviewer cited.

**Bench 2, commit `2678c6f`**, which carries the round 2 finding on a version
count. The tool does **not** return it, as announced before the code was
written. The same run shows **five of the six** findings above gone where the
author fixed them, which validates the tool in the reverse direction: a repaired
document stops being reported.

The sixth survives, and naming it matters more than rounding it up. The fiche
still calls pull request 31 open, and the tool still returns it, at
`I18N-FIX-002.md:43`. That is gap 2 of `SITE-FIX-016`, so the survivor is not a
weakness of the bench but the same live defect seen from another commit. Round 1
of this item's review measured it; the first version of this fiche claimed six
and was wrong.

`D-UNDEF` never fired on the real corpus, so it was proven on a synthetic tree
instead: it catches the recognised reference forms and ignores the defined
number, the range, the reservation line and the bare mention. Unlike the two
benches, which anyone can replay from a commit hash, that proof needs its
fixture rebuilt, so here is the recipe:

```
T=$(mktemp -d); mkdir -p "$T/docs/work-items"; cp docs/DECISIONS.md "$T/docs/"
printf '**Decisions** D404, D405 and D406 here.\n\nSee D048.\n\nRenumbered from D115 to D119, reserved elsewhere.\n\nD995 bare.\n' \
  > "$T/docs/work-items/SITE-FIX-999.md"
bin/docs_check --root "$T"
```

Expect exactly three `D-UNDEF` lines, `D404`, `D405` and `D406`: `D048` is
defined, the range and the reservation line are narrative, and `D995` carries no
reference form.

Two `ITEM-NOFILE` lines on `docs/DECISIONS.md` come with them, and they are an
artefact of the fixture rather than a result: the copied decision log references
items whose files the temporary tree does not have. `PR-STATE` also reports
itself disabled, the fixture not being a git repository. Both are the tool
saying what it did instead of hiding it, which is the behaviour round 1 of the
review required.

## Delivery state

Run on the integration branch at delivery, the tool returns **7 gaps, every one
verified by hand as real**. None is fixed here. They are carried by
`SITE-FIX-016`, opened by D134, per the repository rule that an
out-of-scope defect materialises as a work item plus a D-row rather than as a
mention in a pull request body.

## Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | seven checks, Node, no new dependency, file and line per gap, non-zero exit, silent `--check` | met |
| 2 | replayed against `1818413`, reports the historical gaps, and the pull request names what it cannot reach | met |
| 3 | run on the integration branch, exits zero or every remaining gap is named with its reason | met, 7 named |
| 4 | `npm run build` and `npm run check` green, `gh` degrades to a warning | met |

## Out of scope

`.claude/personalities/REVIEWER.md`, `.claude/personalities/TECH_LEAD.md`,
`CLAUDE.md` and `.claude/commands/review.md`. The three rule changes belong to a
`SITE-FIX-015` the founder reserved. An item that edits the review rules while a
review is running bites its own tail.

Also out of scope: any wiring into a launcher, a hook or continuous integration;
any change to `package.json`; any repair of the semantic defect classes the tool
cannot reach, which D132 records.
