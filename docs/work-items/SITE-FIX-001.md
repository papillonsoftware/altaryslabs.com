# SITE-FIX-001 - Reviewer tooling

**Type** FIX | **Branch** `fix/outillage-reviewer` | **Base** `refonte-multipages` at `480d4d4`

**Decisions** D033 to D035 in `docs/DECISIONS.md`.

## Why a FIX and not a chore

`REVIEWER.md` made a `code-review` skill mandatory before the checklist. That
skill is not installed in this repository and cannot be invoked from an
unattended session. A document that mandates an impossible step is a defect: the
reviewer either stops on it or quietly skips it, and a skipped mandatory step
invalidates the verdict it leads to. The R1 round on PAGE-001 reported exactly
that.

## What ships

1. **`bin/review_shots`**, a Node script driving one Chrome instance over the
   DevTools protocol for every capture of a round.
2. **`.claude/reviewer-append.txt`**: the visual-check step now calls that
   script, and points at the ROOT prototypes rather than the frozen folder.
3. **`REVIEWER.md`**: the `code-review` mandate is replaced by the sweep spelled
   out inline, with the same intent and five concrete things to look for.
4. **`.claude/autonomous-reviewer-settings.json`**: the dead
   `Write(docs/reviews/**)` entry is removed. `Edit(docs/reviews/**)` was
   already present and is what actually grants the write.

## Why the captures were the real cost

Two things, both measured on a live round:

- Chrome was relaunched for every capture. Six captures meant six cold starts.
- `--window-size` on headless Chrome is floored at 500px. A capture requested at
  360px rendered at 500px and cropped, which looks exactly like a horizontal
  overflow bug. During PAGE-001 this produced a false alarm on a page that had
  no overflow at all, and it was only ruled out by reproducing it on an
  already-delivered page. `Emulation.setDeviceMetricsOverride` has no such
  floor.

The script also forces `prefers-reduced-motion: reduce`, without which every
scroll-reveal block stays invisible in a full-page capture.

## What was dropped, and why

The item was approved with a fourth change: reuse the author's `node_modules`
instead of running `npm ci`, on the assumption that install was a major cost of
a review round. **Measured, the assumption is false.**

| | Run 1 | Run 2 |
|---|---|---|
| `npm ci` | 3.7s | 3.7s |
| `cp -R node_modules` | 6.3s | 6.4s |

npm hardlinks from its local cache, 14 GB and warm on this machine, while `cp`
moves 228 MB of real bytes. The "optimisation" is 1.7 times slower, and it would
have cost the only check that the lockfile is coherent and that the site builds
from nothing, which is precisely what Cloudflare Pages does on every deploy.

`bin/prepare_review_deps` was written, measured, and deleted. The rejection is
recorded as D035 so the idea is not proposed again on intuition.

## Acceptance criteria

1. `bin/review_shots` produces one PNG per page and width, at real viewports,
   from a single Chrome instance, and exits 0.
2. Its output directory contains captures and nothing else.
3. `REVIEWER.md` no longer references an uninstalled skill.
4. No change to the review checklist, the verdict format, the Writer / Reviewer
   separation or the number of rounds.

## Verification

`bin/review_shots` was run end to end against a live preview: six captures over
two pages, at 360, 768 and 1440 px, in 14 seconds total including Chrome
startup. Image dimensions confirm real viewports, `360 x 3076` for the narrow
capture rather than a cropped 500. A first run exited non-zero because Chrome
was still writing its profile when the cleanup ran; the script now waits for the
process to exit and never fails on cleanup.

## Out of scope

The content of the review checklist, the verdict format, the Writer / Reviewer
separation, the number of rounds.
