# UI-FIX-004 - French fragments render in `lang="en"` legal pages without an inline `lang`

**Type** FIX | **Status** OPEN, not started | **Branch to create** `fix/lang-fragments-legaux`
**Base** `refonte-multipages`

Raised as a **suggestion**, not a blocker, by round 1 of
`docs/reviews/I18N-FIX-001-review.md`. Deferred there with a reason; this item
carries it.

## The reviewer's defining sentence

> `dist/en/legal-notice`, `dist/en/privacy` - Les fragments francais
> `Société par Actions Simplifiée Unipersonnelle` et
> `Derrière la pharmacie Rédemption` sont rendus dans une page `lang="en"` sans
> `lang="fr"` inline. WCAG 3.1.2 exempte les noms propres et les termes
> techniques, et une forme juridique ivoirienne comme une adresse tombent
> plausiblement sous l'exemption ; c'est pour cela que ce n'est pas un blocage.

## Why it was not fixed in `I18N-FIX-002`

Three reasons, all practical.

It is a **markup** change, not a dictionary change, on pages whose text D032
locks. `I18N-FIX-002` touched no component and no page; adding inline `lang`
attributes to the legal pages would have widened it into surfaces the item
declared out of scope.

The **exemption is arguable both ways**. WCAG 3.1.2 exempts proper names and
technical terms. An Ivorian legal form and a street address plausibly qualify,
which is exactly why the reviewer filed it as a suggestion. Ruling on it is a
judgement, not a repair.

And it deserves **its own visual round**: the fix touches four public pages, two
of which are the pages a lawyer is still due to review under D022.

## What needs deciding

**Whether the exemption applies here**, once, for all such fragments. Then apply
that ruling uniformly rather than page by page. A screen reader switching voice
mid-address is worse than not switching at all if the rule is applied
inconsistently.

Candidate fragments, to be enumerated by measurement rather than from this list:

- `Société par Actions Simplifiée Unipersonnelle`, the legal form
- `Derrière la pharmacie Rédemption`, part of the address
- the RCCM number's `CI-ABJ` prefix, if it is read as text rather than a code

## Scope

`src/components/LegalPage.astro` and whatever renders the legal notice and the
privacy policy in English, plus the corresponding dictionary values if the fix
needs a markup-bearing key.

## Out of scope

**The legal texts themselves are LOCKED by D032.** This item changes markup, never
a sentence. If the fix appears to require rewording, stop and escalate.

## Acceptance criteria

1. A single ruling on the WCAG 3.1.2 exemption is recorded as a D-row, and applied
   uniformly to every French fragment on an English page.
2. No legal sentence changes in either language.
3. `npm run build` and `npm run check` green.
4. The four legal pages render unchanged at 360, 768 and 1440 px.
