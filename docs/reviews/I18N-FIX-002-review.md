# I18N-FIX-002 - Revue

**Continuite.** Ce fil compte trois rondes anterieures, ecrites dans deux autres
fichiers. `docs/reviews/I18N-001-review.md` porte `## Round 1` (item `I18N-001`,
PR #25) et `## Round 2` (item `I18N-FIX-001`, PR #29).
`docs/reviews/I18N-FIX-001-review.md` porte `## Round 1` (item `I18N-FIX-001`,
PR #31), verdict CHANGES REQUESTED, dont le present item traite les constats. La
ronde 1 ci-dessous est donc chronologiquement la quatrieme passe sur cette
matiere. Convention de nommage et obligation de renvoi : D121.

## Round 1 - 2026-08-08
**Verdict**: CHANGES REQUESTED

Ronde conduite sur la **PR #39**, branche `fix/commentaire-en-ts`, base
`origin/refonte-multipages`, HEAD `1818413`. Worktree de revue
`.claude/worktrees/review-I18N-FIX-002`, non detache, sur la branche jetable
`review-i18n-fix-002` forkee de `origin/fix/commentaire-en-ts`.

Diff mesure : 14 fichiers, 248 insertions, 26 suppressions. Trois valeurs de
dictionnaire, deux PNG regeneres, le reste documentaire.

### Ce qui a ete verifie et qui passe

- `npm ci`, `npm run build` (26 pages) et `npm run check` (0 erreur, 0
  avertissement, 0 indice) relances independamment dans le worktree de revue.
  Aucun `any`, aucun `@ts-ignore`, `Dictionary` toujours derive de `fr.ts`.
- **Parite FR/EN mesuree cle par cle**, pas deduite d'un compte : 212 feuilles de
  chaque cote apres aplatissement des deux objets importes, ensemble vide dans
  les deux sens. Le chiffre de 255 annonce dans le corps de la PR est le compte
  de lignes `cle:` du fichier, feuilles et noeuds confondus ; il n'est pas faux,
  il ne mesure simplement pas la meme chose.
- **La recette de verification du nouveau commentaire tient.** Reproduite sur le
  `dist/` de ce worktree : `grep -rl "business-law zone" dist/en` renvoie
  `about`, `index`, `products`, `products/papillon-hr-suite` ;
  `grep -rl "insurance zone"` renvoie `about`, `index`, `products`,
  `products/pcs`. Les deux moities ne voyagent effectivement pas ensemble, et
  `find dist/en -name index.html | wc -l` donne bien 13. La correction de D075 et
  de `I18N-FIX-001.md` de 26 vers 13 est juste.
- **Les deux vignettes de partage.** `bin/og_images --check` sort 0, deux
  `inchangee`. Les deux PNG ouverts a l'oeil : palette navy et or seulement,
  logomark D086, sous-titre sur deux lignes, aucun rognage, aucune collision avec
  le filet or du bas. Le blocker 3 de la ronde precedente est effectivement mort.
- **Rendu de la surface reellement touchee**, le menu deroulant de l'en-tete,
  mesure dans Chrome via le protocole DevTools sur le `dist/` de ce worktree
  (`astro preview` a glisse sur le port **4322**, pas 4321 ; verifie dans son
  propre journal avant capture). A 1440 px, panneau de 288 px : les deux taglines
  corrigees tiennent en 2 lignes, sans debordement, en `rgb(91, 100, 114)` soit
  `--slate-body`, contraste 5,98:1 sur `#FFFFFF`, AA tenu. 18 captures produites
  a 360, 768 et 1440 px sur `/`, `/produits`, `/produits/pcs`, `/en`,
  `/en/products`, `/en/products/pcs` ; une ouverte a l'oeil pour ecarter le
  defaut `SITE-FIX-009`, la page rendue est bien la bonne.
- **Garde-fous editoriaux** : aucun prix, aucun nom de client, aucune date exacte
  (`Q3 2026` cote anglais, constante unique), aucune figure inventee. Une seule
  personne sur `/a-propos`. Trois produits, aucune mention d'ALTARYS ENTERPRISE.
- **Marque** : aucun hex en dur ajoute, aucun violet, aucun ambre, aucun teal.
- **SEO** : hreflang reciproques verifies sur la paire PCS, `og:image` pointe sur
  deux fichiers presents dans `public/`, sitemap a 26 `<loc>`, `robots.txt`
  coherent. Rien n'est sorti de `BaseLayout.astro`.
- **Deploiement** : sortie statique, pas d'adaptateur, `wrangler.jsonc` intact,
  aucun secret. La PR vise bien `refonte-multipages`.
- **Typographie** : aucun cadratin, aucun point median dans le diff.

### Blockers

- [ ] **[BLOCKER]** `src/i18n/en.ts:15-21` - **La troisieme version du
  commentaire d'en-tete est de nouveau fausse**, cette fois sur
  `meta.*.description`. Elle range cette famille parmi les surfaces qui gardent
  les sigles nus « for room rather than by preference », avec une contrainte
  « structural in each case ». Deux faits du depot la contredisent :
  `meta.productsPcs.description` (`src/i18n/en.ts:407-408`) porte deja la forme
  maison developpee, « operating in the CIMA insurance zone », en 140 caracteres,
  donc dans le budget ; et D072 enregistre l'omission des sigles dans les
  descriptions de l'accueil comme une **preference du fondateur explicitement
  voulue** (« That asymmetry is intentional »), pas comme un manque de place.
  C'est une affirmation de couverture, exactement la classe que D119 dit avoir
  retiree, replacee dans le paragraphe ecrit pour la retirer. Le critere
  d'acceptation 3 de l'item demande que le commentaire soit « true in every
  clause » ; il ne l'est pas.
  -> Retirer `meta.*.description` de l'enumeration des surfaces contraintes, ou
  la remplacer par une phrase qui ne pretend rien : la liste des surfaces
  exemptees est elle-meme une affirmation de couverture et se perime de la meme
  facon. La formulation la plus sure est de ne nommer que la contrainte
  (`meta.*.title` tronque a 60 caracteres, `h1` qui passe a trois lignes,
  colonnes etroites) sans dire quelles cles la subissent.

- [ ] **[BLOCKER]** `docs/work-items/I18N-FIX-002.md:3` et `:36-38` - **La fiche
  de l'item, marquee DELIVERED, designe la mauvaise branche et la mauvaise pull
  request.** L'en-tete dit **Branch `fix/chaines-residuelles` (carries PR #31)**,
  et la section « Where things stand » dit « **PR #31 is open and carries a
  CHANGES REQUESTED verdict** ». Or `gh pr view 31` renvoie `MERGED`,
  `mergedAt 2026-08-08T06:22:00Z`, et le travail livre ici est sur
  `fix/commentaire-en-ts`, PR #39, dont le merge-base est justement le commit de
  fusion de la #31. La section « What the delivering session actually found »
  ajoutee par ce diff corrige trois autres derives mais laisse celles-la. Un
  lecteur qui suit l'en-tete d'une fiche DELIVERED atterrit sur une PR fusionnee
  qui ne contient rien de cette livraison. C'est la classe de defaut que l'item
  existe pour supprimer, dans son propre en-tete.
  -> Ecrire **Branch `fix/commentaire-en-ts` (carries PR #39)**, et annoter
  « Where things stand » pour dire que la #31 a fusionne le 8 aout a 06:22 UTC.

- [ ] **[BLOCKER]** `docs/BACKLOG.md:37` contre `:81-83` - **Le backlog se
  contredit sur `SEO-FIX-001` dans le meme fichier.** Le diff l'installe dans le
  tableau des livres, « delivered by `UI-FIX-003` [...] so the class is closed »,
  et le retire du tableau des ouverts. Trois sections plus bas, le paragraphe
  laisse intact dit toujours « **`SEO-FIX-001` waits on nothing technical**, only
  on the copy [...] It needs a founder ruling on the line each thumbnail
  carries. » Le fichier affirme donc a la fois que l'item est clos et qu'il
  attend un arbitrage du fondateur. `docs/BACKLOG.md` est le document sur lequel
  le fondateur choisit le prochain item ; une contradiction interne y coute
  directement une decision.
  -> Supprimer ou reecrire le paragraphe de `:81-83` pour renvoyer a D101 et a
  `UI-FIX-003`.

### Important

- [ ] **[IMPORTANT]** `docs/BACKLOG.md:43` - La ligne du present item dit
  « delivered, **PR #31** awaiting review ». Mauvais numero, et la #31 n'attend
  aucune revue puisqu'elle est fusionnee. Meme cause que le blocker 2.
  -> `delivered, PR #39 awaiting review`.

- [ ] **[IMPORTANT]** `src/i18n/fr.ts:60` et `docs/work-items/PAGE-003.md:60-63`
  - **Le jumeau francais de la tagline PCS reste en arriere, et `PAGE-003` le met
  hors perimetre par une formule vraie d'un seul cote.** Mesure dans le rendu :
  le meme menu deroulant affiche `Recouvrement de primes en zone CIMA` en
  francais et `Premium and instalment collection in the CIMA zone` en anglais.
  Les deux langues decrivent desormais un perimetre produit different sur la
  meme surface, sur les 13 pages de chaque cote. D123 assume que la navigation
  **anglaise** devance la fiche PCS, mais ne dit rien du francais, qui est la
  langue du marche principal. Et la section « Out of scope » de `PAGE-003` ecrit
  « `pageTagline.productsPcs`, already shipped by `I18N-FIX-002`. Verify it
  agrees with whatever this item settles; do not rewrite it without a reason » :
  c'est vrai de la valeur anglaise seulement, et une session future lira cette
  ligne comme couvrant la cle dans les deux langues. Le risque concret est que le
  francais ne soit jamais elargi. C'est le motif de recidive de ce fil, un
  jumeau laisse derriere, applique cette fois a l'item de suite lui-meme.
  -> Qualifier la ligne : la valeur **anglaise** est livree, la valeur francaise
  reste a elargir et fait partie du perimetre de `PAGE-003`.

- [ ] **[IMPORTANT]** `docs/work-items/SEO-FIX-001.md:3` - La fiche dit toujours
  **Status OPEN, not started** alors que `docs/BACKLOG.md`, edite par cette meme
  PR, la declare livree. Le depot a pourtant son precedent :
  `docs/work-items/UI-005.md:3` porte « **Status**: **DONE**, delivered by
  UI-FIX-003 on 2026-08-07 ». La fiche cite en outre encore D075 comme sa
  decision, la ou D101 est la decision reelle.
  -> Passer la fiche a DONE avec le renvoi a `UI-FIX-003` et a D101, comme
  `UI-005`.

- [ ] **[IMPORTANT]** `docs/work-items/PAGE-003.md` - **L'item de suite ne cite
  pas la phrase definissante du reviewer**, alors que D108 l'impose : « a
  follow-up item's scope must **quote the reviewer's defining sentence
  verbatim** rather than paraphrase it ». `PAGE-003` se contente de « Born from
  round 1 [...] finding 6 » et raconte la decision du fondateur. Son jumeau
  `docs/work-items/UI-FIX-004.md:11-19`, cree par la meme PR, porte bien une
  section `## The reviewer's defining sentence` avec citation. L'asymetrie entre
  deux items nes du meme diff montre que la regle n'a pas ete appliquee, elle a
  ete appliquee une fois par hasard. La phrase a citer existe et est precise,
  `docs/reviews/I18N-FIX-001-review.md:184-194`.
  -> Ajouter la section de citation a `PAGE-003`, sur le modele de `UI-FIX-004`.

- [ ] **[IMPORTANT]** `docs/work-items/I18N-FIX-002.md:23` - Markdown casse
  introduit par ce diff : `2. **`D-max was D114 at plan time and D118 four hours
  later**, taken by`. Le backtick ouvert n'est jamais referme et le gras se
  ferme au mauvais endroit, si bien que le rendu GitHub affiche un backtick
  parasite et un gras qui deborde sur la suite du paragraphe. Le point 2 est
  precisement celui qui explique la renumerotation D115-D119 vers D119-D123, donc
  la ligne que quelqu'un ira lire.
  -> `2. **D-max etait D114 au moment du plan et D118 quatre heures plus tard**,
  pris par ...`.

### Suggestions

- **[SUGGESTION]** `src/i18n/fr.ts:118` contre `src/i18n/en.ts:88-89` - Le
  sous-titre francais de la vignette se termine sans point
  (`... projets logiciels sur mesure`), l'anglais avec
  (`... custom software projects.`). Visible cote a cote sur les deux PNG livres.
  D122 cite le francais verbatim comme les mots du fondateur, donc ce n'est pas
  un defaut a corriger d'autorite ; c'est un point a lui soumettre une fois.

- **[SUGGESTION]** `src/i18n/en.ts:22` - `NOT EVERY PAGE EXPANDS THEM, AND THIS
  COMMENT DOES NOT SAY WHICH DO.` en capitales. L'intention se comprend, mais le
  reste du fichier ne crie nulle part et la phrase suivante dit deja la meme
  chose en minuscules. Preference, non bloquante.

- **[SUGGESTION]** `src/i18n/en.ts:3-38` - Le commentaire d'en-tete est en
  anglais alors que `CLAUDE.md` et `docs/AI_Development_Workflow.md` demandent
  les commentaires de code en francais, et que les commentaires voisins du meme
  fichier (`ogSubtitle`) sont bien en francais. Le defaut precede cette PR, mais
  celle-ci reecrit la moitie du bloc sans le corriger. Classe en suggestion parce
  que la regle est ambigue sur un commentaire qui documente une **adaptation
  anglaise** et qui cite des chaines anglaises ; c'est un arbitrage, pas une
  reparation.

### Correctness (code-review skill)

Passe generique executee via `code-review:code-review` sur la PR #39, nom
pleinement qualifie, sans option (D082). Le plugin a poste son propre commentaire
sur la PR ; le present fichier reste l'enregistrement durable.

Deux constats retenus apres verification contre le code, tous deux deja portes
ci-dessus et non dupliques ici :

- **[BLOCKER]** `src/i18n/en.ts:15-21` - clause `meta.*.description` fausse.
  Verifie a la main : `meta.productsPcs.description` developpe la forme maison en
  140 caracteres, et D072 qualifie l'omission des sigles dans les descriptions de
  choix editorial.
- **[BLOCKER]** `docs/BACKLOG.md:37` contre `:81-83` - contradiction interne sur
  `SEO-FIX-001`. Verifie en lisant le fichier entier.

Constats remontes par la passe puis **ecartes ou reclasses** apres verification,
pour que le prochain lecteur n'ait pas a les reinstruire :

- « `bin/og_images` pourrait rogner un sous-titre plus long » : ecarte. Les deux
  PNG livres ont ete ouverts, le sous-titre tient en deux lignes avec marge.
- « Le point final manquant en francais viole une regle » : reclasse en
  suggestion, aucune regle du depot n'impose la symetrie de ponctuation, et D122
  cite le francais verbatim.
- « Commentaire d'en-tete en anglais » : reclasse en suggestion, defaut
  preexistant et regle ambigue sur ce cas precis.

### Summary

Le fond de l'item est bon et ses trois mesures difficiles sont exactes : la
recette a deux greps se reproduit ligne pour ligne, les 13 pages anglaises sont
le bon denominateur, la parite tient cle par cle et les deux vignettes sont
enfin generees depuis les dictionnaires. Ce qui bloque est que l'item, dont le
sujet est d'empecher un document d'affirmer une couverture qui se perime, en
laisse trois derriere lui : le commentaire de `en.ts` redevient faux sur
`meta.*.description`, la fiche DELIVERED designe une PR fusionnee qui ne contient
pas la livraison, et `BACKLOG.md` se contredit sur `SEO-FIX-001`. Aucun n'est
couteux a corriger, tous se corrigent sans toucher une page.

## Round 2 - 2026-08-08
**Verdict**: CHANGES REQUESTED

Ronde conduite sur la **PR #39**, branche `fix/commentaire-en-ts`, base
`origin/refonte-multipages`, HEAD `d09872a`. Worktree de revue
`.claude/worktrees/review-I18N-FIX-002`, non detache, sur la branche jetable
`review-i18n-fix-002` forkee de `origin/fix/commentaire-en-ts`. Reviewer
independant, session fraiche, aucune continuite de contexte avec la ronde 1.

Deux commits sont arrives depuis la ronde 1 : `2678c6f`, qui traite les trois
blockers et les cinq constats importants, et `d09872a`, qui ponctue le
sous-titre francais de la vignette et regenere les deux PNG.

Diff mesure contre l'integration : 16 fichiers, 538 insertions, 31 suppressions.
Trois valeurs de dictionnaire, deux PNG, le reste documentaire.

### Les constats de la ronde 1, verifies un par un

Tous leves, verification faite contre l'arbre et non contre le message de commit.

- **Blocker 1**, la clause `meta.*.description` : l'enumeration des surfaces
  exemptees a disparu de `src/i18n/en.ts`. La clause fautive n'existe plus.
  **Une autre l'a remplacee**, voir le blocker unique de cette ronde.
- **Blocker 2**, la fiche DELIVERED : `docs/work-items/I18N-FIX-002.md:3` dit
  desormais **Branch `fix/commentaire-en-ts` (carries PR #39)**, et la section
  « Where things stand » porte l'encart `> Superseded on 2026-08-08`. Verifie
  contre `gh pr view 31` : `MERGED`, `mergedAt 2026-08-08T06:22:00Z`. Exact.
- **Blocker 3**, la contradiction interne de `docs/BACKLOG.md` sur
  `SEO-FIX-001` : le paragraphe `:81-83` renvoie maintenant a D101 et a
  `UI-FIX-003`. Plus de contradiction dans le fichier.
- **Important 1**, `docs/BACKLOG.md:43` : lit `delivered, PR #39 awaiting
  review`. Corrige.
- **Important 2**, le jumeau francais de la tagline PCS : la section
  « Out of scope » de `docs/work-items/PAGE-003.md` porte desormais le
  paragraphe **« The French twin is IN scope and must not be read as covered by
  that line »**, avec les deux emplacements `fr.ts:60` et `fr.ts:414`. La
  qualification demandee est faite.
- **Important 3**, `docs/work-items/SEO-FIX-001.md:3` : passe a
  **Status DONE, delivered by `UI-FIX-003` on 2026-08-07**, decision repointee
  de D075 vers D101, sur le modele d'`UI-005`. Corrige.
- **Important 4**, la citation D108 manquante dans `PAGE-003` : la section
  `## The reviewer's defining sentence` existe, citation verbatim de
  `docs/reviews/I18N-FIX-001-review.md:184-194`. Corrige.
- **Important 5**, le markdown casse de `I18N-FIX-002.md:23` : le backtick
  parasite a disparu, la ligne lit `2. **D-max was D114 at plan time and D118
  four hours later**, taken by`. Corrige.
- **Suggestion 1**, le point final du sous-titre francais : tranchee par le
  fondateur, `d09872a` ajoute le point, D122 est amendee pour que la citation
  reste exactement ce qui est livre, et les deux PNG sont regeneres.
- **Suggestion 2**, la phrase en capitales : reecrite en minuscules.
- **Suggestion 3**, le commentaire d'en-tete en anglais : non traitee, ce qui
  est le droit d'une suggestion. Reprise ci-dessous a l'identique.

### Ce qui a ete verifie et qui passe

- `npm ci`, `npm run build` (**26 pages**) et `npm run check` (**0 erreur, 0
  avertissement, 0 indice**) relances independamment dans le worktree de revue.
  Aucun `any`, aucun `@ts-ignore`, `Dictionary` toujours derive de `fr.ts`.
- **Parite FR/EN mesuree cle par cle** en important les deux dictionnaires et en
  aplatissant les objets : **176 feuilles de chaque cote, ensemble vide dans les
  deux sens**. Les sept valeurs vides cote anglais sont les `pageTagline.*` des
  pages sans tagline, presentes des deux cotes. Le chiffre differe de celui de la
  ronde 1 parce que ce script traite un tableau comme une feuille et non comme un
  noeud ; la conclusion est la meme.
- **La recette du commentaire se reproduit exactement.** Sur le `dist/` de ce
  worktree : `grep -rl "business-law zone" dist/en --include=index.html` renvoie
  `about`, `index`, `products`, `products/papillon-hr-suite` ;
  `grep -rl "insurance zone" dist/en --include=index.html` renvoie `about`,
  `index`, `products`, `products/pcs`. Les deux moities ne voyagent pas
  ensemble, et `find dist/en -name index.html | wc -l` donne **13**.
- **Vignettes de partage** : `bin/og_images --check` sort 0, deux `inchangee`.
  Les deux PNG ouverts a l'oeil dans cette ronde. Palette navy et or seulement,
  logomark D086, sous-titre sur deux lignes avec marge, aucun rognage, le point
  final francais est bien la. `og:image` pointe sur deux fichiers presents dans
  `public/`.
- **Rendu verifie dans le navigateur**, sur le `dist/` de ce worktree.
  `astro preview` a glisse sur le port **4323** (4321 et 4322 pris par d'autres
  worktrees) ; propriete du port confirmee par `lsof`, le `cwd` du processus est
  bien `.claude/worktrees/review-I18N-FIX-002`. 18 captures produites par
  `bin/review_shots` a 360, 768 et 1440 px sur `/`, `/produits`,
  `/produits/pcs`, `/en`, `/en/products`, `/en/products/pcs`, dont plusieurs
  ouvertes a l'oeil pour ecarter le defaut `SITE-FIX-009` : les pages rendues
  sont les bonnes. Surface reellement touchee, le menu deroulant de l'en-tete,
  mesuree par le protocole DevTools a 1440 px, panneau de **288 px** :
  `Premium and instalment collection in the CIMA zone` tient en **2 lignes**,
  `Budgeting aligned with the SYSCOHADA accounting standard` aussi, en
  `rgb(91, 100, 114)` soit `--slate-body`, **contraste 5,98:1 sur `#FFFFFF`**,
  AA tenu malgre les 11,5 px. Aucun debordement, aucune collision.
- **Garde-fous editoriaux** : aucun prix, aucun nom de client ou de partenaire,
  aucune date exacte (`Available Q3 2026`, constante unique `availability.pcs`),
  aucune figure inventee, aucun temoignage. Une seule personne sur `/a-propos`.
  Trois produits, aucune mention d'ALTARYS ENTERPRISE.
- **Marque** : aucun hex en dur introduit, aucun violet, aucun ambre, aucun teal,
  sur les pages comme sur les deux PNG.
- **SEO** : hreflang reciproques verifies sur la paire PCS, `x-default` sur le
  francais, sitemap a **26 `<loc>`**, `robots.txt` coherent, rien n'est sorti de
  `BaseLayout.astro`.
- **Deploiement** : sortie statique, aucun adaptateur, `wrangler.jsonc`,
  `astro.config.mjs`, `package.json` et `functions/` non touches par le diff, la
  virgule apres `pages_build_output_dir` est en place, aucun secret. La PR vise
  bien `refonte-multipages`.
- **Typographie** : aucun cadratin, aucun point median dans le diff.

### Blockers

- [ ] **[BLOCKER]** `src/i18n/en.ts:18-23` - **Le commentaire d'en-tete est de
  nouveau faux, dans le paragraphe meme ecrit pour qu'il cesse de l'etre, et sur
  la meme classe qu'a la ronde 1.** L'enumeration des surfaces exemptees a bien
  disparu ; la phrase qui la remplace introduit a sa place une affirmation sur
  une cle nommee : « **D072 records a founder preference for the bare form in the
  home descriptions**, which is a choice and not a constraint ». Elle est offerte
  comme l'exemple qui prouve la phrase precedente, « room is not the only reason
  a value **keeps the acronyms** ». Deux faits mesures la contredisent.
  1. Les descriptions de l'accueil **ne portent aucun sigle, ni nu ni developpe**.
     `meta.home.description` lit `... for companies across West and Central
     Africa.` (`src/i18n/en.ts:391-392`) et
     `... pour les entreprises d'Afrique de l'Ouest et Centrale.`
     (`src/i18n/fr.ts`). Verifie aussi dans le rendu : la balise
     `<meta name="description">` de `dist/index.html` et de `dist/en/index.html`
     ne contient ni `OHADA` ni `CIMA`. Une valeur qui ne garde aucun sigle ne
     peut pas illustrer une phrase sur les raisons de garder les sigles.
  2. **D072 ne dit pas cela.** La ligne enregistre que les deux **titres**
     portent les zones OHADA et CIMA et que les deux **descriptions** portent la
     geographie du fondateur ; c'est un partage de registre entre titre et
     description, pas une preference sur la forme nue contre la forme
     developpee. La ronde 1 l'avait ecrit correctement (« l'omission des sigles
     dans les descriptions de l'accueil ») ; la transcription dans `en.ts`
     inverse le fait.
  C'est la cinquieme clause fausse de ce commentaire, et la deuxieme dans le
  paragraphe issu de D119. Le critere d'acceptation 3 de l'item demande qu'il
  soit « true in every clause » ; il ne l'est pas. Le motif est aussi exactement
  celui que D119 dit avoir supprime : nommer une cle dans un commentaire qu'aucun
  build ne lit.
  -> Supprimer la phrase. La demonstration que « room is not the only reason »
  n'a besoin d'aucun exemple pour tenir, et tout exemple la reexpose. Si un
  renvoi a D072 est juge utile, l'ecrire sans lui faire dire ce qu'elle ne dit
  pas : D072 arbitre le registre du titre contre celui de la description, elle ne
  parle pas de la forme des sigles.

### Important

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:134` (D119) contre `src/i18n/en.ts:26`
  - **Les deux textes livres par le meme commit ne comptent pas pareil, et sur
  le nombre meme dont cet item a fait son sujet.** D119 ecrit « Round 1 of this
  item's review then caught **a fourth false version**, written by this very
  row », apres n'avoir enumere que « Version 1 » et « version 2 » : aucune
  troisieme n'est nommee nulle part, le lecteur ne peut pas la reconstituer. Le
  commentaire ecrit par ce meme commit dit l'inverse, « **Three earlier
  versions** of these lines asserted a coverage [...] a review caught **the
  third** before it did », et `docs/work-items/I18N-FIX-001.md:64` dit lui aussi
  « `I18N-FIX-002` wrote **the third** ». L'historique tranche pour trois :
  `git log` sur `src/i18n/en.ts` ne montre que **trois** commits ayant touche ce
  bloc avant la version courante, `12025d9`, `5873c71` et `1818413`. Le message
  de `2678c6f` reprend l'erreur (« faux **une quatrieme fois** »). L'origine
  probable est la confusion avec les quatre **rondes de revue** du fil, comptees
  a `docs/reviews/I18N-FIX-002-review.md:8`.
  -> Corriger D119 en « a third false version », ou nommer explicitement la
  troisieme si l'auteur en connait une que l'historique ne montre pas. La regle
  posee par D119 elle-meme s'applique a D119 : un compte s'ecrit mesure.

- [ ] **[IMPORTANT]** `.claude/personalities/REVIEWER.md:71` et `:61` -
  **Le fichier que cette PR modifie contredit `CLAUDE.md` sur deux points
  verrouilles, et la PR le laisse tel quel.** La ligne 71 demande au reviewer de
  verifier que « **Visual hierarchy holds: Services first, Products second** »,
  quand `CLAUDE.md` pose « **Products before Services, a deliberate positioning
  choice** » ; la ligne 61 enumere les trois produits en ecrivant « Papillon
  Corporate Finance » sans son « Suite », que `CLAUDE.md` verrouille et que D017
  et D031 ont deja retabli une fois. Un reviewer non attendu seme avec ce
  fichier leve un faux blocker sur une page correcte, ce qui est exactement le
  defaut que D075 decrit. Le defaut precede la PR et est **deja suivi par
  `SITE-FIX-007`**, ouvert et en ordre 0 dans `docs/BACKLOG.md` ; il est remonte
  ici parce que la barre maximale du depot bloque sur un defaut verifie quelle
  qu'en soit l'origine, et que le suivi s'ajoute au blocage sans le remplacer.
  La PR ajoute quatre lignes a ce fichier, elle etait donc ouverte.
  -> Soit corriger les deux lignes ici, la PR editant deja ce fichier sous
  l'autorite de D121, soit acter en D-row que le fondateur accepte la dette
  jusqu'a `SITE-FIX-007`. La reclassification par le reviewer n'est pas une
  option.

### Suggestions

- **[SUGGESTION]** `src/i18n/en.ts:34-35` - Le commentaire prescrit deux greps
  puis avertit « It also matches the `<head>`, so **exclude it** before
  concluding anything about body copy », mais aucune des deux commandes affichees
  n'exclut le `<head>` : `--include=index.html` filtre sur le nom de fichier, pas
  sur une section. Le lecteur est invite a faire quelque chose que la recette ne
  fait pas, et c'est precisement ce piege qui a produit la version 2 fausse, PCS
  ne portant la forme maison que dans son `<head>`. Non bloquant parce que
  l'avertissement, lui, est exact et suffit a un lecteur attentif ; utile
  toutefois de donner la commande qui le fait.

- **[SUGGESTION]** `src/i18n/en.ts:3-42` - Le commentaire d'en-tete reste en
  anglais alors que `CLAUDE.md` demande les commentaires de code en francais, et
  que les commentaires voisins du meme fichier (`availability`, `ogSubtitle`)
  sont en francais. Constat identique a la ronde 1, non traite, ce qui est le
  droit d'une suggestion. Reste un arbitrage du fondateur : le bloc documente une
  adaptation anglaise et cite des chaines anglaises.

### Correctness (code-review skill)

Passe generique executee via `code-review:code-review` sur la PR #39, nom
pleinement qualifie, sans option (D082). Cinq agents de revue en parallele plus
les etapes d'eligibilite et de synthese. Le plugin a poste son propre commentaire
sur la PR ; le present fichier reste l'enregistrement durable.

Deux constats retenus apres verification contre le code, tous deux deja portes
ci-dessus et non dupliques :

- **[BLOCKER]** `src/i18n/en.ts:18-23` - clause D072 fausse. Verifie a la main :
  ni `meta.home.description` cote anglais ni son jumeau francais ne portent
  `OHADA` ou `CIMA`, dans la source comme dans `dist/`, et D072 arbitre le
  registre titre contre description.
- **[IMPORTANT]** `docs/DECISIONS.md:134` - « a fourth false version » contre
  « Three earlier versions » dans `en.ts`. Verifie par `git log` sur
  `src/i18n/en.ts` : trois commits seulement ont touche ce bloc avant la version
  courante.

Constats remontes par la passe puis **ecartes** apres verification, pour que le
prochain lecteur n'ait pas a les reinstruire :

- « `pageTagline.productsPcs` contredit la definition de PCS dans `CLAUDE.md` » :
  ecarte. C'est une decision explicite du fondateur, consignee en D123 avec sa
  consequence, et `PAGE-003` porte l'elargissement sur les autres surfaces. D123
  previent nommement la session qui voudrait « corriger » ce point a rebours.
- « La tagline PCS diverge entre `fr.ts` et `en.ts` » : ecarte comme defaut, la
  divergence est reelle mais desormais explicitement dans le perimetre de
  `PAGE-003`, avec les deux emplacements francais cites. C'etait le constat
  important 2 de la ronde 1 et il est traite.
- « `I18N-FIX-001.md` disait sept pages, D119 dit neuf » : ecarte. La phrase a
  sept a ete supprimee par ce diff, et neuf est le compte juste, 13 pages moins
  les 4 que les deux greps renvoient.
- « Le commentaire d'en-tete est en anglais » : reclasse en suggestion, defaut
  preexistant et regle ambigue sur ce cas precis.

### Summary

Les huit constats de la ronde 1 sont leves, verifies un par un contre l'arbre :
la fiche designe la bonne PR, `BACKLOG.md` ne se contredit plus, `PAGE-003` cite
le reviewer et met le jumeau francais dans son perimetre, et le fondateur a
tranche le point final de la vignette. Ce qui bloque encore tient en une phrase :
en retirant l'enumeration des surfaces exemptees, le commentaire de `en.ts` lui a
substitue une affirmation sur `meta.home.description` qui est fausse deux fois,
et D119 se met a compter les versions autrement que le commentaire qu'elle
prescrit. L'item dont le sujet est qu'un document ne doit pas affirmer ce qu'il
n'a pas mesure bute une cinquieme fois sur la meme classe, dans le paragraphe
ecrit pour la supprimer.

## Round 3 - 2026-08-08
**Verdict**: CHANGES REQUESTED

Ronde conduite sur la **PR #39**, branche `fix/commentaire-en-ts`, base
`origin/refonte-multipages`, HEAD `c7cc75f`. Worktree de revue
`.claude/worktrees/review-I18N-FIX-002`, non detache, sur la branche jetable
`review-i18n-fix-002` forkee de `origin/fix/commentaire-en-ts`. Reviewer
independant, session fraiche, aucune continuite de contexte avec les rondes 1
et 2.

Un seul commit est arrive depuis la ronde 2, `c7cc75f`, qui traite le blocker et
les deux constats importants de cette ronde et livre `SITE-FIX-007` au passage.

Diff mesure contre l'integration : **17 fichiers, 824 insertions, 46
suppressions**. Trois valeurs de dictionnaire, deux PNG, le reste documentaire.
Aucun fichier de page, de composant, de style, de configuration ou de fonction
n'est touche, verifie par filtrage du `--name-only`.

### Les constats de la ronde 2, verifies un par un

- **Le blocker**, la clause D072 fausse dans `src/i18n/en.ts` : levee. Le
  paragraphe est reecrit a l'imperatif et ne nomme plus aucune cle.
  `grep -n "D072\|meta.home.description" src/i18n/en.ts` ne renvoie rien.
  L'auteur a balaye la classe et non l'instance : la clause
  `wherever a page argues the regulatory point`, jamais touchee jusque la, passe
  a `when a page argues`, et le compte de versions disparait du commentaire.
- **Important 1**, le compte de versions de D119 : corrige et mesurable.
  `docs/DECISIONS.md:134` lit desormais « four versions preceded the current
  one : `12025d9`, `5873c71`, `1818413` and `2678c6f` ». Verifie a la main :
  `git log --oneline --all -- src/i18n/en.ts` montre exactement ces quatre
  commits avant `c7cc75f`, et le commentaire n'ecrit plus aucun compte, donc
  plus aucune contradiction possible entre les deux textes.
- **Important 2**, les deux lignes de `REVIEWER.md` : traitees, et livrees ici
  plutot que sur `fix/checklist-reviewer`, sous **D127**. La ligne 71 lit
  « Products before Services » avec la raison inline, la ligne 61 porte
  « Papillon Corporate Finance Suite ». `SITE-FIX-007` passe a DONE et
  `docs/BACKLOG.md` le deplace. **La ligne 61 reste fausse sur sa seconde
  mention**, voir l'important 3 ci-dessous.
- **Suggestion 1**, la recette qui n'excluait pas le `<head>` : traitee au-dela
  de ce qui etait demande. Le commentaire porte maintenant un `node -e` qui
  tranche apres `</head>`. Execute tel quel : il renvoie `about`, `index`,
  `products` et `products/papillon-hr-suite`, et PCS en sort correctement.
- **Suggestion 2**, le commentaire d'en-tete en anglais : non traitee, ce qui
  est le droit d'une suggestion. Reprise ci-dessous a l'identique.

### Ce qui a ete verifie et qui passe

- **Build**, relance independamment dans le worktree de revue apres `npm ci` :
  `npm run build` sort **26 pages**, `npm run check` sort **0 erreur, 0
  avertissement, 0 indice**. Aucun `any`, aucun `@ts-ignore`, `en.ts` importe
  toujours `Dictionary` depuis `./fr`.
- **Parite FR/EN mesuree cle par cle**, en important les deux dictionnaires et
  en aplatissant les objets : **176 feuilles de chaque cote, ensemble vide dans
  les deux sens**. Les sept valeurs vides sont les `pageTagline.*` des pages
  sans tagline, vides des deux cotes.
- **La recette du commentaire se reproduit exactement**, sur le `dist/` de ce
  worktree : `find dist/en -name index.html | wc -l` donne **13** ;
  `grep -rl "business-law zone" dist/en --include=index.html` renvoie `about`,
  `index`, `products`, `products/papillon-hr-suite` ;
  `grep -rl "insurance zone"` renvoie `about`, `index`, `products`,
  `products/pcs`. Les deux moities ne voyagent pas ensemble, exactement comme le
  commentaire l'annonce.
- **Surface reellement touchee**, le menu deroulant de l'en-tete, mesuree par le
  protocole DevTools a 1440 px sur `/en`, panneau de **288 px** :
  `Premium and instalment collection in the CIMA zone` tient en **2 lignes**,
  `Budgeting aligned with the SYSCOHADA accounting standard` aussi, en
  `rgb(91, 100, 114)` soit `--slate-body`, **contraste 5,98:1 sur `#FFFFFF`**,
  AA tenu. Aucun debordement, aucune collision, anneau de focus visible sur
  l'item ouvrant.
- **Rendu verifie dans le navigateur**, sur le `dist/` de ce worktree.
  `astro preview` a glisse sur le port **4322**, 4321 etant pris par un autre
  worktree ; propriete confirmee par `lsof -a -p <pid> -d cwd`, qui donne bien
  `.claude/worktrees/review-I18N-FIX-002`. 18 captures produites par
  `bin/review_shots` a 360, 768 et 1440 px sur `/`, `/produits`, `/produits/pcs`,
  `/en`, `/en/products`, `/en/products/pcs`, plusieurs ouvertes a l'oeil pour
  ecarter le defaut `SITE-FIX-009` : les pages rendues sont les bonnes.
- **Fidelite a la maquette** : `Header.dc.html` relu a la RACINE du projet de
  design `53d1c228`, jamais dans `design_handoff_altaryslabs_refonte/`. Le
  prototype pose un panneau blanc a `min-width:250px`, bordure
  `rgba(26,39,64,.1)`, en-tete creme et bouton or `#C8922A` ; l'implementation
  recree tout cela avec ses propres composants et rien n'est copie du HTML
  inline ni de `support.js`. Le prototype ecrit « Papillon Corporate Finance »
  sans « Suite » et le depot gagne, comme `CLAUDE.md` le prevoit.
- **Vignettes de partage** : `bin/og_images --check` sort 0, deux `inchangee`.
  Les deux PNG ouverts a l'oeil. Navy et or seulement, logomark D086,
  sous-titre sur deux lignes sans rognage, point final francais present.
  `og:image` pointe sur deux fichiers presents dans `public/`. Les valeurs
  livrees correspondent mot pour mot a la citation de D122, `collections` au
  pluriel cote anglais.
- **Garde-fous editoriaux** : aucun prix, aucun nom de client ou de partenaire,
  aucune date exacte, aucune figure inventee, aucun temoignage. `Available Q3
  2026` vient bien de la constante unique `availability.pcs`. Trois produits,
  aucune mention d'ALTARYS ENTERPRISE en dehors des commentaires qui
  l'interdisent.
- **Marque** : aucun hex en dur ajoute dans `src/`, aucun violet, aucun ambre,
  aucun teal. Produits avant Services verifie sur les deux accueils.
- **Accessibilite** : 26 pages, **un seul `h1` par page**, attribut `lang`
  correct sur les 26, `fr` sur les 13 racines et `en` sur les 13 prefixees.
- **SEO** : `og:locale`, canonical, hreflang reciproques verifies sur la paire
  PCS avec `x-default` sur le francais, sitemap a **26 `<loc>`**, `robots.txt`
  coherent, rien n'est sorti de `BaseLayout.astro`.
- **Deploiement** : sortie statique, aucun adaptateur, `wrangler.jsonc`,
  `astro.config.mjs`, `package.json` et `functions/` absents du diff, aucun
  secret. La PR vise bien `refonte-multipages`.
- **Typographie** : aucun cadratin, aucun point median, ni dans les lignes
  ajoutees du diff ni dans les messages de commit.

### Blockers

Aucun. La ronde 2 est levee et le site lui-meme est propre a tous les postes
mesures ci-dessus. Ce qui suit est documentaire et bloque neanmoins la ronde, la
barre maximale du depot bloquant sur tout defaut verifie.

### Important

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:143` - **La D-row que cette PR ajoute
  pour justifier la livraison de `SITE-FIX-007` ne rend pas comme une ligne de
  tableau.** Elle est posee seule, apres une ligne vide et le paragraphe
  « D033 to D035 are reserved... », donc en dehors du tableau qui se termine a
  la ligne 138. En Markdown GitHub, une ligne `| ... |` sans en-tete ni ligne de
  separation au-dessus n'est pas un tableau. Verifie en passant le **fichier
  entier** a l'API de rendu de GitHub (`gh api -X POST /markdown`, mode `gfm`) :
  D123 ressort en `<tr><td>D123</td>...`, D127 ressort en
  `<p>| D127 | 2026-08-08 | I18N-FIX-002 | ...`. Une seule ligne orpheline dans
  tout le fichier, et c'est D127. Le lecteur du journal voit un mur de barres
  verticales la ou toutes les autres decisions sont des cellules.
  -> Remonter la ligne D127 dans le tableau, juste apres D123, et laisser les
  deux paragraphes de reserve la ou ils sont. Une ligne de tableau ne peut pas
  vivre sous un paragraphe.

- [ ] **[IMPORTANT]** `docs/BACKLOG.md:54`, `:29-38` et `:3` - **L'index dit
  qu'il reste a faire un travail qui est en production.** La ligne 54 porte
  `| 4 | FORM-001 | PAGE-002 |` dans « Open, in dependency order », alors que
  `FORM-001` est fusionne : `git merge-base --is-ancestor 46a2890
  origin/refonte-multipages` sort 0, `docs/work-items/FORM-001.md:3` lit
  **DONE, proven end to end on the deployed preview on 2026-08-07**, et
  `CLAUDE.md` ecrit « Contact form: live since `FORM-001` ». Cinq autres items
  fusionnes manquent au tableau « Done » : `UI-003` (`03d26ca`), `UI-004`
  (`e6c60ef`), `UI-FIX-003` (`253df18`), `FORM-FIX-001` (`2e63bfc`) et
  `SITE-FIX-010` (`a1d7cd6`), tous verifies ancetres de
  `origin/refonte-multipages`. La date de tete, ligne 3, annonce encore
  « the close of 7 August 2026 » alors que la PR edite le fichier le 8 aout
  depuis une base du 8 aout. Le defaut precede la PR mais **cette PR reecrit les
  deux tableaux** : elle ajoute `SITE-FIX-007` et `SEO-FIX-001` a « Done » et
  retire deux lignes de « Open », donc le fichier etait ouvert et l'index a ete
  curate a moitie. Une session fraiche qui lit ce backlog, ce qui est
  exactement son role declare a la ligne 3, conclut que le formulaire de contact
  reste a construire.
  -> Deplacer `FORM-001` vers « Done », y ajouter les cinq autres, et rafraichir
  la date de tete. C'est le meme piege que le fichier decrit lui-meme sous
  « Watch the D-numbers », applique au statut des items au lieu des numeros.

- [ ] **[IMPORTANT]** `.claude/personalities/REVIEWER.md:61` - **La ligne
  reecrite par cette PR pour imposer le « Suite » le laisse tomber deux
  propositions plus loin, dans la meme phrase.** Elle lit « Papillon Collection
  Solution, Papillon HR Suite, **Papillon Corporate Finance Suite**, which keeps
  its "Suite" per `CLAUDE.md`, D017 and D031 », puis « it was replaced by
  **Papillon Corporate Finance** ». `CLAUDE.md:258` verrouille le nom complet et
  D017 puis D031 l'ont deja retabli une fois. C'est un defaut neuf, la ligne
  entiere etant reecrite par `c7cc75f`, et il est dans le fichier meme dont D127
  dit qu'il ne contredit plus `CLAUDE.md`. Un reviewer seme avec cette ligne y
  lit le nom ampute une fois sur deux.
  -> Ecrire « it was replaced by Papillon Corporate Finance Suite ».

- [ ] **[IMPORTANT]** `docs/work-items/UI-FIX-004.md:13-14` et `:45-46` - **La
  citation presentee comme la phrase du reviewer desaccentue les deux chaines
  francaises dont l'item a fait son sujet.** Le document ecrit
  `Societe par Actions Simplifiee Unipersonnelle` et
  `Derriere la pharmacie Redemption` ; la source,
  `docs/reviews/I18N-FIX-001-review.md:219-220`, ecrit
  `Société par Actions Simplifiée Unipersonnelle` et
  `Derrière la pharmacie Rédemption`, et ce sont les formes accentuees qui sont
  rendues :
  `grep -c "Société par Actions Simplifiée Unipersonnelle" dist/en/legal-notice/index.html`
  donne 1, la forme desaccentuee donne **0**. L'item existe pour poser un `lang`
  inline sur ces fragments precis ; la session qui l'executera cherchera des
  chaines qui n'existent nulle part dans le depot. La ligne 43 attenue en
  demandant d'enumerer par la mesure, elle n'annule pas une citation alteree.
  -> Retablir les accents dans le bloc cite et dans la liste des lignes 45-46.
  La regle de desaccentuation du depot porte sur la prose, pas sur une chaine
  entre backticks qui doit rester greppable.

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:139-150` - **Le saut D124 a D126 n'est
  explique nulle part, dans le fichier dont c'est la convention de les
  expliquer.** Le tableau passe de D123 a D127 ; deux autres sauts du meme
  fichier portent leur note, « D033 to D035 are reserved by `SITE-FIX-001` »
  (ligne 140) et « D115 to D118 are reserved by `SITE-FIX-011` » (ligne 145),
  cette derniere ajoutee par cette PR meme. `grep -n "D124\|D125\|D126"
  docs/DECISIONS.md` ne renvoie rien. Les trois numeros sont bien reserves :
  ils sont pris par `I18N-FIX-003` sur `origin/fix/typographie-des-libelles-anglais`,
  verifie par `git grep` sur toutes les branches distantes.
  `docs/work-items/I18N-FIX-002.md:31-34` l'explique en prose, mais D109 fait du
  journal l'endroit ou la reserve se lit, et c'est le journal qui est muet.
  -> Ajouter la note, sur le modele des deux autres, en nommant `I18N-FIX-003`
  et sa branche.

- [ ] **[IMPORTANT]** `docs/work-items/PAGE-003.md:12` et
  `docs/reviews/I18N-FIX-002-review.md:157` - **La plage de lignes citee ne
  correspond pas au texte cite.** Les deux fichiers annoncent
  `docs/reviews/I18N-FIX-001-review.md:184-194`. Mesure : la citation commence a
  `pageTagline.productsPcs` passe de`, qui est ligne **183**, et s'arrete a
  « ...disparait de la navigation anglaise. », qui tombe ligne **191** ; les
  lignes 192 a 194, incluses dans la plage, portent un texte que la citation ne
  reproduit pas (`CLAUDE.md veut une readaptation...` et la proposition
  `Insurance premium collection in the CIMA zone`). La plage est donc courte
  d'une ligne au debut et longue de trois a la fin. L'erreur nait dans le
  fichier de revue et a ete recopiee dans le work item sans etre verifiee, ce
  qui est la mecanique meme que ce fil combat.
  -> Corriger en `:183-191` dans les deux fichiers, ou retirer la plage et ne
  garder que le nom du fichier, la citation etant verbatim et donc greppable.

### Suggestions

- **[SUGGESTION]** `src/i18n/en.ts:3-46` - Le commentaire d'en-tete reste en
  anglais alors que `CLAUDE.md` demande les commentaires de code en francais, et
  que les commentaires voisins du meme fichier (`availability`, `ogSubtitle`)
  sont en francais. Constat identique aux rondes 1 et 2, non traite, ce qui est
  le droit d'une suggestion. Reste un arbitrage du fondateur : le bloc documente
  une adaptation anglaise et cite des chaines anglaises.

- **[SUGGESTION]** `src/i18n/en.ts:35-38` - Le `node -e` prescrit calcule
  `h.indexOf("</head>")` et decoupe a partir de la. Si `</head>` venait a
  disparaitre du HTML produit, `indexOf` renvoie `-1` et `slice(-1)` ne garde
  que le dernier caractere : la commande sortirait silencieusement zero page au
  lieu d'echouer. Elle fonctionne aujourd'hui, verifiee telle quelle. Un garde
  d'une ligne la rendrait franche.

- **[SUGGESTION]** `docs/work-items/I18N-FIX-001.md:64` - « **Two rewrites of
  that comment shipped false** » compte comme reecriture la version d'origine.
  Sur les quatre versions que D119 enumere, la premiere, `12025d9`, cree le bloc
  et ne reecrit rien ; les deux qui ont ete publiees sont donc une creation et
  une reecriture. Sans consequence pratique, mais c'est un compte, dans le
  document dont le sujet est qu'un compte s'ecrit mesure.

### Correctness (code-review skill)

Passe generique executee via `code-review:code-review` sur la PR #39, nom
pleinement qualifie, sans option (D082). Le controle d'eligibilite du plugin a
repondu **NOT ELIGIBLE**, la PR portant deja les commentaires de revue des
rondes 1 et 2 ; la passe a ete conduite quand meme, `c7cc75f` etant arrive
depuis, et l'etape 8 de publication a ete laissee de cote pour cette raison. Le
present fichier reste l'enregistrement durable.

Cinq agents de revue en parallele : conformite `CLAUDE.md`, balayage de defauts
sur le diff seul, contexte d'historique `git`, commentaires des PR anterieures,
et guidance portee par les commentaires de code.

Constats retenus apres verification contre le code, tous deja portes ci-dessus
et non dupliques :

- **[IMPORTANT]** `.claude/personalities/REVIEWER.md:61` - « Suite » perdu sur
  la seconde mention. Verifie contre `CLAUDE.md:258` et contre le contenu de
  la ligne avant `c7cc75f`.
- **[IMPORTANT]** `docs/BACKLOG.md:54` - `FORM-001` ouvert alors qu'il est
  fusionne. Verifie par `git merge-base --is-ancestor`, plus cinq items absents
  de « Done ».
- **[IMPORTANT]** `docs/work-items/UI-FIX-004.md:13-14` - citation
  desaccentuee. Verifie par `grep` sur `dist/en/legal-notice/index.html`.
- **[IMPORTANT]** `docs/DECISIONS.md:139-150` - saut D124 a D126 sans note.
  Verifie par `git grep` sur les branches distantes.
- **[IMPORTANT]** `docs/work-items/PAGE-003.md:12` - plage de lignes fausse.
  Verifie par `awk` sur la source.

Constats remontes par la passe puis **ecartes** apres verification, pour que le
prochain lecteur n'ait pas a les reinstruire :

- « Les nouvelles D-rows rendent toutes comme des lignes de tableau valides,
  sept barres chacune » : **ecarte, et l'inverse est vrai pour D127.** Compter
  les barres verticales ne mesure pas la structure d'un bloc Markdown. Passe au
  rendu reel de GitHub, D127 sort en `<p>`. C'est le premier constat important
  ci-dessus, trouve par une autre voie.
- « Le commentaire d'en-tete de `en.ts` viole la regle des commentaires en
  francais » : reclasse en suggestion, defaut preexistant, deja arbitre ainsi
  aux rondes 1 et 2, et regle ambigue sur ce cas precis.
- « Neuf pages anglaises portent les sigles nus sans les developper » : ecarte
  comme defaut. Mesure a la main sur `dist/en`, corps hors `<head>` : toutes les
  occurrences nues restantes sont des titres, des `meta.*`, des taglines de
  navigation ou le pied de page partage, c'est-a-dire les categories que le
  commentaire nomme comme exemptees par contrainte de place. Aucun paragraphe de
  corps ne laisse un sigle nu en argumentant le point reglementaire.
- « `pageTagline.productsPcs` contredit la definition de PCS dans `CLAUDE.md` » :
  ecarte, decision explicite du fondateur consignee en D123 avec sa consequence,
  et `PAGE-003` porte l'elargissement. D123 previent nommement la session qui
  voudrait corriger ce point a rebours.
- « La tagline PCS diverge entre `fr.ts` et `en.ts` » : ecarte, divergence
  reelle mais explicitement dans le perimetre de `PAGE-003`, avec les deux
  emplacements francais cites.

### Summary

Le blocker de la ronde 2 est leve, et bien leve : l'auteur a change le mode
grammatical du commentaire plutot que sa formulation, a balaye une clause fausse
que personne n'avait signalee, et a supprime le compte de versions, si bien que
la classe de defaut qui a survecu a quatre reecritures n'a plus de surface ou
vivre. Le site est propre a tous les postes mesures : build vert, parite exacte
a 176 cles, palette, garde-fous editoriaux, SEO, accessibilite et fidelite a la
maquette. Ce qui bloque est entierement documentaire et tient a une chose : la
PR a livre `SITE-FIX-007` et redige cinq D-rows sans relire ce qu'elle laissait
autour, si bien que D127 ne rend pas comme une ligne de tableau, que le backlog
annonce encore le formulaire de contact comme un travail a faire, et que la
ligne meme qui impose le « Suite » le laisse tomber a sa seconde mention.
