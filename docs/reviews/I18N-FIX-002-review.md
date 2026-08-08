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
