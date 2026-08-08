# SITE-FIX-009 - `bin/review_shots` reports failed captures as successes

**Type** FIX | **Status** OPEN, not started | **Branch to create** `fix/review-shots-errortext`
**Base** `refonte-multipages`

**Decision** D120 in `docs/DECISIONS.md`. Raised as a blocker by round 2 of
`docs/reviews/I18N-001-review.md`, reproduced live during that round.

This item cited D075 until `I18N-FIX-002`. D075 is the residual-string sweep: it
names `SEO-FIX-001` and `SITE-FIX-007` as its two follow-ups and mentions neither
`bin/review_shots` nor `errorText`. A reader following that citation landed on a
decision unrelated to the tooling change it authorised. D120 is the clean row.

## The defect

`bin/review_shots:124` fires the navigation and throws the answer away:

```js
await send('Page.navigate', { url: `${baseUrl}${path}` });
await sleep(1800);
```

`Page.navigate` returns `{ frameId, loaderId, errorText }`. When the page cannot
be reached, `errorText` carries the reason (`net::ERR_CONNECTION_REFUSED` and the
like) and the script never looks. It then screenshots whatever Chrome is showing,
which is the browser's own error page, writes it as a PNG and counts it as a
capture.

**Observed, not theorised.** During round 2 of the `I18N-001` review the preview
server had died. The tool produced fifteen images of `ERR_CONNECTION_REFUSED` and
printed `15 captures`.

## Why it is a blocker and not a nuisance

`review_shots` is the instrument that certifies visual fidelity and responsive
behaviour, two mandatory sections of `REVIEWER.md`. A silent false green there
means **a review round can declare the site visually verified when no page ever
rendered**. An attended reviewer might notice the images; an unattended one, run
through `bin/autonomous_reviewer`, has nobody to look.

This is the same failure mode D048, D055 and D060 fought on `bin/contrast_sweep`,
which received in D060 exactly the guard this script still lacks. One tool was
fixed and its sibling was not.

## Scope

`bin/review_shots`. No source file, no page, no dictionary.

## Fix

Two guards, both cheap:

1. **Check `errorText`.** Capture the result of `Page.navigate` and abort loudly
   on a non-empty `errorText`, naming the URL and the reason. Exit non-zero so a
   caller in a script notices.
2. **Assert the page is the site.** `contrast_sweep` asserts at least one
   `.section` before accepting a page as measured (D060). Do the same here with a
   `Runtime.evaluate`, so a 200 response serving something unexpected cannot pass
   either.

Do not settle for checking that the PNG is non-empty. An error page is a
perfectly valid non-empty PNG, which is the whole problem.

## Acceptance criteria

1. With the preview server stopped, `bin/review_shots` fails loudly, names the
   unreachable URL and exits non-zero. Verify by actually stopping the server,
   not by reasoning about the code.
2. With the server running, behaviour is unchanged and the three widths still
   come out at 360, 768 and 1440.
3. The 360px capture is still a real 360px viewport. `Emulation.setDeviceMetricsOverride`
   stays; Chrome's window floor is 500px and a plain resize silently renders at
   500 (D034).
4. No source file, page or dictionary is touched.

## While you are in there

`bin/contrast_sweep` received its guards in D060 and `review_shots` did not, which
suggests nobody swept the sibling at the time. Check whether any other script
under `bin/` drives the DevTools protocol without checking `errorText`, and say so
in the pull request even if the answer is none.
