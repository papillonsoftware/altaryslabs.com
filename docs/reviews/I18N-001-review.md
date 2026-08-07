# I18N-001 - Revue

## Round 1 - 2026-08-07
**Verdict**: CHANGES REQUESTED

Revue conduite apres la fusion de la PR #25, a la demande du fondateur. Worktree
de revue `\.claude/worktrees/review-I18N-001` sur `feat/copie-handoff`, non
detache (`git symbolic-ref -q HEAD` renvoie `refs/heads/feat/copie-handoff`).

Ce qui a ete verifie et qui passe :

- `npm ci`, `npm run build` (26 pages) et `npm run check` (0 erreur, 0
  avertissement, 0 indice) relances independamment dans le worktree de revue.
- Les dix lignes annoncees sont exactement les dix lignes editees. `routes.ts`
  n'est pas touche, aucun composant ni aucune page ne l'est, le type `Dictionary`
  reste derive de `fr.ts` et `en.ts` l'importe toujours.
- **D062 est corroboree par une mesure independante.** Panneau `.nav-menu` a
  288px, zone de texte a 242px, libelle `IT, HR & Corporate Finance Consulting`
  mesure a 236,7px, hauteur 21,6px pour une interligne de 21,6px : une seule
  ligne, aucun repli. Marge reelle 5,3px. Aucun debordement horizontal
  (`scrollWidth == clientWidth`) sur les six pages a 360, 768 et 1440px.
- Captures des six pages aux trois largeurs dans les deux langues : palette navy
  et or conforme, aucun ambre, aucun turquoise, aucun violet, alternance creme et
  navy conforme, produits avant services conforme a `CLAUDE.md`.
- `bin/contrast_sweep` : aucun echec AA sur les 26 pages.
- SEO structurel : hreflang reciproques et corrects, `x-default` present,
  `og:locale` `fr_CI` et `en`, canonical correct, sitemap a 26 URL, `robots.txt`
  coherent, `lang` correct sur `<html>`, les deux vignettes OG existent bien dans
  `public/`.
- Deploiement : `output: 'static'`, sortie `./dist`, binding D1 toujours
  neutralise avec sa consigne de virgule intacte, aucun secret, PR ciblant bien
  `refonte-multipages`.

### Blockers

- [ ] **[BLOCKER]** `public/og-image.png` et `public/og-image-en.png` - Les deux
  vignettes de partage portent l'ancien positionnement grave en pixels, celui-la
  meme que D042, D043 et D044 viennent de retirer. La vignette francaise affiche
  `Solutions technologiques pour les entreprises d'Afrique OHADA et CIMA` avec le
  sous-titre `Suites SaaS, conseil IT, RH et Finance, developpement sur mesure.`;
  l'anglaise affiche `Enterprise software built for African markets` avec
  `SaaS platforms, IT, HR and finance consulting, custom development.`. Ce sont
  mot pour mot les deux anciens titres de hero et l'ancienne graphie du service
  Conseil. `BaseLayout.astro:19` rappelle lui-meme que ces images sont ce qui
  apparait dans les apercus WhatsApp et LinkedIn, canal principal de l'audience :
  un dirigeant qui recoit le lien lit d'abord l'ancien positionnement. Le defaut
  n'est couvert ni par D063 ni par `I18N-FIX-001`, dont le perimetre se limite a
  deux cles de dictionnaire. La vignette francaise ecrit en outre
  `developpement` sans accents. -> Regenerer les deux vignettes sur le
  positionnement valide et sur la graphie canonique du service, dans un item
  dedie, et corriger l'accentuation au passage.

- [ ] **[BLOCKER]** `src/i18n/fr.ts:323` et `:325`, `src/i18n/en.ts:322` et
  `:324` - `meta.home.title` et `meta.home.description` portent encore l'ancien
  positionnement. Le francais titre
  `ALTARYS LABS | Solutions technologiques pour les entreprises OHADA et CIMA`
  au-dessus d'un hero qui dit desormais `Votre partenaire technologique`, et
  decrit `les entreprises d'Afrique de l'Ouest et Centrale`. L'anglais titre
  `ALTARYS LABS | Enterprise software for African markets`, soit exactement la
  phrase que D043 a retiree, et decrit `across West and Central Africa` sous un
  hero qui affirme `OHADA and CIMA regions` : deux territoires differents sur la
  meme page. Ces valeurs alimentent le `<title>`, `og:title`, `twitter:title`,
  `meta description`, `og:description` et `twitter:description` de l'accueil, et
  **`BaseLayout.astro:41` reinjecte `t.meta.home.description` dans le
  `Organization` JSON-LD des 26 pages**, dans les deux langues. La portee depasse
  donc largement l'accueil. Non couvert par D063 ni par `I18N-FIX-001`. ->
  Traiter ces quatre valeurs dans le meme item que `footer.tagline`, en elargir
  le perimetre, ou ouvrir un item jumeau ; le balayage des chaines residuelles
  s'est arrete au pied de page alors qu'il fallait le pousser jusqu'aux
  metadonnees.

### Important

- [ ] **[IMPORTANT]** `src/i18n/fr.ts:391` et `src/i18n/en.ts:390` -
  `footer.tagline` contredit le hero sur les 26 pages, verifie a l'ecran : en
  francais `Votre partenaire technologique` en haut et
  `Solutions technologiques pour les entreprises d'Afrique` en bas ; en anglais
  `OHADA and CIMA regions` en haut et `across West and Central Africa` en bas.
  Le defaut est reel et livre. Il est deja trace (D063 et
  `docs/work-items/I18N-FIX-001.md`) et le fondateur a explicitement decide de le
  differer : l'arbitrage humain existe et est consigne, la revue le signale sans
  le reclasser. -> Executer `I18N-FIX-001`, en le fusionnant de preference avec
  le blocker `meta.home.*` ci-dessus, qui est le meme defaut un niveau plus haut.

- [ ] **[IMPORTANT]** `src/components/ServiceConsultingContent.astro:3` - Le
  commentaire d'en-tete dit encore
  `Corps de la fiche Conseil IT, RH et Finance, partage par les deux langues.`.
  C'est la graphie que D044 a precisement abandonnee, et c'est la seule
  occurrence survivante dans tout `src/`. Un commentaire faux egare le prochain
  mainteneur, qui y lira une troisieme graphie du service la ou D044 en a impose
  une seule. -> Remplacer par `Conseil IT, RH & Corporate Finance`.

- [ ] **[IMPORTANT]** `src/i18n/fr.ts:106` - `home.heroTitle` ecrit
  `les entreprises Africaines` avec une majuscule. En francais, `africaines` est
  ici un adjectif qualificatif et ne prend pas de majuscule ; seule la
  substantivation la prend (`les Africains`). C'est le `h1` de la page d'accueil,
  la premiere phrase que lit un dirigeant qui evalue un prestataire, et c'est la
  seule occurrence de l'adjectif dans tout `fr.ts`, donc aucune convention locale
  ne la justifie. La chaine est reprise telle quelle dans D042, ce qui veut dire
  que la faute a ete validee avec la phrase et non introduite a l'insu du
  fondateur : seul lui peut decider de la conserver. -> Ecrire
  `pour les entreprises africaines.` et annoter D042.

- [ ] **[IMPORTANT]** `src/i18n/en.ts:329` - `meta.products.description` annonce
  `companies in West and Central Africa` quand `src/i18n/fr.ts:330` annonce
  `des entreprises des zones OHADA et CIMA` : la meme page revendique deux
  territoires selon la langue. `CLAUDE.md` demande justement a `en.ts` d'expliciter
  OHADA et CIMA plutot que de rester sur une geographie generique. -> Aligner
  l'anglais sur OHADA et CIMA, dans le meme lot que les autres chaines
  residuelles.

- [ ] **[IMPORTANT]** `.claude/personalities/REVIEWER.md:69` - La checklist de
  marque impose `Visual hierarchy holds: Services first, Products second`, en
  contradiction directe avec `CLAUDE.md` (`Products before Services, a deliberate
  positioning choice`) et avec le site livre, qui place bien Produits avant
  Services. Un relecteur qui applique la checklist a la lettre ouvre un blocker
  faux sur une page correcte. Defaut latent, hors perimetre de cette PR, mais
  reel. La ligne 59 du meme fichier nomme par ailleurs
  `Papillon Corporate Finance` sans le `Suite` que D017 et D031 verrouillent. ->
  Corriger les deux lignes de `REVIEWER.md` pour les aligner sur `CLAUDE.md`.

### Suggestions

- **[SUGGESTION]** `src/i18n/en.ts:131` - `productsPage.title` affiche
  `Three SaaS suites for African markets` la ou le francais affiche
  `Trois suites SaaS pour l'OHADA et le CIMA`. C'est un `h1` visible, pas une
  metadonnee. La readaptation autorise l'ecart (D014), mais l'anglais y perd la
  precision reglementaire qui est l'argument de vente. -> A arbitrer avec le lot
  de chaines residuelles.

- **[SUGGESTION]** `src/components/Footer.astro` - Dans la colonne Services du
  pied de page a 1440px, le nom long passe sur deux lignes (206,8px de colonne
  pour 236,7px de texte), en francais comme en anglais. Le rendu reste propre et
  aucune autre largeur n'est concernee, le pied passant en une colonne en
  dessous. Consigne parce que D062 n'a mesure que le menu deroulant : le pied de
  page est la seconde surface que le nom rallonge traverse, et il n'a pas ete
  couvert.

### Correctness (code-review skill)

Le skill `code-review` a ete invoque sur la PR #25. Son etape 1 est une
verification d'eligibilite qui interrompt le skill si la PR est fermee ; la PR
#25 ayant ete fusionnee avant cette ronde, le skill s'arrete avant son propre
commentaire automatique. La PR ne portera donc que le commentaire consolide de
cette ronde, et non les deux commentaires que D056 prevoit en regime normal.

L'analyse de fond du sweep a malgre tout ete conduite, avec les memes axes
(conformite `CLAUDE.md`, balayage de chaines et de commentaires perimes,
coherence entre les deux variantes de langue). Les constats retenus apres
verification dans le code sont deja portes ci-dessus :

- `[BLOCKER]` `meta.home.title` et `meta.home.description` perimes, et leur
  diffusion sur les 26 pages via le JSON-LD (`BaseLayout.astro:41`).
- `[IMPORTANT]` commentaire perime de `ServiceConsultingContent.astro:3`.
- `[IMPORTANT]` divergence de geographie de `meta.products.description`.

Constats ecartes apres verification : aucune violation de palette, de typographie
ou de garde-fou editorial ; aucun prix, aucun nom de client, aucune date exacte,
aucun chiffre invente ; aucune mention d'ALTARYS ENTERPRISE ; aucune fuite de
langue d'une variante a l'autre ; aucun em-dash ni interpunct dans le diff ; la
parite des cles est intacte, aucune cle n'ayant ete ajoutee ni renommee.

### Summary

Les dix lignes livrees sont exactes, conformes aux arbitrages D042 a D045 et D061,
et la mesure du menu deroulant annoncee en D062 est corroboree independamment ;
le build, le check, le contraste et le SEO structurel sont verts. La revue bloque
sur le balayage des chaines residuelles, arrete trop tot : les deux vignettes Open
Graph et les quatre valeurs `meta.home.*` portent encore, mot pour mot, le
positionnement et la graphie de service que cette PR vient de retirer, et le
JSON-LD les diffuse sur les 26 pages. `footer.tagline` reste trace et
consciemment differe par le fondateur ; ces deux surfaces-la ne le sont pas.
