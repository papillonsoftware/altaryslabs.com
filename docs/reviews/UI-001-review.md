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
