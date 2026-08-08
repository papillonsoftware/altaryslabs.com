# PAGE-003 - PCS covers credit instalment collection, and only the navigation says so

**Type** STORY | **Status** OPEN, not started | **Branch to create** `feat/pcs-recouvrement-elargi`
**Base** `refonte-multipages`

**Decision** D123 in `docs/DECISIONS.md`. Born from round 1 of
`docs/reviews/I18N-FIX-001-review.md`, finding 6, once the founder widened the
product's scope in the same exchange.

## The reviewer's defining sentence

Quoted verbatim per D108, from `docs/reviews/I18N-FIX-001-review.md`. **No line
range**: the quotation is verbatim and therefore greppable, while a range goes
stale the moment a line is inserted above it. The range this document carried
until round 3 was wrong at both ends, copied from the review file without being
measured.

> `pageTagline.productsPcs` passe de
> `Insurance premium collection across Central and West Africa` a
> `Premium collection in the CIMA zone`. Le remplacement de la geographie par la
> zone est juste, la perte du mot `Insurance` ne l'est pas. En anglais,
> `Premium collection` se lit d'abord comme la collecte d'un supplement ou d'une
> gamme superieure, pas comme l'encaissement de primes d'assurance ; les deux
> taglines voisines nomment toujours leur domaine (`HR and payroll`,
> `Budgeting`), et `Papillon Collection Solution` ne le dit pas non plus, si bien
> que l'assurance disparait de la navigation anglaise.

The founder answered it by widening the product rather than by restoring the
word: PCS collects credit instalments as well as insurance premiums. **The
reviewer's underlying point survives that answer** and is what this item carries.
The navigation must name the domain, and every surface must name the same one.

## The gap

The founder stated during `I18N-FIX-002` that Papillon Collection Solution now
collects **both insurance premiums and credit instalments, for microfinance
institutions and lending organisations**, not insurance alone.

He chose to say so immediately in the English navigation. `I18N-FIX-002`
therefore shipped:

| Key | Value |
|---|---|
| `pageTagline.productsPcs` | `Premium and instalment collection in the CIMA zone` |

**Nothing else moved.** Every other surface still describes an insurance-only
product:

- `CLAUDE.md`, Product Lines: "contract renewal and premium follow-up for
  CIMA-zone insurers and brokers"
- the PCS product page, both languages
- the PCS card on the products hub, both languages
- `meta.productsPcs.description`, both languages
- `cards.products.productsPcs.text`, both languages
- the home page product block

The English dropdown consequently announces a business the page it points to
does not describe. That is deliberate and recorded, not an oversight: see D123.
**This item closes it.**

## Why it is a STORY and not a FIX

It is not a defect being repaired. It is a positioning change that has to be
carried consistently across two languages and every surface naming the product,
and every new sentence needs the founder's approval before it ships. That is
editorial work with a review round, not a correction.

## What needs a founder ruling before any string is written

1. **How the two businesses are named together**, in French and in English.
   `Recouvrement` covers both in French; English needs a decision between
   `collections`, which D122 already chose for `home.ogSubtitle`, and a longer
   form naming premiums and instalments separately as the tagline does.
2. **Whether the CIMA zone is still the right frame.** CIMA is the insurance
   regulator. Microfinance and lending institutions are not CIMA entities, so a
   product page framed entirely on CIMA may now under-describe the market. This
   is the strategic question underneath the copy and it is the founder's alone.
3. **Whether the audience sentence changes**, which today reads "insurers and
   brokers" everywhere.

Do not derive any of the three. Ask.

## Scope

- `CLAUDE.md`, the Product Lines section
- `src/i18n/fr.ts` and `src/i18n/en.ts`: every value naming PCS
- the PCS page components, the products hub card, the home product block
- `meta.productsPcs.*` in both languages

## Out of scope

- `pageTagline.productsPcs` **in `en.ts` only**, already shipped by
  `I18N-FIX-002`. Verify it agrees with whatever this item settles; do not
  rewrite it without a reason.

  **The French twin is IN scope and must not be read as covered by that line.**
  `fr.ts:60` still says `Recouvrement de primes en zone CIMA` and `fr.ts:414`
  repeats it in `meta.productsPcs.title`. The same dropdown therefore describes
  a different product scope in each language, on 13 pages a side, and French is
  the primary market's language. D123 records that the **English** navigation
  runs ahead of the PCS page; it says nothing about French, which is simply
  behind. Widening it needs the founder's own words, like the English one did.
- The external link to papillon-collection.com and the teaser format. PCS stays
  a teaser page with one external link.
- `availability.pcs`, the single availability constant. Untouched.

## Acceptance criteria

1. No surface describes PCS as insurance-only once the founder has ruled on the
   three questions above.
2. The English navigation no longer promises more than the page it points to.
3. `CLAUDE.md` and the dictionaries agree on what the product does.
4. `npm run build` and `npm run check` green, FR and EN parity holds.
5. No price, no client name, no exact date, no invented figure.
