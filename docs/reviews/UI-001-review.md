# UI-001 - Revue

Item : `docs/work-items/UI-001.md`. Branche : `feat/surfaces-claires`. PR #15.
Base : `refonte-multipages` a `480d4d4`.

---

## Round 1 - 2026-07-31

**Verdict**: CHANGES REQUESTED

### Ce qui a ete verifie, et comment

Revue conduite dans un worktree independant forke sur `origin/feat/surfaces-claires`
(`fac23a3`), en lecture seule sur les sources.

- `npm ci`, puis `npm run build` : vert, 26 pages, sitemap genere. `npm run check` :
  0 erreur, 0 avertissement, 0 indice sur 60 fichiers. Aucun `any`, aucun
  `@ts-ignore`, aucun affaiblissement de `Dictionary` dans le diff.
- `npm run preview` servi sur le port 4331, pilote via `chrome-devtools-mcp`.
  Rendu controle en FR et en EN, a 360px, 768px et 1440px, sur `/`, `/services`,
  `/produits`, `/en/about` et `/en/legal-notice`.
- Les onze ratios annonces ont ete **recalcules independamment** avec la formule
  sRGB de la WCAG, puis **releves sur la page rendue** via les styles calcules.
  Tous concordent : `.section-label` 10.03:1, `.footer-legal p` et
  `.footer-legal-links a` 5.90:1, `.nav-menu-tagline` 5.22:1,
  `.leadership-label` 7.87:1. Les valeurs commentees dans `tokens.css`
  (5.06, 5.65, 3.25, 3.63, 5.35, 5.98, 2.53, 2.76) sont exactes a 0.03 pres.
- Le diff sur les composants ne modifie **que** des declarations `color`. Aucune
  propriete de mise en page, de fonte ou d'espacement n'est touchee : la
  non-regression visuelle est structurellement acquise, et les captures le
  confirment.
- Fondation dormante verifiee en la reveillant : `.section--light` injectee au
  runtime sur des sections reelles de `/`, `/produits` et `/services`. Le
  peritexte fonctionne pour les primitives globales (fond creme, cartes
  blanches, bordure `--navy-08`, titres `--navy-text`, eyebrows et liens
  `--gold-deeper`). `.card--prominent` de `ServiceCard` **ne** met **pas** en
  echec `.section--light .card` sur `/services` : verifie, la carte passe bien
  en blanc avec titre navy.
- Prototypes relus via `DesignSync` a la **racine** du projet
  `53d1c228-d274-4df3-8022-1a427dd96c15`. Le decompte de `CLAUDE.md` est juste :
  13 pages `.dc.html` plus `Header` et `Footer` a la racine, 11 pages dans le
  dossier fige, qui n'a effectivement ni `mentions-legales` ni `confidentialite`.
  Chaque valeur extraite dans `tokens.css` correspond au prototype au chiffre
  pres : `rgba(251,249,244,0.94)`, `rgba(26,39,64,.08)`, `rgba(26,39,64,.1)`,
  `rgba(26,39,64,.15)`, `0 20px 50px rgba(26,39,64,.14)`, `#3A4256`, `#B8791E`,
  `#1A2740`, `#FFFFFF`. Le rejet de `#8A93A6` est correctement documente.
- Garde-fous editoriaux et marque : aucun prix, aucun nom de client, aucune date
  exacte, aucune mention d'ALTARYS ENTERPRISE, aucun violet, aucun ambre, aucun
  teal, aucun hexadecimal en dur dans un composant. La page A propos ne nomme
  qu'Emmanuel Blonvia. Aucun tiret cadratin ni point median dans les lignes
  ajoutees. Aucune cle de dictionnaire, aucune route, aucune page touchee : la
  parite FR / EN est inchangee. `package.json`, `wrangler.jsonc`,
  `astro.config.mjs` et `/functions` ne sont pas dans le diff. La PR vise bien
  `refonte-multipages`.
- **Le plugin `code-review` n'est pas installe sur ce depot** : `installed_plugins.json`
  ne l'enregistre que pour `renew-insurance`, et il n'apparait pas dans les
  competences de cette session. La passe de correctness generique a donc ete
  conduite a l'equivalent, par un agent adversarial dedie sur le diff, dont les
  candidats ont tous ete reconfirmes ou ecartes a la main. Les resultats retenus
  sont dans la sous-section dediee plus bas. A signaler au fondateur : installer
  le plugin sur ce depot pour que la procedure de `.claude/commands/review.md`
  soit executable telle qu'ecrite.

Le travail est serieux. Les mesures sont justes, la separation fondation / bascule
est le bon decoupage, et la correction des contrastes est reelle et verifiee en
page. Ce qui bloque tient a trois choses : une decision de la PR qui n'est
appliquee qu'a moitie, et deux surfaces d'interaction que la famille claire
laisse sous le seuil de contraste non textuel.

### Blockers

- [ ] **[BLOCKER]** `.claude/personalities/TECH_LEAD.md:35` - D031 corrige la
  reference visuelle dans `CLAUDE.md` parce que le dossier fige
  `design_handoff_altaryslabs_refonte/` avait deja fait construire la page A
  propos en tout-navy le jour ou la refonte claire arrivait. Mais **le fichier
  que le prochain auteur lit reellement pour choisir son prototype n'est pas
  corrige** : l'etape 7 de `TECH_LEAD.md` dit toujours « folder
  `design_handoff_altaryslabs_refonte`: 11 FR pages plus a shared Header and
  Footer ». Idem `.claude/personalities/REVIEWER.md:72` et
  `.claude/commands/review.md:73`, qui envoient le relecteur comparer contre le
  dossier fige. La cause exacte de l'incident que D031 pretend fermer reste donc
  ouverte dans les trois documents de procedure.
  -> Repercuter la meme correction dans `TECH_LEAD.md:35`, `REVIEWER.md:72` et
  `review.md:73` : racine du projet, 13 pages plus `Header` et `Footer`, et la
  phrase d'avertissement sur le dossier fige.

- [ ] **[BLOCKER]** `src/styles/global.css:47` - L'indicateur de focus clavier
  n'est pas adapte aux surfaces claires. `:focus-visible { outline: 2px solid
  var(--gold) }` n'est pas repris sous `.section--light`. **Mesure en page**, en
  injectant `.section--light` sur une section de `/produits` puis en donnant le
  focus a un `.link-arrow` : `rgb(200, 146, 42)` sur `rgb(246, 242, 233)`, soit
  **2.47:1**, et 2.76:1 sur `--surface`. Le seuil WCAG 2.1 pour un indicateur de
  focus est de 3:1 (SC 1.4.11, SC 2.4.11). C'est le seul reperage clavier du
  site, et il devient invisible sur toute la moitie claire au moment de UI-002.
  L'item se donne precisement pour perimetre « la famille de surfaces claires et
  les regles qui vont avec », et `--gold-deep` (3.25:1 sur creme) est deja defini
  et deja utilise pour le focus des champs.
  -> Ajouter `.section--light :focus-visible { outline-color: var(--gold-deep) }`,
  avec le ratio en commentaire comme partout ailleurs dans cette PR.

- [ ] **[BLOCKER]** `src/styles/global.css:487` - `.section--light .btn-secondary`
  redeclare `border-color: var(--gold-40)`, c'est-a-dire **la valeur de la
  surface sombre**, identique a la regle de base ligne 249. Compose sur `--cream`,
  `rgba(200, 146, 42, 0.4)` donne `#E4CB9C`, soit **1.41:1** contre le fond : la
  limite du bouton secondaire n'est plus percevable. Le seuil pour la limite d'un
  composant d'interface est de 3:1 (SC 1.4.11). Le bouton secondaire est l'un des
  deux appels a l'action du hero.
  -> Utiliser `var(--gold-deep)` en pleine opacite pour la bordure sur clair
  (3.25:1 sur creme), ou une valeur navy dediee. La declaration actuelle est de
  toute facon sans effet, ce qui suggere que la bordure claire a ete oubliee
  plutot que choisie.

### Important

- [ ] **[IMPORTANT]** `src/components/LegalPage.astro:75` - `.legal-updated` et
  `.legal-prevails` sont inertes, et c'est un defaut visible en production, pas
  seulement une regle morte. **Verifie sur `/en/legal-notice`** : les deux
  paragraphes calculent `rgb(154, 167, 190)` a `14.5px`, `line-height 26.1px`,
  `margin-bottom 16px`, exactement comme un paragraphe de corps de texte.
  `.legal-body :global(p)` a (0,2,1) ecrase les deux regles a (0,2,0), donc la
  couleur, la taille, l'interlignage **et la separation de 40px** sont perdus.
  Resultat : sur quatre pages publiques, la ligne « Derniere mise a jour » et
  l'avertissement anglais de primaute du francais ne se distinguent plus du
  document. Le commentaire ajoute par la PR decrit exactement le mecanisme, ce
  qui est honnete, mais un defaut documente reste un defaut : la barre maximale
  bloque sur son existence, pas sur son origine.
  -> Deux temps. Ici : rien a coder, l'item n'a pas a changer le rendu des pages
  legales. Mais le suivi doit exister avant la fusion. Le relecteur est confine
  en ecriture a `docs/reviews/**` et ne peut pas le creer : **a la charge de
  l'auteur**, ouvrir `docs/work-items/UI-FIX-001.md` (collision de specificite
  dans `LegalPage`, restaurer les deux styles en montant la specificite ou en
  sortant les deux paragraphes de `.legal-body`) plus la ligne D033
  correspondante dans `docs/DECISIONS.md`, et referencer les deux ici.

- [ ] **[IMPORTANT]** `src/styles/global.css:478` - Le commentaire « Le badge
  plein garde l'or clair et le texte navy : deja 8.4:1 » est faux.
  `--navy-deep` sur `--gold-light` vaut **10.0:1**, ce que le meme fichier
  affirme correctement ligne 169 en donnant 10.03:1 pour ce couple exact. Deux
  chiffres contradictoires pour une meme paire dans un fichier de 500 lignes qui
  fait desormais autorite sur l'accessibilite du projet.
  -> Corriger en 10.0:1.

- [ ] **[IMPORTANT]** `src/styles/global.css:462` - Le peritexte clair ne couvre
  aucun etat de pseudo-classe. `ServiceCard.astro` pose
  `.card:hover { border-color: var(--ink-15) }` et `ProductCard.astro`
  `.card:hover { border-color: var(--gold-30) }` ; a (0,3,0) elles battent
  `.section--light .card` a (0,2,0) **inconditionnellement**, quel que soit
  l'ordre d'emission. Sur une carte blanche, `--ink-15` est de l'ivoire a 15%,
  donc pratiquement du blanc : l'affordance de survol disparait. C'est le pendant
  exact des deux blockers ci-dessus, sur une troisieme surface d'interaction.
  -> Ajouter les etats au peritexte, ou remonter le survol des cartes dans
  `global.css` pour qu'il soit couvert par `.section--light` comme le reste.

- [ ] **[IMPORTANT]** `src/styles/global.css:437` - Le peritexte gagne ses
  arbitrages a specificite egale **par ordre d'emission**, et cet ordre varie
  selon la route. Astro place les styles scopes de certains composants avant le
  bundle global et d'autres apres, et trois composants changent de cote d'une
  page a l'autre : `ProductCard` est avant global sur `/produits` et apres sur
  `/`, `ServiceCard` avant sur `/services` et apres sur `/`, `CtaBanner` avant
  sur `/a-propos` et apres sur seize autres pages. `.section--light .page-intro`
  (0,2,0) contre `.page-intro[data-astro-cid-b2i3gsw2]` (0,2,0) est aujourd'hui
  gagne par le global : verifie en page, `rgb(91, 100, 114)`. Mais c'est une
  victoire d'ordre, pas de specificite, sur une base qu'Astro ne garantit pas.
  UI-002 va etendre ce peritexte a tout le site sur cette fondation.
  -> Donner au peritexte une marge de specificite explicite, par exemple
  `.section--light.section--light .x`, ou isoler global.css et les styles de
  composants dans deux `@layer` ordonnees. A trancher maintenant, pas dans
  UI-002 : c'est la fondation qui doit porter la garantie.

- [ ] **[IMPORTANT]** `CLAUDE.md:82` - « The prototypes are wrong on six points »
  n'en enumere que cinq. Manque celui que `docs/work-items/UI-001.md` liste
  pourtant lui-meme : le hero anglais laisse sur l'ancien positionnement alors
  que le francais a change. Ce point n'a par ailleurs pas de ligne D, alors que
  les cinq autres en ont une. Un futur auteur qui recrera une page anglaise
  depuis le prototype reprendra donc l'ancien hero en croyant suivre `CLAUDE.md`.
  -> Ajouter le sixieme point a l'enumeration, ou aligner le nombre annonce sur
  ce qui est reellement liste.

### Correctness (passe generique, equivalent `code-review`)

- **[SUGGESTION]** `src/styles/tokens.css:73,87,94,96,98,100` - Six tokens
  introduits sans aucun consommateur : `--cream-header`, `--slate-nav`,
  `--navy-04`, `--navy-10`, `--navy-15`, `--shadow-menu`. Legitime pour une
  fondation dont l'item documente l'usage a venir (header et menus de UI-002),
  mais si UI-002 devait glisser, ce sont six valeurs mortes dans le fichier le
  plus lu du projet. A confirmer par le fondateur plutot qu'a corriger.
- **[SUGGESTION]** `src/styles/tokens.css:99` - `--shadow-card` code en dur
  `rgba(26, 39, 64, 0.04)` au lieu de `var(--navy-04)`, ce qui est justement la
  raison pour laquelle `--navy-04` n'a aucun consommateur. La regle « toujours un
  token » que cette meme PR ajoute a `CLAUDE.md` s'applique aussi a l'interieur
  de `tokens.css`.
- **[SUGGESTION]** `src/styles/global.css:479` - `.section--light .badge--solid`
  redeclare mot pour mot la paire de `.badge--solid` ligne 328. Declaration sans
  effet.
- **[SUGGESTION]** `src/styles/global.css:372` - `.list-diamond` et ses trois
  regles ne sont referencees par aucun composant. Code mort preexistant, expedie
  a chaque page. Au passage, `.list-diamond li` en `--muted-soft` donnerait
  2.61:1 sur creme : a couvrir ou a supprimer avant UI-002, pas apres.
- **[SUGGESTION]** `src/styles/global.css:532` - `.field-input:focus` utilise
  `:focus` et non `:focus-visible`, et `outline-offset: 1px` la ou tout le site
  est a `3px`. A (0,2,0) la regle bat le `:focus-visible` global, donc les champs
  afficheront un anneau au clic a la souris, seuls de tout le site.
- **[SUGGESTION]** `src/styles/tokens.css:85` - `--navy-text: #1a2740` duplique
  la valeur de `--navy-mid: #1a2740`. Aliasing semantique assume, mais deux noms
  pour une couleur finissent par diverger.
- **[SUGGESTION]** `src/styles/tokens.css:42` - `--ink-60` vaut `0.55`, pas
  `0.60`. Nom trompeur, preexistant, mais la PR en fait le token canonique du
  texte discret sur sombre et l'inscrit comme tel dans `CLAUDE.md` : c'est le bon
  moment pour le renommer ou pour commenter l'ecart.
- **[SUGGESTION]** `src/styles/tokens.css:62` - Apres les trois substitutions,
  `--gold-65` n'a plus aucun consommateur, et `--ink-25` non plus. `CLAUDE.md`
  eleve pourtant `--gold-65` au rang de regle normative. Une regle sur un token
  que personne n'utilise se perime vite.

Aucun `var(--x)` non defini, aucune accolade desequilibree, aucun import casse,
aucune liaison inutilisee, aucun bloc commente laisse en place, aucun secret.
Les commentaires ajoutes sont en francais, conformement a la regle du depot.

### Summary

Fondation solide et honnetement mesuree : les onze ratios annonces sont exacts,
verifies au calcul et sur la page rendue, la separation fondation / bascule est
le bon decoupage, et le diff sur les composants ne touche que des declarations
`color`, ce qui rend la non-regression visuelle structurelle. Trois choses
bloquent : D031 corrige la reference au dossier de maquettes fige dans
`CLAUDE.md` mais laisse la meme erreur dans `TECH_LEAD.md`, `REVIEWER.md` et
`review.md`, c'est-a-dire dans les fichiers qui pilotent reellement le prochain
auteur ; et la famille claire, dont l'accessibilite est le coeur de l'item,
expedie l'anneau de focus a 2.47:1 et la bordure du bouton secondaire a 1.41:1,
tous deux sous le seuil de 3:1 des elements non textuels. La collision de
specificite de `LegalPage` est reelle et visible sur quatre pages publiques ;
elle n'a pas a etre corrigee ici, mais son item de suivi doit exister avant la
fusion.

---

## Round 2 - 2026-07-31

**Verdict**: CHANGES REQUESTED

Base : `refonte-multipages` a `480d4d4`. Tete relue : `798c104`.

### Ce qui a ete verifie, et comment

Revue conduite dans un worktree independant forke sur `origin/feat/surfaces-claires`
(`798c104`), en lecture seule sur les sources.

- `npm ci`, puis `npm run build` : vert, 26 pages, `sitemap-0.xml` a 26 URL.
  `npm run check` : 0 erreur, 0 avertissement, 0 indice sur 60 fichiers. Aucun
  `any`, aucun `@ts-ignore`, aucun affaiblissement de `Dictionary` dans le diff.
- `npm run preview` servi depuis le worktree de revue sur le port 4334, pilote
  par une instance Chrome isolee via le protocole DevTools. Captures en FR et en
  EN a 360px, 768px et 1440px sur `/`, `/produits`, `/services`, `/a-propos`,
  `/mentions-legales`, `/en`, `/en/products`, `/en/about`, `/en/legal-notice`.
  Le site rendu est integralement navy : la fondation est bien dormante, aucune
  page ne porte `.section--light`, aucune regression de mise en page.
- **Balayage de contraste automatise sur les 10 pages ci-dessus**, tous les
  elements textuels visibles, avec composition alpha sur la pile de fonds :
  **zero echec AA**. Les onze corrections annoncees produisent bien leur effet
  en production ; le bandeau legal du pied de page, a 2.09:1 avant, est
  redevenu lisible sur la capture.
- **Les trois blocages du Round 1 sont fermes, chacun remesure sur la page** en
  forcant la pseudo-classe via le protocole DevTools, fondation reveillee :
  - anneau de focus sur clair : `outline-color` calcule `rgb(184, 121, 30)`,
    solid, 2px, offset 3px, soit **3.63:1** sur `--surface` et **3.25:1** sur
    `--cream`. Au-dessus du seuil de 3:1. Sur sombre il reste a 6.86:1 ;
  - bordure du bouton secondaire sur clair : `rgb(184, 121, 30)`, **3.25:1**
    contre `--cream`, et le libelle a 5.06:1 ;
  - le pointeur vers le dossier fige est corrige dans les quatre documents,
    `CLAUDE.md`, `TECH_LEAD.md`, `REVIEWER.md` et `review.md`.
- Le cran de specificite `.section--light.section--light` fonctionne comme
  annonce : survol de carte sur clair mesure a `rgb(184, 121, 30)`, **3.25:1**,
  donc le `.card:hover` scope de `ProductCard` a (0,3,0) est bien battu par les
  (0,4,0) du peritexte. Les valeurs de specificite du commentaire sont exactes.
  Avertissement de methode pour la prochaine ronde : `.card` et `.link-arrow`
  portent une `transition` sur `border-color` et sur `color`, donc un releve de
  style calcule pris immediatement apres l'injection de la classe renvoie la
  valeur de depart. Il faut attendre la fin de la transition, sans quoi on
  conclut a tort que le peritexte perd.
- Fidelite au prototype verifiee token par token via `DesignSync` a la racine du
  projet `53d1c228-d274-4df3-8022-1a427dd96c15` : `#F6F2E9`, `#FFFFFF`,
  `rgba(26,39,64,.08)`, `0 1px 3px rgba(26,39,64,.04)`, `rgba(26,39,64,.1)`,
  `rgba(26,39,64,.15)`, `0 20px 50px rgba(26,39,64,.14)`, `rgba(251,249,244,0.94)`,
  `#3A4256`, `#1A2740`, `#5B6472`. Tous presents et exacts. Le badge plein sur
  clair du prototype, `#07111E` sur `#E5B55A`, est reproduit au chiffre pres.
  Les deux divergences volontaires, `#B8791E` remplace par `#8B5E1B` pour le
  texte et `#8A93A6` ecarte, sont conformes a D030. Le decompte de 13 pages plus
  `Header` et `Footer` a la racine est exact.
- SEO et deploiement, verifies bien qu'absents du diff : `public/og-image.png` et
  `public/og-image-en.png` existent, `hreflang` reciproque et `x-default` presents,
  `robots.txt` coherent, sitemap a 26 URL, bloc D1 toujours neutralise et sans
  virgule parasite apres `pages_build_output_dir`, pas de `CNAME`, aucun secret
  dans le diff. La PR vise bien `refonte-multipages`.
- Garde-fous editoriaux et marque : aucun prix, aucun nom de client, aucune date
  exacte, aucun ALTARYS ENTERPRISE, aucun violet, aucun ambre, aucun teal, aucun
  hexadecimal en dur hors de `tokens.css`. PCS reste "Disponible T3 2026" depuis
  la constante du dictionnaire, "Papillon Corporate Finance Suite" garde son
  "Suite" sur la page rendue comme dans `fr.ts` et `en.ts`, la page A propos ne
  nomme qu'Emmanuel Blonvia. Aucun tiret cadratin ni point median dans les lignes
  ajoutees. Aucune cle de dictionnaire ni route touchee : la parite FR / EN est
  inchangee.
- **Le plugin `code-review` n'est toujours pas installe sur ce depot** :
  `installed_plugins.json` ne l'enregistre que pour le projet `renew-insurance`.
  La passe de correctness generique a de nouveau ete conduite a l'equivalent, par
  un agent adversarial dedie, dont chaque candidat a ete reconfirme a la main
  avant promotion. Point de procedure a trancher par le fondateur, deuxieme
  ronde consecutive.

### Etat des points du Round 1

Les trois blocages sont fermes. Les six points importants sont traites : le
peritexte est double, les etats de survol sont couverts, le commentaire du badge
passe a 10.0:1, le sixieme ecart avec les prototypes est ajoute a `CLAUDE.md`, et
`docs/work-items/UI-FIX-001.md` plus la ligne de decision existent. Le R1
demandait "la ligne D033" ; la ligne livree est D038, ce qui est correct sur le
fond. Le R1 n'est pas modifie, la reconciliation est enregistree ici.

Cinq suggestions du R1 restent ouvertes et sont reprises plus bas ; deux ont ete
fermees, `--shadow-card` compose desormais depuis `var(--navy-04)` et l'alias
`--navy-text` est commente.

Ce qui bloque au Round 2 est nouveau, et tient d'abord a un defaut introduit par
la PR dans le journal de decisions lui-meme.

### Blockers

- [ ] **[BLOCKER]** `docs/DECISIONS.md:47` et `docs/DECISIONS.md:53` - Deux lignes
  vides inserees a l'interieur du tableau le cassent en trois fragments. En
  Markdown GitHub un tableau se termine a la premiere ligne vide, et une suite de
  lignes `| ... |` sans couple en-tete plus separateur n'est plus un tableau.
  **Verifie en soumettant le fichier au moteur de rendu de GitHub** (`POST
  /markdown`, mode `gfm`) : la sortie contient **un seul `<table>`**, qui
  s'arrete a D027, puis **deux `<p>`** contenant D028 a D032 et D036 a D038 en
  texte brut avec les barres verticales. Les onze lignes que cette PR ajoute,
  c'est-a-dire exactement celles qui verrouillent la palette a deux surfaces, les
  deux regles d'accessibilite, le nom du produit et la reference visuelle, ne
  s'affichent plus comme des decisions dans le journal que `CLAUDE.md` et
  `docs/AI_Development_Workflow.md` designent comme la memoire du projet. La
  premiere ligne vide vient de `fac23a3`, la seconde de `798c104` : les deux sont
  des lignes ajoutees par cette PR.
  -> Supprimer les deux lignes vides, lignes 47 et 53, pour que les lignes D028 a
  D038 rejoignent le tableau ouvert ligne 18.

### Important

- [ ] **[IMPORTANT]** `src/styles/global.css:509` - La famille claire couvre
  `.btn-secondary` et laisse `.btn-primary` sans traitement. **Mesure en page**,
  bouton injecte dans une section reveillee : le remplissage `--gold` vaut
  **2.47:1** contre `--cream` et **2.63:1** contre `--cream-header`, sous le seuil
  de 3:1 de SC 1.4.11 que cette PR applique elle-meme, commentaire a l'appui, a la
  bordure du bouton secondaire et a l'anneau de focus. Le libelle interieur reste
  a 6.86:1, donc le bouton se lit ; c'est sa limite contre la page qui disparait.
  Ce n'est pas un cas theorique : le `Header.dc.html` du prototype pose exactement
  ce bouton, `#C8922A` plein, sur un fond `rgba(251,249,244,0.94)`, et c'est le
  premier appel a l'action commercial de chaque page. L'asymetrie entre les deux
  boutons n'est documentee nulle part.
  -> Trancher explicitement dans cet item, qui est celui de la fondation : soit
  ajouter une limite `1px solid var(--gold-deep)` au bouton plein sur clair, soit
  assombrir le remplissage sur clair, soit enregistrer une ligne de decision qui
  assume l'ecart. Ne pas laisser UI-002 decouvrir la question page par page.

- [ ] **[IMPORTANT]** `src/styles/global.css:445` - Le peritexte clair ne couvre
  que les primitives globales, alors que le commentaire d'ouverture annonce que
  l'on "redefinit les couleurs des composants" plutot que de les dupliquer. Les
  classes propres aux composants de page restent sur les jetons de surface
  sombre. **Releve sur la page, fondation reveillee sur les sections de contenu**,
  huit classes distinctes sur quatre pages :

  | Page | Classe | Ratio sur clair |
  |---|---|---|
  | `/` | `.about-text` | 1.05:1 |
  | `/a-propos` | `.leadership-name` | 1.07:1 |
  | `/a-propos` | `.leadership-label` | 1.89:1 |
  | `/a-propos` | `.about-team` | 2.17:1 |
  | `/a-propos` | `.leadership-role` | 2.91:1 |
  | `/a-propos` | `.legal-line` | 2.61:1 |
  | `/produits/papillon-hr-suite` | `.module-label` | 1.02:1 |
  | `/produits/papillon-hr-suite` | `.roadmap-intro` | 2.17:1 |

  `/produits` et `/services`, qui n'utilisent que des primitives globales,
  passent a zero echec : la fondation est juste, elle est simplement incomplete.
  La section "Out of scope" de `docs/work-items/UI-001.md` liste le fond par
  defaut, le header, le pied de page, les pages et les dictionnaires, mais pas
  les couleurs propres aux composants de page. L'omission n'est donc ni
  documentee ni tracee.
  -> Soit etendre le peritexte a ces huit classes, soit restreindre le
  commentaire et inscrire cette liste dans "Out of scope" et dans le perimetre de
  UI-002, pour qu'elle ne soit pas redecouverte page par page.

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:54` - Le journal saute de D032 a D036.
  D033, D034 et D035 n'existent **sur aucune branche**, locale ou distante :
  verifie par `git show <ref>:docs/DECISIONS.md` sur la totalite des references.
  `docs/AI_Development_Workflow.md:188` demande de relever le plus haut numero
  avant d'en attribuer un nouveau ; le plus haut etait D032. Trois numeros sont
  desormais brules sans ligne, et un lecteur futur ne peut pas distinguer un saut
  volontaire de trois lignes perdues dans une fusion.
  -> Renumeroter en D033, D034 et D035, et repercuter les references dans
  `src/styles/global.css`, `CLAUDE.md`, `docs/work-items/UI-FIX-001.md` et le
  present fichier ; ou, a defaut, ajouter une ligne de note expliquant le saut.

- [ ] **[IMPORTANT]** `CLAUDE.md:81` - "The prototypes are wrong on six points"
  cite six numeros de decision, `D017, D020, D029, D030, D032 et D037`, mais ils
  ne couvrent que cinq des six points : point 1 par D020, point 2 par D017, point
  4 par D032, point 5 par D029 et D030 a la fois, point 6 par D037. **Le point 3,
  "the HR page keeps the softened OHADA coverage wording and no MVP jargon", n'a
  aucune ligne de decision** : recherche faite dans `docs/DECISIONS.md` sur MVP,
  HR Suite, "17 countries" et couverture, rien. C'est exactement la classe de
  defaut que D037 vient de fermer sur ce meme paragraphe : une enumeration dont
  le decompte annonce ne correspond pas a ce qui est reellement adosse a une
  decision. Le point 3 est aussi celui qui engage le plus la credibilite, puisque
  c'est un arbitrage sur une affirmation commerciale de couverture OHADA.
  -> Ouvrir la ligne de decision manquante pour le point 3, ou retirer son numero
  du renvoi et dire explicitement qu'il repose sur un arbitrage du fondateur non
  encore consigne.

- [ ] **[IMPORTANT]** `docs/work-items/UI-001.md:5` - "**Decisions** D028 to D032"
  est desormais incomplet : `docs/DECISIONS.md:54` et `:55` attribuent aussi D036
  et D037 a UI-001. Le document de suivi de l'item donne donc un jeu de decisions
  tronque, sur l'item meme qui vient de faire de l'exhaustivite des renvois un
  sujet, en ouvrant D037.
  -> Etendre la mention aux lignes reellement portees par l'item.

### Correctness (passe generique, equivalent `code-review`)

Le plugin n'etant pas installe sur ce depot, la passe a ete conduite par un agent
adversarial dedie sur le diff, puis chaque candidat reconfirme a la main contre
le code. Les faux positifs sont ecartes. Les defauts de fond remontes par cette
passe sont deja portes plus haut, en blocage ou en point important ; ce qui suit
est le reste.

- **[SUGGESTION]** `src/styles/global.css:500` - `.section--light.section--light
  .badge--solid` redeclare mot pour mot la paire de `.badge--solid` ligne 328, et
  rien ne s'interpose entre les deux : la regle est sans effet. Le commentaire qui
  l'accompagne affirme une intention, "le badge plein garde l'or clair", que le
  CSS n'impose pas puisqu'il ne surcharge rien. Assumer la redondance comme
  auto-documentation est defendable, mais alors le commentaire doit le dire.
- **[SUGGESTION]** `src/styles/global.css:476` - Le second membre de la paire de
  selecteurs, `.section--light.section--light .card--service`, est mort :
  `.card--service` n'est jamais emis sans `.card` (`ServiceCard.astro:25`,
  `AboutContent.astro:43`), et le membre `.card` de la ligne 475, a specificite
  identique, couvre deja ces elements avec les memes declarations.
- **[SUGGESTION]** `src/styles/global.css:564` - `.field-input:focus` et ses deux
  voisines utilisent `:focus` et non `:focus-visible`, et `outline-offset: 1px` la
  ou tout le site est a `3px`. A (0,2,0) elles battent le `:focus-visible` global
  a (0,1,0). Point deja souleve au R1, toujours ouvert. Ces regles sont posees
  precisement pour le lot FORM : l'argument "rien ne s'affiche encore" ne les
  couvre pas, elles s'afficheront telles quelles.
- **[SUGGESTION]** `src/styles/tokens.css:45,65,73,90,99,101,105` - Sept jetons
  sans consommateur : `--cream-header`, `--slate-nav`, `--navy-10`, `--navy-15`
  et `--shadow-menu`, introduits par cette PR pour UI-002 ; plus `--gold-65` et
  `--ink-25`, rendus orphelins par les substitutions de cette PR et desormais
  cites uniquement dans des commentaires. Les deux derniers sont le point
  sensible : `CLAUDE.md:142` et `:145` en font des regles normatives, or une
  regle portant sur un jeton que personne n'utilise se perime sans bruit. Point
  deja souleve au R1, toujours ouvert.
- **[SUGGESTION]** `src/styles/global.css:374` - `.list-diamond` et ses trois
  regles ne sont referencees par aucun composant. Code mort preexistant, expedie a
  chaque page. `.list-diamond li` en `--muted-soft` vaudrait 2.61:1 sur creme,
  ratio confirme en page sur `.legal-line` qui porte la meme couleur : a couvrir
  ou a supprimer avant UI-002. Point deja souleve au R1, toujours ouvert.
- **[SUGGESTION]** `src/styles/tokens.css:42` - `--ink-60` vaut `0.55`, pas
  `0.60`. Nom trompeur, preexistant, mais cette PR en fait le jeton canonique du
  texte discret sur sombre et l'inscrit comme tel dans `CLAUDE.md`. Point deja
  souleve au R1, toujours ouvert.
- **[SUGGESTION]** Procedure - Installer le plugin `code-review` sur ce depot,
  pour que l'etape 6 de `.claude/commands/review.md` soit executable telle
  qu'ecrite. Deuxieme ronde consecutive ou elle est remplacee par un equivalent.

Verifie et propre : aucun `var(--x)` non defini sur l'ensemble de `src/` et de
`functions/`, accolades equilibrees, aucun selecteur malforme, aucun import
casse, aucun bloc commente laisse en place, aucun secret. Les commentaires
ajoutes sont en francais et les documents de specification en anglais,
conformement a la regle du depot. Le diff sur les sept composants ne touche que
des declarations `color`. La collision de specificite de `LegalPage` est bien
decrite par `UI-FIX-001.md` : `.legal-body :global(p)` compile en (0,2,1) et bat
les deux regles a (0,2,0).

### Summary

Les trois blocages du Round 1 sont fermes et remesures sur la page : anneau de
focus a 3.63:1 sur blanc et 3.25:1 sur creme, bordure du bouton secondaire a
3.25:1, pointeur vers le dossier de maquettes fige corrige dans les quatre
documents de procedure. Le balayage de contraste automatise sur dix pages, FR et
EN, ne trouve plus aucun echec AA, et le site rendu reste integralement navy :
la fondation est bien dormante et sans regression. Ce qui bloque desormais est un
defaut que la PR a introduit dans le journal de decisions : deux lignes vides
cassent le tableau en trois, et le moteur de rendu de GitHub confirme que les
onze lignes ajoutees par cet item ne s'affichent plus comme des decisions. S'y
ajoutent quatre points importants, dont deux trous de couverture de la famille
claire, le bouton primaire a 2.47:1 sur creme et huit classes de composants
laissees sur les jetons de surface sombre, a trancher dans la fondation plutot
que page par page dans UI-002.

---

## Round 3 - 2026-07-31

**Verdict**: CHANGES REQUESTED

Base : `refonte-multipages` a `480d4d4`. Tete relue : `0fd25ad`.

### Ce qui a ete verifie, et comment

Revue conduite dans un worktree independant forke sur `origin/feat/surfaces-claires`
(`0fd25ad`), en lecture seule sur les sources.

- `npm ci`, puis `npm run build` : vert, 26 pages, `sitemap-0.xml` a 26 URL.
  `npm run check` : 0 erreur, 0 avertissement, 0 indice sur 60 fichiers. Aucun
  `any`, aucun `@ts-ignore`, aucun affaiblissement de `Dictionary` dans le diff.
- `npm run preview` servi depuis le worktree de revue sur le port 4337, pilote
  via `chrome-devtools-mcp`. Rendu controle en FR et en EN a 360px, 768px et
  1440px. Le site rendu est integralement navy : la fondation est bien dormante.
  Verifie par grep que ni `.section--light` ni aucune classe `.field-*` n'est
  emise par un composant ou une page : le diff ne peut pas changer un rendu.
- **Balayage de contraste automatise sur les 26 pages, FR et EN**, tous les
  elements textuels visibles, avec composition alpha sur la pile de fonds
  complete : **zero echec AA**. Les corrections annoncees produisent bien leur
  effet en production.
- **Le blocage du Round 2 est ferme.** Le fichier `docs/DECISIONS.md` a ete
  soumis au moteur de rendu de GitHub (`POST /markdown`, mode `gfm`) : la sortie
  contient desormais **un seul `<table>` portant les 38 lignes**, D001 a D041,
  sans fragment en texte brut. Les deux lignes vides internes ont disparu.
- **Les cinq points importants du Round 2 sont traites** : D039 pose la limite
  `--gold-deep` du bouton plein, mesuree en page a `rgb(184, 121, 30) 1px`, soit
  3.25:1 sur creme ; les huit classes mesurees au R2 sont couvertes, plus trois
  autres ; D033 a D035 sont documentees comme reservees ; le point 3 des ecarts
  aux prototypes recoit sa ligne D041, verifiee comme la plus haute libre sur
  toutes les branches ; `docs/work-items/UI-001.md` cite desormais D028 a D032,
  D036, D037, D039, D040 et D041.
- **Fondation reveillee et remesuree**, `.section--light` injectee sur les
  sections de contenu, en excluant le header, le pied de page et les heros qui
  restent navy dans la maquette et sont hors perimetre de l'item. Il reste douze
  classes porteuses de couleur sur six pages publiques, detaillees dans le
  blocage ci-dessous. Delais de transition respectes avant chaque releve, selon
  l'avertissement de methode du R2.
- Les ratios annonces ont ete recalcules independamment a la formule sRGB :
  `--gold-deeper` 5.06:1 sur creme et 5.65:1 sur blanc, `--gold-deep` 3.25:1 et
  3.63:1, `--gold` 2.47:1 sur creme et 2.63:1 sur `--cream-header`, `--slate-body`
  5.35:1 sur creme et 5.98:1 sur blanc, `--navy-deep` sur `--gold-light` 10.01:1,
  `--navy-deep` sur `--gold` 6.86:1, `--gold-40` compose sur creme donnant
  `#E4CB9C` a 1.41:1. Tous concordent avec les commentaires a 0.02 pres, sauf le
  point de precision releve en suggestion.
- SEO et deploiement, verifies bien qu'absents du diff : `public/og-image.png` et
  `public/og-image-en.png` existent, `hreflang` reciproque avec `x-default`,
  `og:locale` a `fr_CI` et `en`, canoniques exactes, `robots.txt` coherent,
  sitemap a 26 URL, bloc D1 toujours neutralise et sans virgule parasite apres
  `pages_build_output_dir`, pas de `CNAME`, aucun secret. La PR vise bien
  `refonte-multipages`.
- Garde-fous editoriaux et marque : aucun prix, aucun nom de client, aucune date
  exacte, aucun ALTARYS ENTERPRISE, aucun violet, aucun ambre, aucun teal, aucun
  hexadecimal en dur hors de `tokens.css`. PCS reste "Disponible T3 2026",
  "Papillon Corporate Finance Suite" garde son "Suite", la page A propos ne nomme
  qu'Emmanuel Blonvia, Papillon HR Suite reste presente en douze libelles metier.
  Aucun tiret cadratin ni point median dans les lignes ajoutees. Aucune cle de
  dictionnaire ni route touchee : la parite FR / EN est inchangee.
- Accessibilite hors contraste : un seul `h1` par page, `lang` correct sur
  `<html>`, `prefers-reduced-motion` couvre bien `.fade-in`, repli `.no-js`
  present. Le retard d'apparition observe sur `/a-propos` est le comportement
  normal de l'`IntersectionObserver`, verifie, pas un defaut.
- **Le plugin `code-review` n'est toujours pas installe sur ce depot**, troisieme
  ronde consecutive. La passe de correctness generique a de nouveau ete conduite
  a l'equivalent, par un agent adversarial dedie sur le diff, dont chaque
  candidat a ete reconfirme a la main contre le code avant promotion. Les faux
  positifs sont ecartes et ne figurent pas ci-dessous.

Le travail de cette ronde est bon : le blocage du journal de decisions est
reellement ferme, verifie au moteur de rendu, et les corrections de contraste
tiennent sur les 26 pages. Ce qui bloque tient a une seule chose, mais elle est
de fond : D040 enregistre une couverture que le CSS livre n'a pas.

### Blockers

- [ ] **[BLOCKER]** `src/styles/global.css:536` et `docs/DECISIONS.md:56` -
  D040 enregistre que "le peritexte clair couvre aussi les classes propres aux
  composants", et sa justification ajoute qu'"une fondation qui n'en couvrirait
  qu'une partie forcerait UI-002 a les redecouvrir page par page, ce qui est
  exactement ce qu'elle doit eviter". **La fondation livree n'en couvre qu'une
  partie.** Balayage refait en page, fondation reveillee sur les sections de
  contenu, header, pied de page et heros exclus parce qu'ils restent navy dans la
  maquette et sont hors perimetre :

  | Fichier | Selecteur | Ratio sur clair | Pages |
  |---|---|---|---|
  | `LegalPage.astro:151` | `.legal-body :global(strong)` | 1.04:1 | 4 |
  | `LegalPage.astro:93` | `.legal-body :global(h2)` | 1.70:1 | 4 |
  | `LegalPage.astro:141` | `.legal-body :global(a)` | 1.70:1 | 4 |
  | `LegalPage.astro:110` | `.legal-body :global(p)` | 2.17:1 | 4 |
  | `LegalPage.astro:122` | `.legal-body :global(li)` | 2.17:1 | 4 |
  | `LegalPage.astro:75,82` | `.legal-updated`, `.legal-prevails` | 2.17:1 | 4 et 2 |
  | `PageScaffold.astro:84,94` | `.breadcrumb li`, `.breadcrumb a` | 1.02:1 | 2 |
  | `PageScaffold.astro` | `.scaffold-note` | 1.56:1 | 2 |

  Capture a l'appui sur `/en/legal-notice` en creme : "ALTARYS LABS",
  "Cloudflare, Inc" et "altaryslabs.com" en `<strong>` sont **litteralement
  invisibles**, et les titres de section "Site publisher", "Hosting",
  "Intellectual property" sont delaves. Les quatre pages legales ont un prototype
  clair, l'item le releve lui-meme, et D032 precise que "seul le restylage de
  surface s'applique" : leur bascule est donc bien prevue.

  S'y ajoute un trou qui n'est pas un defaut de contraste mais un defaut de
  surface, et qui rend le resultat **pire que l'absence de couverture** :
  `ModuleGrid.astro:63` `.module` et `FeatureGrid.astro:48` `.feature` gardent un
  fond `--navy-card`, alors que `.module-label` juste au-dessus, lui, est
  converti. Capture a l'appui sur `/produits/papillon-hr-suite` : douze tuiles
  navy alignees sur une page creme, sous un intitule passe en `--slate-body`. Le
  releve de prototypes de `docs/work-items/UI-001.md:88` dit pourtant
  explicitement "white feature cards" et "white module cards".

  Enfin, la garantie de D036 ne couvre pas ces pages :
  `.section--light.section--light h2` vaut (0,2,1) et `.legal-body[data-astro-cid] h2`
  vaut (0,2,1) aussi. Egalite, donc arbitrage par ordre d'emission, exactement la
  loterie que le doublement de classe existe pour supprimer. Verifie en page :
  sur les quatre pages legales c'est `LegalPage` qui gagne.

  Ce n'est pas la meme classe de remarque qu'au R2. Au R2 le trou etait ouvert et
  non documente ; ici il est **ferme dans le journal et ouvert dans le code**.
  Une ligne D qui affirme une couverture inexistante fait que personne n'ira la
  rechercher, ce qui est precisement le mode de defaillance que D031 invoque pour
  justifier la correction de `CLAUDE.md`.
  -> Deux sorties acceptables, l'une ou l'autre. Soit etendre le peritexte a ces
  familles, en n'oubliant pas de remonter d'un cran la specificite face a
  `.legal-body :global(...)`. Soit restreindre le texte de D040, inscrire la
  liste ci-dessus dans "Out of scope" de `docs/work-items/UI-001.md` et dans le
  perimetre de UI-002. Ce qui n'est pas acceptable est de laisser le journal
  affirmer que la question est reglee.

### Important

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:60` - La correction du blocage du R2 en
  introduit un autre, plus petit, de la meme famille. La note "D033 to D035 are
  reserved..." est suivie **immediatement**, sans ligne vide, du `---` de la
  ligne 62. En Markdown GitHub un `---` colle sous un paragraphe est un marqueur
  de titre setext : le paragraphe devient un `<h2>`. **Verifie au moteur de rendu
  de GitHub** : la sortie contient
  `<h2>D033 to D035 are reserved by <code>SITE-FIX-001</code>...</h2>`, et le
  fichier ne rend plus qu'un seul `<hr>` la ou il en avait deux. Une note de bas
  de tableau s'affiche donc comme un titre de section, et le separateur qui
  isolait le tableau de la note sur les lignes retro-documentees a disparu.
  -> Inserer une ligne vide entre la ligne 61 et le `---` de la ligne 62.

- [ ] **[IMPORTANT]** `CLAUDE.md:132` - La palette des surfaces claires, dans le
  document qui fait autorite et qui impose dans le meme paragraphe "Always a
  token from `tokens.css`", **omet `#B8791E`**, c'est-a-dire `--gold-deep`. Or
  c'est la valeur qui porte, dans cette PR meme, l'anneau de focus clavier, la
  bordure du bouton secondaire, la bordure de survol des cartes et la nouvelle
  limite du bouton plein arbitree par D039. La liste enumere `#F6F2E9`,
  `#FFFFFF`, `#FBF9F4`, `#1A2740`, `#5B6472` et `#8B5E1B`, et la regle
  d'accessibilite juste en dessous ne parle que de `--gold-light` et
  `--gold-deeper`. `#3A4256`, `--slate-nav`, manque egalement. Un auteur qui
  controle une page claire contre `CLAUDE.md` lira donc `#B8791E` comme une
  couleur hors palette, sur un depot dont la premiere regle de marque est
  "navy et or seulement".
  -> Ajouter les deux valeurs a la liste des surfaces claires, avec leur role.

- [ ] **[IMPORTANT]** `src/styles/global.css:565` - Le commentaire dit
  "L'etiquette technique **garde son fond** dore tres pale... mais son texte
  passe a l'or fonce". C'est faux : la regle ligne 567 pose
  `background: var(--gold-12)` alors que `ApproachCard.astro:68` pose
  `--gold-10`, et a (0,3,0) contre le (0,2,0) scope c'est la regle globale qui
  gagne. Le fond change donc aussi. Le commentaire decrit une intention que le
  CSS ne tient pas, dans le fichier que cette PR erige en reference
  d'accessibilite du projet.
  -> Corriger le commentaire, ou aligner la valeur sur `--gold-10`.

- [ ] **[IMPORTANT]** `docs/work-items/UI-FIX-001.md:16` et `:20` - Le document
  de suivi exige par le R1 decrit de travers le defaut qu'il existe pour tracer.
  Deux erreurs, **mesurees sur `/en/legal-notice`** :
  1. "On four public pages, the 'Derniere mise a jour' line **and the English
     notice that the French version prevails**..." : `.legal-prevails` n'est rendu
     que sous `locale === 'en'` (`LegalPage.astro:44`). Il existe sur 2 des 4
     pages legales, pas sur 4.
  2. "Colour, size, leading **and** the intended 40px separation are **all**
     lost... They look like the first paragraph of the legal document itself" :
     faux pour les deux elements. `.legal-body :global(p)` ne pose que
     `font-size`, `color`, `line-height` et `margin-bottom`. Releve en page :
     `.legal-prevails` conserve son `border-left: 2px solid rgba(200, 146, 42, 0.3)`
     et son `padding-left: 16px`, donc son filet dore le detache toujours ; et
     `.legal-updated` conserve sa classe `mono`, donc sa fonte a chasse fixe,
     visible sur la capture 360px. Ce qui est perdu est la couleur, la taille,
     l'interlignage et la separation de 40px, pas la mise en exergue.

  Un item de correction qui surestime son propre defaut conduit soit a un
  sur-dimensionnement, soit a un abandon quand l'auteur constatera que le rendu
  n'est pas celui decrit.
  -> Restreindre les deux phrases a ce qui est mesure.

### Correctness (passe generique, equivalent `code-review`)

Le plugin n'etant pas installe sur ce depot, la passe a ete conduite par un agent
adversarial dedie sur le diff, puis chaque candidat reconfirme a la main. Les
defauts de fond sont portes plus haut ; ce qui suit est le reste.

- **[SUGGESTION]** `src/components/ModuleGrid.astro:51`,
  `src/components/LegalPage.astro:73`, `docs/work-items/UI-001.md:43,45,46,59` et
  `docs/DECISIONS.md:48` - Les chiffres 2.09:1, 3.61:1 et 5.90:1 sont les valeurs
  de `--ink-25`, `--ink-40` et `--ink-60` sur `--navy-footer` `#040C16`. Elles
  sont exactes pour les deux regles du pied de page. Elles sont reutilisees pour
  des elements qui reposent sur `--navy-deep` `#07111E` : la section des modules
  et `.legal-section` n'ont pas de modificateur de fond, et le fil d'Ariane est
  dans une `section--deep`, dont `global.css:112` fixe le fond a `--navy-deep`.
  Les valeurs exactes y sont **2.13:1, 3.63:1 et 5.87:1**. D029 annonce de meme
  une plage "from 2.09:1 to 3.61:1" dont le vrai maximum est 3.63:1. Aucun
  verdict ne change, tout reste sous 4.5:1 avant et au-dessus apres ; c'est une
  question de justesse dans des commentaires que cette PR rend normatifs.
- **[SUGGESTION]** `src/styles/global.css:441` - Le commentaire d'ouverture
  affirme que le doublement porte "les regles de base a (0,3,0) et celles d'etat
  a (0,4,0)". `.section--light.section--light :focus-visible` ligne 522 est une
  regle d'etat a **(0,3,0)** : une pseudo-classe placee en descendant n'ajoute
  pas au compte des classes du selecteur compose. Sans consequence, aucune regle
  concurrente ne depassant (0,2,0) sur `outline-color`, mais l'affirmation est
  fausse telle qu'ecrite.
- **[SUGGESTION]** `src/styles/global.css:500` - `.section--light.section--light
  .badge--solid` redeclare mot pour mot la paire de `.badge--solid` ligne 328 et
  rien ne s'interpose : la regle est sans effet. Point deja souleve au R1 et au
  R2, troisieme ronde. Meme remarque, plus limitee, pour le
  `background: var(--gold-12)` de la ligne 495 qui repete la ligne 334, et le
  `background: var(--gold-06)` de la ligne 516 qui repete la ligne 254 : seules
  les declarations de couleur et de bordure de ces deux regles font un travail.
- **[SUGGESTION]** `src/styles/global.css:476` - Le second membre du selecteur,
  `.section--light.section--light .card--service`, est mort : `.card--service`
  n'est jamais emis sans `.card` (`ServiceCard.astro:25`, `AboutContent.astro:43`)
  et la ligne 475, a specificite identique, couvre deja ces elements. Point deja
  souleve au R2.
- **[SUGGESTION]** `src/styles/tokens.css:45,65,73,90,99,101,105` - Sept jetons
  sans consommateur, verifie par grep sur `src/` et `functions/` :
  `--cream-header`, `--slate-nav`, `--navy-10`, `--navy-15`, `--shadow-menu`,
  plus `--gold-65` et `--ink-25` rendus orphelins par cette PR et desormais cites
  uniquement dans des commentaires, alors que `CLAUDE.md:139` et `:142` en font
  des regles normatives. `--navy-15` et `--slate-nav` sont par ailleurs les deux
  seuls jetons ajoutes sans commentaire d'usage. Point deja souleve au R1 et au
  R2, troisieme ronde.
- **[SUGGESTION]** `src/styles/global.css:576` - Le bloc `.field-*` est
  inconditionnellement clair : il pose `--surface`, `--navy-text`, `--slate-body`
  et `--navy-14` sans ancetre `.section--light`, contrairement a toutes les
  autres regles claires du fichier. Sans effet aujourd'hui, aucune page ne
  l'utilisant. Mais si le lot FORM atterrit avant UI-002, la page Contact aura
  des champs blancs sur fond navy, et l'architecture "le clair vit sous
  `.section--light`" que ce meme fichier institue est rompue en un point.
- **[SUGGESTION]** `src/styles/global.css:610` - `.field-input:focus` et ses deux
  voisines utilisent `:focus` et non `:focus-visible`, avec `outline-offset: 1px`
  la ou tout le site est a `3px`. A (0,2,0) elles battent le `:focus-visible`
  global a (0,1,0) : les champs seront les seuls elements du site a afficher un
  anneau au clic a la souris. Point deja souleve au R1 et au R2, troisieme ronde.
- **[SUGGESTION]** `src/styles/global.css:374` - `.list-diamond` et ses trois
  regles ne sont referencees par aucun composant. Code mort preexistant, expedie
  a chaque page. Point deja souleve au R1 et au R2, troisieme ronde.
- **[SUGGESTION]** `src/styles/tokens.css:42` - `--ink-60` vaut `0.55`, pas
  `0.60`. Preexistant, mais cette PR en fait le jeton canonique du texte discret
  sur sombre et l'inscrit comme tel dans `CLAUDE.md`. Troisieme ronde.
- **[SUGGESTION]** Procedure - Installer le plugin `code-review` sur ce depot,
  pour que l'etape 6 de `.claude/commands/review.md` soit executable telle
  qu'ecrite. Troisieme ronde consecutive ou elle est remplacee par un equivalent.

Verifie et propre : aucun `var(--x)` non defini sur l'ensemble de `src/` et de
`functions/`, accolades equilibrees, aucun selecteur malforme, aucun `!important`,
aucun import casse, aucun bloc commente laisse en place, aucun secret. Les
commentaires ajoutes sont en francais et les documents de specification en
anglais, conformement a la regle du depot. Le diff sur les sept composants ne
touche que des declarations `color`. Les affirmations d'ordre d'emission du
commentaire de `global.css` ont ete reverifiees sur les 26 pages construites et
sont exactes, y compris le decompte de seize pages pour `CtaBanner`. La reserve
de D033 a D035 par `SITE-FIX-001` sur `fix/outillage-reviewer` est verifiee par
`git show`.

### Summary

Le blocage du Round 2 est reellement ferme : `docs/DECISIONS.md` rend de nouveau
un tableau unique portant ses 38 lignes, verifie au moteur de rendu de GitHub, et
les cinq points importants du R2 sont traites, dont la limite `--gold-deep` du
bouton plein mesuree a 3.25:1 sur creme. Le balayage automatise des 26 pages, FR
et EN, ne trouve aucun echec AA, et la fondation reste dormante sans aucune
regression. Ce qui bloque est que D040 enregistre une couverture que le CSS livre
n'a pas : le corps des quatre pages legales descend jusqu'a 1.04:1 une fois la
fondation reveillee, et les tuiles de modules et de fonctionnalites restent navy
sous un intitule deja converti, alors que le releve de prototypes de l'item dit
"white module cards". Une ligne de decision qui affirme un trou ferme empeche
qu'on aille le rechercher ; il faut soit etendre le peritexte, soit restreindre
D040 et inscrire la liste dans "Out of scope".
