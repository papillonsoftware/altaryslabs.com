# I18N-FIX-001 - Revue

**Continuite.** Ce fil compte des rondes anterieures, ecrites ailleurs. Voir
`docs/reviews/I18N-001-review.md` : `## Round 1` porte sur l'item `I18N-001`
(PR #25), `## Round 2` porte en realite sur `I18N-FIX-001` (PR #29). La ronde 1
ci-dessous est donc chronologiquement la troisieme passe sur cette matiere. Les
rondes suivantes de ce fil sont dans `docs/reviews/I18N-FIX-002-review.md`.

Renvoi ajoute par `I18N-FIX-002`, qui a fait de cette ligne une obligation de
procedure plutot qu'une politesse. Voir D121. Le texte de la ronde 1 n'est pas
modifie : une revue est un enregistrement, elle s'annote et ne se reecrit pas.

## Round 1 - 2026-08-07
**Verdict**: CHANGES REQUESTED

Ronde conduite sur la **PR #31**, branche `fix/chaines-residuelles`, item
`I18N-FIX-001`. Worktree de revue `.claude/worktrees/review-I18N-FIX-001`, non
detache, sur une branche jetable `review-i18n-fix-001` forkee de
`origin/fix/chaines-residuelles`.

**Continuite.** C'est chronologiquement la troisieme passe sur cette matiere. Les
deux precedentes ont ete ecrites dans `docs/reviews/I18N-001-review.md`, en
`## Round 1` (item `I18N-001`, PR #25) et `## Round 2` (item `I18N-FIX-001`,
PR #29). La procedure `.claude/commands/review.md` derive pourtant le nom du
fichier de l'ID de l'item, donc `docs/reviews/I18N-FIX-001-review.md`, qui
n'existait pas. Ce fichier applique la convention ; l'ecart est signale plus bas.

**La branche a bouge pendant la ronde.** Au demarrage, `origin/fix/chaines-residuelles`
pointait sur `aea6d7f`. L'auteur a ensuite pousse `5f4d48e` (fusion de
`refonte-multipages`, qui apporte UI-003 et l'instantane des prototypes). Tout ce
qui suit a ete re-mesure sur `5f4d48e`, le HEAD reel de la PR au moment de la
conclusion, et non sur `aea6d7f`. Les constats ne sont pas perimes : le diff
contre l'integration est reste le meme a une ligne de `BACKLOG.md` pres.

### Ce qui a ete verifie et qui passe

- `npm ci`, `npm run build` (26 pages) et `npm run check` (0 erreur, 0
  avertissement, 0 indice) relances independamment dans le worktree de revue, sur
  `5f4d48e`. Aucun `any`, aucun `@ts-ignore`, aucun affaiblissement de
  `Dictionary`, qui reste derive de `fr.ts`.
- **Parite mesuree et non deduite** : 173 cles a plat de chaque cote, aucune
  manquante, aucune en trop, aucune longueur de tableau divergente. Les seules
  valeurs identiques FR/EN sont des noms propres ou des mots communs aux deux
  langues (`Services`, `Contact`, `Emmanuel Blonvia`, `Papillon HR Suite`,
  `Abidjan, Côte d'Ivoire`).
- `routes.ts` n'est pas touche, aucune URL inter-langue codee en dur. Le
  selecteur de langue atterrit bien sur la contrepartie, verifie dans le HTML
  genere : `/en/products/papillon-hr-suite` renvoie `/produits/papillon-hr-suite`,
  `/en/services/sovereign-ai` renvoie `/services/ia-souveraine`,
  `/en/legal-notice` renvoie `/mentions-legales`.
- `hreflang` reciproques et `canonical` corrects, produits centralement par
  `BaseLayout.astro`. 26 URL au sitemap, 13 par langue. `robots.txt` coherent.
  Aucun lien interne mort sur les 26 pages, verifie par resolution de tous les
  `href` internes contre l'ensemble des pages construites.
- **Rendu reel controle en capture**, FR et EN, a 360, 768 et 1440 px, sur
  l'accueil et le hub Produits, plus le menu deroulant force ouvert aux trois
  largeurs. Palette navy et or conforme, aucun ambre, aucun turquoise, aucun
  violet. Aucun debordement horizontal (`scrollWidth == clientWidth` aux trois
  largeurs). Les trois nouvelles taglines tiennent dans le panneau de 288 px ;
  `Budgeting aligned with the SYSCOHADA standard` passe sur deux lignes a 1440,
  comme deux voisines deja en place, donc sans regression.
- Les taglines sont rendues en `rgb(91, 100, 114)`, soit `--slate-body`, la
  valeur que `CLAUDE.md` impose pour le petit texte attenue sur surface claire.
  Ni `--ink-25`, ni `--ink-40`, ni `#8A93A6`.
- Le rendu FR correspond aux prototypes de l'instantane :
  `index.dc.html` porte bien `Trois suites SaaS pensées pour l'OHADA et le CIMA`
  et `produits.dc.html` `Trois suites SaaS pour l'OHADA et le CIMA`. La PR ne
  touche aucune chaine francaise.
- Garde-fous editoriaux : aucun prix, aucun nom de client, aucune date exacte,
  aucun chiffre de resultat invente. `availability.pcs` reste la constante unique
  (`Disponible T3 2026` / `Available Q3 2026`), consommee par `HomeContent`,
  `ProductsHub` et `ProductPcsContent`. Aucun code technique RH sur une page
  publique. Trois produits seulement ; la seule occurrence de
  `ALTARYS ENTERPRISE` dans `src/` est le commentaire de `tokens.css` qui acte
  son retrait, ce qui est le contraire d'une reapparition.
- Aucun hex code en dur dans un composant : les deux occurrences de
  `global.css` (`#E4CB9C`, `#9AA3B4`) sont a l'interieur de commentaires
  francais qui justifient un choix de contraste, pas dans une declaration.
- Deploiement inchange : sortie statique, `pages_build_output_dir` toujours
  `./dist`, binding D1 toujours neutralise, aucun secret dans le diff. La PR
  cible bien `refonte-multipages`.
- `SITE-FIX-009` decrit un defaut reel : `bin/review_shots:124` fait bien
  `await send('Page.navigate', ...)` sans jamais lire `errorText`. L'item est
  correctement redige et place en ordre 0. Rien a redire sur le fond.

### Blockers

- [ ] **[BLOCKER]** `src/i18n/en.ts:13-15` - Le commentaire reecrit affirme que
  la forme maison `the OHADA business-law zone and the CIMA insurance zone` est
  employee `on the home page, the products hub, the HR and PCS product pages, and
  About`. **C'est faux pour PCS.** `productPcs` ne contient que `intro` et
  `externalCta`, ni l'une ni l'autre ne portant l'expansion ; la seule occurrence
  du cote PCS est `meta.productsPcs.description`, qui ne rend que dans le `<head>`
  et non dans le corps que la phrase decrit. Mesure sur `dist/en` au HEAD de la
  PR, `<head>` exclu : les pages qui developpent dans le corps sont l'accueil, le
  hub Produits, la fiche HR et A propos, soit **quatre**, pas cinq. La recette de
  verification que le commentaire prescrit neuf lignes plus bas le contredit
  elle-meme : `grep "business-law zone" dist/en` renvoie ces quatre pages et pas
  PCS. Le commentaire a ete reecrit precisement parce que le precedent etait
  faux ; il l'est encore. -> Retirer PCS de la liste, ou developper reellement
  l'acronyme dans `productPcs.intro`, page dont le sujet entier est la zone CIMA.

- [ ] **[BLOCKER]** `src/i18n/en.ts:20-22` - La `Known gap, measured rather than
  assumed` est elle-meme fausse, et de deux facons. Elle nomme
  `the three services pages, Contact and the two legal pages`, soit **six**
  pages ; `docs/work-items/I18N-FIX-001.md:63` et `:66` annoncent **sept** pour
  la meme mesure, et le corps de la PR reprend `faux sur 7 des 13`. Le compte
  reel, mesure sur `dist/en` au HEAD, `<head>` exclu, est de **neuf sur treize** :
  aux six enumerees s'ajoutent `/en/services` (le hub), `/en/products/papillon-corporate-finance`
  et `/en/products/pcs`. Les trois manquent aux deux colonnes du commentaire, ni
  couvertes ni signalees en lacune, alors que toutes trois portent le
  `footer.tagline` en acronymes nus. Une prochaine session auditant la couverture
  contre cette liste conclura a une couverture complete sur trois pages qui ne le
  sont pas. -> Reprendre la mesure et aligner le commentaire, le work item, D075
  et le corps de la PR sur le meme chiffre.

- [ ] **[BLOCKER]** `public/og-image-en.png` et `public/og-image.png` - Les deux
  vignettes Open Graph, referencees par `BaseLayout.astro:74` et `:82` sur les 26
  pages, portent toujours l'ancien positionnement grave en pixels :
  `Enterprise software built for African markets` cote anglais, la ou la ligne
  validee est `Your technology partner for businesses across Africa.` ; et cote
  francais `developpement sur mesure` sans accent. Toute prevision de partage
  social ou WhatsApp affiche donc exactement la phrase que cet item passe deux PR
  a retirer du site. Defaut verifie, hors perimetre declare, deja trace en
  `SEO-FIX-001` : le suivi existe et est correct, mais la regle de barre maximale
  de `REVIEWER.md` veut que le suivi s'ajoute au blocage et ne s'y substitue pas.
  **Seul le fondateur peut consciemment accepter cette dette et fusionner
  quand meme** ; le reviewer ne peut pas la declasser. -> Soit executer
  `SEO-FIX-001` avant fusion, soit acter explicitement la dette dans la PR.

### Important

- [ ] **[IMPORTANT]** `src/i18n/en.ts:10` - La promesse generale que le work item
  et D075 disent avoir retiree est intacte : la ligne
  `Practical consequences, applied consistently across every English string:`
  est une ligne de contexte, jamais touchee par le diff. Elle introduit desormais
  un point qui enumere lui-meme trois exceptions et une lacune multi-pages, si
  bien que le commentaire s'auto-contredit dans sa premiere phrase. Le work item
  affirme pourtant que le fichier `now states the real rule`. -> Reecrire la
  ligne 10 (`Practical consequences:` suffit), sinon le defaut que l'item declare
  clos survit exactement la ou il etait.

- [ ] **[IMPORTANT]** `src/i18n/en.ts:16-19` - La liste des surfaces exemptees
  (`meta.*.title`, les `h1`, `footer.tagline`) est fausse le jour ou elle est
  ecrite : elle omet `pageTagline.*`, c'est-a-dire **les trois valeurs que ce
  meme commit ajoute**, qui portent `OHADA`, `SYSCOHADA` et `CIMA` nus dans le
  menu deroulant de toutes les pages anglaises. Elle omet aussi les
  `meta.*.description`, par exemple `meta.products.description`
  (`OHADA and CIMA regions`), puisque seul `meta.*.title` est exempte. -> Ajouter
  `pageTagline.*` et les `meta.*.description` a la liste, avec leur raison de
  place.

- [ ] **[IMPORTANT]** `src/i18n/en.ts:22-23` - Le commentaire prescrit
  `Verify with a grep for "business-law zone" over dist/en`. C'est un grep a un
  seul marqueur, exactement la methode que **D075, amendee dans le meme commit**,
  vient de rejeter : `The sweep is verified by comparing the two dictionaries key
  by key, not by grepping markers`, au motif qu'`une liste de marqueurs ne trouve
  que les tournures que son auteur avait deja en tete`. Le marqueur unique ne
  matche jamais `insurance zone`, ce qui est la cause directe du blocker 1.
  -> Prescrire la meme methode que D075, ou au minimum un grep couvrant les deux
  moities de la forme maison.

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:94` et
  `docs/work-items/I18N-FIX-001.md:49` - Les deux disent que les taglines
  fautives etaient vivantes `dans le menu deroulant des 26 pages anglaises`.
  Il y a **13 pages anglaises** ; 26 est le total bilingue. Les taglines lisent
  `en.ts`, que le menu francais n'ouvre jamais, donc la portee maximale est 13.
  L'erreur est doublement genante ici : elle gonfle d'un facteur deux la portee
  inscrite au journal de decisions permanent, et elle contredit le commentaire
  ajoute par la meme PR, qui utilise le bon denominateur (`seven of thirteen`).
  -> Corriger en 13 dans D075, dans le work item et dans le corps de la PR.

- [ ] **[IMPORTANT]** `docs/work-items/SITE-FIX-009.md:6` - L'item cite
  `**Decision** D075`. D075 est la decision du balayage de chaines ; elle ne
  mentionne ni `bin/review_shots`, ni `errorText`, et sa phrase de perimetre
  nomme **deux** suivis et deux seulement : `The Open Graph thumbnails and the
  REVIEWER.md contradictions leave for SEO-FIX-001 and SITE-FIX-007`. Aucune
  D-row n'autorise donc `SITE-FIX-009`. Une session qui suit la citation tombe
  sur une decision sans rapport avec le changement d'outillage qu'elle s'apprete
  a faire. -> Ouvrir une D-row propre pour ce suivi, ou etendre D075 pour le
  nommer comme elle nomme les deux autres.

- [ ] **[IMPORTANT]** `src/i18n/en.ts:79` - `pageTagline.productsPcs` passe de
  `Insurance premium collection across Central and West Africa` a
  `Premium collection in the CIMA zone`. Le remplacement de la geographie par la
  zone est juste, la perte du mot `Insurance` ne l'est pas. En anglais,
  `Premium collection` se lit d'abord comme la collecte d'un supplement ou d'une
  gamme superieure, pas comme l'encaissement de primes d'assurance ; les deux
  taglines voisines nomment toujours leur domaine (`HR and payroll`,
  `Budgeting`), et `Papillon Collection Solution` ne le dit pas non plus, si bien
  que l'assurance disparait de la navigation anglaise. `CLAUDE.md` veut une
  readaptation pour un lecteur d'Accra ou de Lagos, pas un decalque de
  `Recouvrement de primes en zone CIMA`. -> Par exemple
  `Insurance premium collection in the CIMA zone`, qui garde les deux
  informations et tient dans la meme largeur.

- [ ] **[IMPORTANT]** `src/i18n/en.ts:78` - `Budgeting aligned with the SYSCOHADA
  standard` laisse tomber le nom `accounting` que cinq des six autres mentions
  de SYSCOHADA du meme fichier conservent (`the SYSCOHADA accounting standard`,
  lignes 101, 227, 235, 311 et 394 ; la sixieme, ligne 261, dit
  `SYSCOHADA compliance`). La navigation promet donc `the
  SYSCOHADA standard` et la page vers laquelle elle pointe en decrit un autre a
  l'oreille. -> `Budgeting aligned with the SYSCOHADA accounting standard`, ou
  acter la forme courte partout.

- [ ] **[IMPORTANT]** `docs/reviews/` - Les rondes 1 et 2 de cet item ont ete
  ecrites dans `docs/reviews/I18N-001-review.md`, alors que
  `.claude/commands/review.md` derive le nom du fichier de l'ID de l'item. Un
  lecteur qui ouvre `docs/reviews/I18N-FIX-001-review.md` pour retrouver
  l'historique de l'item n'y trouvait rien jusqu'a cette ronde, et la ronde 2 de
  `I18N-001-review.md` porte en realite sur `I18N-FIX-001`. -> Soit deplacer la
  ronde 2 dans ce fichier et renumeroter, soit inscrire une D-row actant que les
  rondes d'un item `-FIX-` restent dans le fichier de l'item d'origine. Trancher,
  pas laisser les deux conventions coexister.

### Suggestions

- **[SUGGESTION]** `dist/en/legal-notice`, `dist/en/privacy` - Les fragments
  francais `Société par Actions Simplifiée Unipersonnelle` et
  `Derrière la pharmacie Rédemption` sont rendus dans une page `lang="en"` sans
  `lang="fr"` inline. WCAG 3.1.2 exempte les noms propres et les termes
  techniques, et une forme juridique ivoirienne comme une adresse tombent
  plausiblement sous l'exemption ; c'est pour cela que ce n'est pas un blocage.
  -> A trancher une fois, dans le meme geste que les autres textes legaux
  verrouilles.

- **[SUGGESTION]** `src/i18n/en.ts:144`, `:134`, `:303` - La forme maison
  `the OHADA business-law zone and the CIMA insurance zone` est desormais ecrite
  en toutes lettres dans trois valeurs. Un commentaire la designe comme une norme
  du fichier sans qu'aucune constante ne la porte. Choix de gout, non bloquant :
  ce sont des phrases entieres, pas un fragment reutilisable.

### Correctness (code-review skill)

Skill execute a l'effort `high` sur la PR #31, sans `--comment`, conformement a
D080. 30 candidats produits, 5 refutes par la passe adverse, 9 rapportes. Les
neuf ont ete reverifies un a un contre le code au HEAD de la PR avant promotion ;
**les neuf sont confirmes** et sont deja repris ci-dessus, sans doublon :

| Constat du skill | Classe ici |
|---|---|
| `en.ts:15`, PCS annonce conforme alors qu'aucune chaine ne developpe | `[BLOCKER]` 1 |
| `en.ts:20`, liste de lacunes sous-comptee, six contre sept contre neuf | `[BLOCKER]` 2 |
| `en.ts:10`, la promesse generale survit intacte | `[IMPORTANT]` |
| `en.ts:77`, `pageTagline.*` absent de la liste d'exemptions | `[IMPORTANT]` |
| `en.ts:22`, grep a un marqueur contre la methode de D075 | `[IMPORTANT]` |
| `DECISIONS.md:94`, 26 pages anglaises au lieu de 13 | `[IMPORTANT]` |
| `SITE-FIX-009.md:6`, D075 citee a tort | `[IMPORTANT]` |
| `en.ts:79`, perte du mot `Insurance` | `[IMPORTANT]` |
| `en.ts:78`, perte du mot `accounting` | `[IMPORTANT]` |

Les cinq refutes ne sont pas repris : ils portaient sur la disparition supposee
du grep a quatre marqueurs (D075 le documente et le retire explicitement), sur un
paragraphe de `BACKLOG.md` qui n'a jamais ete une enumeration exhaustive, et sur
une autocorrection de `D076 et D077` tracable dans l'historique de la branche.

### Summary

Le balayage lui-meme est bon : les trois taglines, `home.productsTitle` et
`productsPage.intro` corrigent de vraies chaines fautives, le build et la parite
sont verts, le rendu est propre aux trois largeurs dans les deux langues, et la
PR va spontanement chercher deux valeurs que la ronde 2 n'avait pas listees. Ce
qui bloque est ailleurs : **le commentaire ecrit pour cesser de mentir ment
encore**, sur la fiche PCS et sur le compte des pages en lacune, et sa propre
recette de verification le contredit ; a quoi s'ajoutent la promesse generale de
la ligne 10 restee intacte, un compte de 26 pages anglaises la ou il y en a 13,
inscrit au journal permanent, et une citation de D075 qui n'autorise pas
`SITE-FIX-009`. Les deux vignettes Open Graph, tracees mais non corrigees,
restent un blocage que seul le fondateur peut lever.
