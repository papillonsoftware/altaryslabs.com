# UI-004 - Revue

## Round 1 - 2026-08-07
**Verdict**: CHANGES REQUESTED

Branche `feat/logo-maquette`, PR #33, base `refonte-multipages`. Revue faite dans
un worktree dedie (`review-ui-004`) a partir de `origin/feat/logo-maquette`
(d604be6). `npm ci`, `npm run build` et `npm run check` relances ici: build vert,
26 pages, `astro check` 0 erreur / 0 avertissement / 0 indice. Controle visuel
fait sur `http://localhost:4323` (port reel imprime par `astro preview`, propriete
du worktree de revue verifiee par `lsof`), aux trois largeurs et dans les deux
langues.

### Blockers

- [ ] **[BLOCKER]** `src/components/Logo.astro:60` (et les deux appelants,
  `src/components/Header.astro:161`, `src/components/Footer.astro:121`) - **Le
  mot-marque du logo est souligne sur toutes les pages du site, dans les deux
  langues et aux trois largeurs.** `global.css:49` ne pose que `a { color:
  inherit }` et ne remet jamais `text-decoration`. Tous les autres liens du
  projet portent leur propre `text-decoration: none` (`.nav-link:193`,
  `.btn:240`, `.link-arrow:355`). Les deux ancres du logo ne l'ont jamais eu et
  n'en avaient pas besoin: elles ne contenaient qu'un SVG, insensible a la
  decoration de texte. En passant le mot-marque en vrai texte HTML, cette PR
  expose ce texte au soulignement par defaut de l'agent utilisateur. Mesure sur
  la page rendue: `.nav-logo` et `.footer-logo` calculent tous deux
  `text-decoration-line: underline`, couleur `rgb(91, 100, 114)`, soit
  `--slate-body`, un gris de texte courant sous une marque marine et or.
  Confirme visuellement sur captures a 360, 768 et 1440 px, en FR et en EN: un
  trait gris court sous `ALTARYS` et sous `LABS` au header, et sous
  `ALTARYS LABS` d'un seul tenant au pied de page. Les deux maquettes posent
  explicitement `text-decoration:none` sur leur ancre (`Header.dc.html`,
  `Footer.dc.html`, lus en direct via `DesignSync` a la racine du projet), donc
  c'est aussi un ecart franc a la maquette, pas seulement un defaut esthetique.
  C'est exactement le defaut que le controle visuel declare non fait au point 1
  de la description de la PR aurait leve.
  -> Poser `text-decoration: none;` sur `.logo` dans `Logo.astro`, et non sur
  chacune des deux ancres appelantes: D088 a deja deplace le nom accessible sur
  l'appelant, et laisser aussi la decoration a sa charge arme le meme piege pour
  le troisieme site d'appel.

### Important

- [ ] **[IMPORTANT]** `src/components/Logo.astro:80-90` - **La PR reduit une
  cible tactile deja sous le seuil.** Mesure sur un vrai viewport 360 px
  (`Emulation.setDeviceMetricsOverride`, pas `--window-size`, plafonne a 500 px):
  l'ancre `.nav-logo` fait 122,6 x 28 px et `.footer-logo` 155,8 x 26 px. Le
  plancher de 44 px de la checklist n'est pas tenu. Ce n'est pas neuf, mais la PR
  l'aggrave: l'ancien verrou rendait un SVG de
  `Math.round(width * 72 / 300)` de haut, soit 38 px au header (`width={160}`) et
  36 px au pied de page (`width={150}`). Le header perd 10 px de hauteur
  cliquable et le pied de page 10 px aussi. Le lien vers l'accueil est la cible
  la plus utilisee d'un site mobile.
  -> Donner aux deux ancres une hauteur minimale de 44 px avec un centrage
  vertical (`min-height: 44px; align-items: center`), ce qui n'ajoute rien de
  visible puisque le header fait deja 72 px de haut, ou etendre la zone cliquable
  par du remplissage vertical.

- [ ] **[IMPORTANT]** `src/components/Logo.astro:108-110` - **Le poids 700 de DM
  Sans demande par `.logo-altarys` n'est jamais charge, donc jamais rendu.**
  `BaseLayout.astro:91` ne demande `DM+Sans:wght@300;400;500;600`, ce que reprend
  la table typographique de `CLAUDE.md`. Verifie sur la page rendue:
  `document.fonts` ne contient que les fontes DM Sans 300, 400, 500 et 600, et la
  chasse rendue de `ALTARYS` a 700 est identique au millieme a celle a 600
  (410,76 px pour les deux a 100 px de corps), donc c'est la fonte 600 qui peint,
  sans meme de graissage synthetique. Le critere d'acceptation 1 de
  `docs/work-items/UI-004.md:32`, `ALTARYS` en DM Sans 700, n'est donc pas tenu,
  et D086 le decrit comme acquis. Nuance importante pour l'arbitrage: la maquette
  porte exactement le meme `<link>` Google Fonts et le meme `font-weight:700`,
  donc ce qui est livre est au pixel pres ce que le fondateur a valide. Le defaut
  n'est pas un ecart visuel, c'est une declaration inatteignable: le jour ou
  quelqu'un ajoute `;700` au `<link>`, le logo change de graisse sur tout le site
  sans qu'aucune ligne de `Logo.astro` ait bouge.
  -> Trancher dans un sens ou dans l'autre et l'ecrire: soit ajouter `;700` a DM
  Sans dans `BaseLayout.astro` et mettre a jour la table de `CLAUDE.md` (une
  graisse de plus a telecharger), soit passer `.logo-altarys` a `font-weight:
  600`, ce qui ne change strictement rien au rendu actuel et rend le code
  conforme a ce qui est charge. Corriger aussi le critere 1 et D086 en
  consequence.

- [ ] **[IMPORTANT]** `src/components/Logo.astro:7`, `src/components/Logo.astro:20`,
  `public/assets/favicon.svg:1` - **Trois commentaires renvoient a des decisions
  qui parlent d'autre chose.** `Logo.astro:7` dit "Voir D084" pour la geometrie du
  diamant, `Logo.astro:20` dit "Voir D085" pour la separation `lockup` / `detail`,
  et `favicon.svg:1` dit "(D084)" pour la geometrie. Dans `docs/DECISIONS.md`,
  D084 est la decision de `SITE-FIX-006` sur l'invocation de
  `code-review:code-review` et D085 celle sur la liste d'autorisations du
  reviewer autonome. Les bonnes lignes sont D086 et D087, ajoutees par cette PR
  meme, et `docs/work-items/UI-004.md:93-94` dit explicitement que D084 et D085
  etaient deja reservees et que l'item prend D086 a D088. La renumerotation a ete
  faite dans les documents et oubliee dans le code.
  -> `D084` -> `D086` aux deux endroits, `D085` -> `D087` dans `Logo.astro:20`.

- [ ] **[IMPORTANT]** `public/assets/favicon.svg:2-3` - Le commentaire dit que le
  viewBox "deborde d'une unite sur chaque bord". Le debordement ne concerne que
  trois cotes: pastille gauche `cx=2 r=3` jusqu'a x=-1, pastille droite `cx=74
  r=3` jusqu'a x=77, pastille basse `cy=68 r=3` jusqu'a y=71, mais la pastille
  haute `cy=4 r=3` ne descend qu'a y=1 et reste dans le cadre. Le commentaire
  jumeau de `Logo.astro:41-44`, sur la meme geometrie, dit correctement "trois
  cotes" et contredit donc celui-ci. La consequence n'est pas nulle: le viewBox
  `-1 -1 78 72` rembourre les quatre cotes, si bien que la marque se retrouve
  decentree d'une unite vers le bas dans le cadre du favicon. C'est negligeable a
  l'oeil, environ 0,22 px a 16 px, mais c'est la raison pour laquelle un
  commentaire faux ici coute quelque chose.
  -> Ecrire "trois cotes" et, si le decentrage doit disparaitre, `viewBox="-1 0
  78 71"`.

- [ ] **[IMPORTANT]** `src/components/Header.astro:140-142` - Defaut preexistant,
  hors perimetre de cette PR, remonte au titre de la barre maximale. Le
  commentaire de `.nav :focus-visible` attribue le correctif `--gold-deep` a
  D030. D030 porte sur des substitutions de couleur de petit texte (3,25:1,
  3,63:1, 2,76:1), aucune ne valant 2,47:1. La decision qui couvre exactement ce
  cas est D039, dont le texte dit lui-meme qu'elle s'applique "au bouton
  secondaire et a l'anneau de focus", et le commentaire jumeau de `.nav-cta`
  (`Header.astro:295-297`) cite D039 pour le meme 2,47:1. Le diff de cette PR ne
  touche pas ces lignes.
  -> `D030` -> `D039`. A materialiser en suivi: aucun `UI-FIX-003` n'existe
  encore et la ligne D correspondante reste a ouvrir. La revue tourne en mode
  autonome, dont la liste d'autorisations n'ouvre que `docs/reviews/**`: le
  document de suivi et la ligne D doivent etre crees par l'auteur ou le
  fondateur, ce blocage-ci ne vaut pas creation.

### Suggestions

- **[SUGGESTION]** `src/components/Logo.astro:60` - `.logo` ne porte aucun garde
  sur le cas ou un futur appelant oublierait `surface`. La valeur par defaut est
  `dark`, donc un logo pose par erreur sur une surface claire sortirait en ivoire
  sur creme, invisible, sans que le build s'en apercoive: `astro check` ne couvre
  pas la valeur d'une prop optionnelle. D088 le note deja pour `title`. Rien a
  changer tant qu'il n'y a que deux appelants; a garder en tete au troisieme.

- **[SUGGESTION]** `docs/work-items/UI-005.md` - Le suivi des deux `og-image` qui
  portent encore l'ancien logo est bien ouvert et correctement sorti du perimetre.
  Les deux fichiers existent dans `public/`, donc aucune previsualisation sociale
  n'est cassee entre-temps; c'est de l'art perime, pas un lien mort.

### Correctness (code-review skill)

Balayage generique passe via `code-review:code-review` sur la PR #33 (nom
qualifie du plugin, conformement a D084). Le squelette a remonte six candidats.
Apres verification contre le code, un seul a franchi le seuil de confiance du
squelette lui-meme et a ete publie dans son commentaire propre sur la PR; les
autres sont repris ci-dessus a mon compte apres confirmation independante.

- **[IMPORTANT]** `src/components/Logo.astro:108-110` - DM Sans 700 demande mais
  jamais charge. Confirme et detaille plus haut, avec la mesure de chasse qui
  prouve que c'est la fonte 600 qui peint.
- **[IMPORTANT]** Numeros de decision D084 et D085 errones dans trois
  commentaires. Confirme, detaille plus haut.
- **[IMPORTANT]** Commentaire "chaque bord" du favicon faux. Confirme, detaille
  plus haut.
- **[IMPORTANT]** D030 au lieu de D039 sur `.nav :focus-visible`. Confirme,
  preexistant, detaille plus haut.
- **[IMPORTANT]** Cibles tactiles des deux ancres du logo sous 44 px. Confirme
  par la mesure, detaille plus haut.
- Ecarte comme faux positif: le squelette a suggere que le changement de
  `display` sur `.nav-logo` et `.footer-logo` pouvait reproduire la regression de
  geometrie du `.nav-toggle` (round 2 de `UI-002`). Mesure a 360, 768 et 1440 px:
  aucun debordement horizontal, header a 72 px, logo a 122,6 px, hamburger a
  44 x 44 px a x=296 pour 360 px de large. Le changement fait ce que son
  commentaire annonce.

### Ce qui a ete verifie et tient

- Build et types: `npm run build` vert (26 pages), `npm run check` sans erreur ni
  avertissement. Aucun `any`, aucun `@ts-ignore`, aucun `Dictionary` desserre.
  Arbre de travail propre, le build ne depend d'aucun fichier local non commite.
- Parite FR/EN: aucune route, aucune cle de dictionnaire, aucune balise SEO
  touchee. Le seul texte localise implique est l'`aria-label` de l'ancre, bati
  sur `t.nav.home` existant, rendu en `ALTARYS LABS, Accueil` en FR et
  `ALTARYS LABS, Home` en EN. `lang` correct sur `<html>`.
- Marque: aucun hex en dur dans les trois composants, tout passe par
  `tokens.css`. `--gold`, `--gold-light`, `--gold-deeper`, `--ivory`,
  `--navy-text`, `--font-body`, `--font-mono` existent tous. Aucun ambre, aucun
  turquoise, aucun violet. `favicon.svg` garde `#C8922A` en clair, ce qui est
  normal pour un fichier autonome sans CSS.
- Fidelite a la maquette: `Header.dc.html` et `Footer.dc.html` relus en direct a
  la RACINE du projet `53d1c228-d274-4df3-8022-1a427dd96c15`, jamais dans
  `design_handoff_altaryslabs_refonte/`. La geometrie du diamant, les deux
  verrous, les tailles, les interlettrages et les couleurs correspondent au trait
  pres. Le rafraichissement de l'instantane dans
  `docs/vitrine/refonte/prototypes/` est fidele aux fichiers vivants. Aucun HTML
  a style en ligne recopie d'un `.dc.html`, rien tire de `support.js`. Le pied de
  page depouille bien pastilles et facette interieure (`detail="simple"`
  verifie sur la page rendue), et une seule graisse de diamant existe sur une
  page donnee.
- Accessibilite hors les deux points ci-dessus: SVG `aria-hidden="true"` aux deux
  endroits, nom accessible unique porte par l'ancre, un seul `h1`, anneau de
  focus visible sur les deux ancres du logo (`solid 2px` `--gold-deep` au header,
  `--gold` au pied de page, decalage 3 px). Contrastes mesures: `ALTARYS` 14,17:1
  sur creme et 18,38:1 sur marine, `LABS` 5,37:1 sur creme et 10,37:1 sur marine,
  tous au-dessus de 4,5:1. `prefers-reduced-motion` respecte.
- Garde-fous editoriaux: sans objet, la PR ne touche aucune copie publique.
  Aucun prix, aucun nom de client, aucune date, aucun ALTARYS ENTERPRISE, les
  trois produits inchanges.
- SEO: `BaseLayout.astro` garde la main sur canonical, hreflang, OG, Twitter,
  JSON-LD et sitemap. `og-image.png` et `og-image-en.png` sont bien presents dans
  `public/`, ainsi que `favicon.svg` reference par le JSON-LD et par
  `<link rel="icon">`. Aucune route ajoutee, `robots.txt` inchange.
- Performance: aucun JavaScript client ajoute, aucune dependance, aucune
  ressource externe bloquante. Le mot-marque en texte HTML retire meme deux
  elements `<text>` du DOM SVG.
- Deploiement: sortie statique preservee, `pages_build_output_dir` toujours
  `./dist`, binding D1 toujours commente, aucun secret. La PR vise bien
  `refonte-multipages`.

### Summary
Le fond de la PR est juste et bien argumente: le defaut d'echelle du verrou est
reel, le diagnostic est exact, les deux verrous sont fideles aux maquettes lues a
la racine du projet, et build comme types sont verts. Mais le passage du
mot-marque en vrai texte HTML expose ce texte au soulignement par defaut des
liens, que ni `global.css` ni les deux ancres ne neutralisent: le logo
d'ALTARYS LABS s'affiche souligne de gris sur les 26 pages, dans les deux
langues et aux trois largeurs, ce qui est precisement ce que le controle visuel
declare non fait dans la PR aurait attrape. Cinq points importants suivent, dont
un poids DM Sans 700 qui n'est jamais charge et donc jamais rendu, une cible
tactile de logo que la PR fait passer de 38 a 28 px, et trois renvois de
decision errones laisses par la renumerotation D084/D085 vers D086/D087.

## Round 2 - 2026-08-07
**Verdict**: CHANGES REQUESTED

Ronde demandee par le fondateur apres la fusion de la PR #33. La PR est **MERGED**
(commit de fusion `75820e2`), donc les constats ci-dessous ne bloquent plus une
fusion : ils deviennent du travail de suite a ouvrir. Le verdict reste exprime
selon la barre maximale, qui ne juge pas de l'origine d'un defaut.

Revue faite dans un worktree dedie `review-UI-004`, detache sur
`origin/feat/logo-maquette` (b1ef506), base reelle de la PR calculee par
`git merge-base 75820e2^1 HEAD` = `3746e077`. `npm ci`, `npm run build` et
`npm run check` relances ici : build vert, 26 pages, `astro check` 0 erreur /
0 avertissement / 0 indice. Controle visuel sur `http://localhost:4323` servi par
ce worktree, a 360, 768 et 1440 px, en FR et en EN, par le protocole DevTools
(`Emulation.setDeviceMetricsOverride`, jamais `--window-size`). Maquettes
`Header.dc.html` et `Footer.dc.html` relues en direct a la RACINE du projet
`53d1c228-d274-4df3-8022-1a427dd96c15` via `DesignSync`.

### Les cinq constats de la ronde 1 sont leves

Verifie un par un sur la page rendue, pas sur la source :

- **Soulignement du mot-marque** : `.nav-logo` et `.footer-logo` calculent
  `text-decoration-line: none` aux trois largeurs et dans les deux langues.
  Captures du header et du pied de page a 1440 px : aucun trait. Le correctif est
  pose sur les deux ancres, et le raisonnement du commit est juste : la
  decoration se propage depuis l'ancetre, `.logo` ne peut pas la retirer des lors
  qu'il cesse d'etre un inline atomique. La regle laissee sur `.logo` en defense
  est redondante mais inoffensive.
- **Cibles tactiles** : `.nav-logo` mesure 122,63 x **44** px et `.footer-logo`
  155,81 x **44** px, a 360, 768 et 1440 px, en FR et en EN. Le couple
  `padding: 9px 0` / `margin: -9px 0` du pied de page laisse une boite de marge
  de 26 px, donc la mise en page ne bouge pas : ecart visuel mesure entre le bas
  du diamant et le haut de la signature, 23,59 px. Le hamburger reste a 44 x 44 px
  a x=296 pour 360 px de large, sans debordement horizontal.
- **Graisse DM Sans** : `.logo-altarys` calcule `font-weight: 600`, une graisse
  que `BaseLayout.astro:91` charge reellement. `.logo-labs` garde 700, que Space
  Mono charge. D089 consigne l'arbitrage et le critere 1 de `UI-004.md` a suivi.
- **Renvois de decision** : `Logo.astro` cite D086 et D087, `favicon.svg` cite
  D086, `Header.astro` cite D039 sur `.nav :focus-visible`. Chaque numero pointe
  desormais sur une ligne dont le sujet correspond.
- **Commentaire du favicon** : "trois pastilles sur quatre" est exact
  (droite jusqu'a x=77, gauche jusqu'a x=-1, basse jusqu'a y=71, haute arretee a
  y=1). Le `viewBox` passe a `-1 0 78 72` : centre du contenu en x=38 et en y=36,
  centre du cadre idem, le decentrage d'une unite a disparu.

### Blockers

- [ ] **[BLOCKER]** `public/og-image.png`, `public/og-image-en.png` - **Les deux
  images de partage portent encore le logomark d'avant D086, sur les 26 pages et
  dans les deux langues.** Verifie en ouvrant les deux fichiers : diamant a trait
  fin, quatre pastilles de sommet, facette interieure, mot-marque empile en DM
  Sans maigre. C'est exactement la geometrie que D086 remplace. Le defaut n'est
  pas preexistant : avant cette PR les cartes de partage etaient conformes au
  logo du site, apres elles ne le sont plus. La PR met donc deux versions de la
  marque en circulation, dont l'une sur la seule surface ou un dirigeant ivoirien
  se fait une premiere idee avant meme d'ouvrir le site, LinkedIn et WhatsApp.
  Le suivi **UI-005** est ouvert et correctement redige, mais `REVIEWER.md` est
  explicite : le suivi s'ajoute au blocage, il ne s'y substitue jamais.
  -> Traiter UI-005 avant la bascule DNS. Les deux fichiers etant des rasters,
  la regeneration passe par la source de design, pas par un redessin a la main.

### Important

- [ ] **[IMPORTANT]** `public/og-image-en.png` - **La carte anglaise porte le
  positionnement anglais perime.** Elle affiche "Enterprise software built for
  African markets", alors que la ligne anglaise validee, verrouillee par
  `CLAUDE.md` au point 6 de la liste des ecarts de maquette, est "Your technology
  partner for businesses across Africa." avec "OHADA and CIMA regions"
  (`src/i18n/en.ts:108-109`). La carte francaise a le meme probleme en plus
  discret : "Solutions technologiques pour les entreprises d'Afrique OHADA et
  CIMA." contre `src/i18n/fr.ts:106-107` "Votre partenaire technologique pour les
  entreprises Africaines." / "Zones OHADA et CIMA". Defaut preexistant, remonte
  au titre de la barre maximale, et surtout **non couvert par UI-005** : son
  critere 4, "The FR and EN variants differ only where they already differed",
  conserverait telle quelle la formulation fautive. Une regeneration qui repare
  le logo et laisse le positionnement est une occasion manquee sur le meme
  fichier.
  -> Ajouter un critere a `docs/work-items/UI-005.md` : les deux cartes reprennent
  le hero courant de `fr.ts` et de `en.ts`, et le critere 4 est reformule pour ne
  plus figer la copie.

- [ ] **[IMPORTANT]** `docs/vitrine/altarys-brand-identity-v3.1.html:191` et
  `CLAUDE.md:67` - **L'encart d'amendement ajoute par cette PR redirige vers la
  palette morte.** Il ecrit "Ce document reste la reference pour les couleurs, les
  polices et les echelles typographiques", et `CLAUDE.md:67` reprend la meme
  reduction de perimetre. Or la section couleurs de ce document est precisement
  la palette du decoupage produit abandonne : `--pap-amber: #D4810A` (ligne 21),
  `--ent-teal: #1A8FA0` (24), `--ent-teal-l: #4DB8CC` (25), avec leurs
  nuanciers aux lignes 395 a 403, ALTARYS ENTERPRISE presente comme une ligne de
  produit vivante (528, 594 a 607) et la regle "Ne pas melanger palette Papillon
  (amber) avec palette Enterprise (teal)" (763). `CLAUDE.md` dit ailleurs que
  l'ambre et le turquoise ont disparu et que toute couleur vient de `tokens.css`.
  L'encart etait le moment de retirer l'autorite sur les couleurs ; il l'a
  reaffirmee sur exactement le mauvais axe. Le prochain auteur envoye chercher
  "la reference des couleurs" y trouvera d'abord de l'ambre et du turquoise.
  -> Restreindre l'encart et la ligne de `CLAUDE.md` aux polices et aux echelles
  typographiques, et dire que les couleurs font foi dans `src/styles/tokens.css`
  seul, la section couleurs de la v3.1 portant une palette abandonnee.

- [ ] **[IMPORTANT]** `docs/work-items/UI-005.md:3` - **Le type declare contredit
  l'identifiant et l'arbre de decision.** Le document porte `Type: CHR` tout en
  etant numerote `UI-005`, forme reservee a une STORY. `docs/AI_Development_Workflow.md:129-141`
  tranche dans les deux sens : regenerer une carte de partage se voit d'un
  visiteur, donc STORY, et repare accessoirement un asset qui ment, donc FIX ;
  dans les deux cas ce n'est pas un CHR, et un vrai CHR devrait s'appeler
  `UI-CHR-NNN`. La consequence est concrete : `.claude/commands/review.md` dit
  qu'un chore "touche docs, conventions ou outillage seulement" et qu'"il n'y a
  rien a verifier visuellement ; ne pas fabriquer de constats". Un reviewer
  prenant UI-005 se verrait donc dispenser par le document lui-meme du seul
  controle qui compte sur un item dont toute la substance est une image.
  -> Passer le champ a `STORY` en gardant `UI-005`, ou renommer en `UI-FIX-NNN`
  si l'angle retenu est la reparation d'un asset devenu faux.

- [ ] **[IMPORTANT]** `docs/work-items/UI-005.md:36` - Le document renvoie a
  `OG_IMAGES = { fr: '/og-image.png', en: '/og-image-en.png' }`. La constante
  n'existe pas : `src/layouts/BaseLayout.astro:20` declare `OG_DEFAULT`, consomme
  a la ligne 35 (`ogImage ?? OG_DEFAULT[locale]`). Les couples cle/valeur sont
  exacts, l'identifiant ne l'est pas. Le document existe pour guider son futur
  auteur vers le seul fichier a ne pas toucher ; il l'envoie grepper un nom
  absent.
  -> `OG_IMAGES` -> `OG_DEFAULT`.

### Suggestions

- **[SUGGESTION]** `docs/work-items/UI-005.md` - L'item de suivi n'a pas de ligne
  D dans `docs/DECISIONS.md`, alors que `REVIEWER.md` decrit le suivi d'un
  blocage hors perimetre comme "un work item sous `docs/work-items/` plus une
  ligne D". Ici le report vient de l'auteur et non d'un blocage de revue, donc la
  regle ne s'applique pas a la lettre ; une ligne D consignerait tout de meme
  pourquoi la marque a circule en deux versions pendant un temps.

- **[SUGGESTION]** `docs/reviews/UI-004-review.md` - Les cases des constats de la
  ronde 1 sont restees `- [ ]` alors que les cinq sont traites. Sans consequence
  technique, mais un lecteur pressé du fichier conclut l'inverse.

- **[SUGGESTION]** `public/assets/favicon.svg` - Le fichier n'a pas de variante
  pour un onglet en theme sombre : `#C8922A` en dur y tient sur clair comme sur
  sombre, ce qui est acceptable pour un or, mais une `<style>` interne avec
  `prefers-color-scheme` est le seul moyen d'y faire varier la marque si le
  besoin apparait. Rien a changer aujourd'hui.

### Correctness (code-review skill)

Le squelette `code-review:code-review` a ete invoque sur la PR #33 sous son nom
qualifie de plugin, conformement a D084. **Il s'arrete a sa propre etape 1** :
cette etape ecarte toute PR fermee, et la #33 est `MERGED`. Il n'a donc produit
ni analyse ni commentaire propre, et la PR ne portera qu'un seul commentaire pour
cette ronde. Ce n'est pas un contournement de l'etape : c'est le comportement
documente du squelette sur une PR fermee, deja constate en D084.

Le balayage generique a donc ete refait a la main, par trois agents paralleles
sur le meme diff `3746e077..HEAD` : conformite a `CLAUDE.md`, chasse aux bogues
mecaniques, et verification arithmetique et documentaire de chaque affirmation
portee par les commentaires et les documents. Resultats retenus apres
confirmation personnelle contre le code :

- **[IMPORTANT]** `docs/work-items/UI-005.md:36` - `OG_IMAGES` au lieu de
  `OG_DEFAULT`. Confirme en lisant `BaseLayout.astro:20` et `:35`. Detaille
  plus haut.
- **[IMPORTANT]** `docs/work-items/UI-005.md:3` - type CHR contre identifiant de
  STORY. Confirme contre `docs/AI_Development_Workflow.md:129-141`. Detaille plus
  haut.
- Ecarte comme faux positif : rien a signaler sur les composants. Aucun appelant
  residuel des props supprimees `variant`, `width` et `title` dans `src/`,
  `Logo.astro` n'est importe que par `Header.astro:2` et `Footer.astro:2`, aucune
  regle CSS morte, aucun selecteur oriente sur une classe disparue, aucun hex en
  dur ajoute a un composant, aucun tiret cadratin ni point median dans les douze
  fichiers touches ni dans les messages de commit.

### Ce qui a ete verifie et tient

- **Build et types** : `npm run build` vert, 26 pages ; `npm run check` 0 erreur,
  0 avertissement, 0 indice. Aucun `any`, aucun `@ts-ignore`, aucun `Dictionary`
  desserre. Le build ne depend d'aucun fichier local non commite.
- **Parite FR/EN** : aucune route, aucune cle de dictionnaire, aucune balise SEO
  touchee. Le seul texte localise est l'`aria-label` de l'ancre, mesure sur la
  page rendue a `ALTARYS LABS, Accueil` en FR et `ALTARYS LABS, Home` en EN, aux
  trois largeurs. `lang` correct sur `<html>` des deux cotes. `Dictionary`
  toujours derive de `fr.ts`.
- **Fidelite a la maquette** : `Header.dc.html` et `Footer.dc.html` relus en
  direct a la racine du projet de design. L'instantane rafraichi dans
  `docs/vitrine/refonte/prototypes/` en est fidele. Valeurs mesurees sur la page
  rendue et confrontees a la maquette : diamant 30x28 au header et 28x26 au pied
  de page sur `viewBox 0 0 76 70`, `ALTARYS` 15 px / 3 px d'interlettrage /
  `rgb(26,39,64)` au header et 14,5 px / 2,5 px / `rgb(250,247,242)` au pied de
  page, `LABS` 9,5 px / 4 px / `rgb(139,94,27)` au header et 10 px / 3 px /
  `rgb(229,181,90)` au pied de page, gouttiere 10 px. Le pied de page depouille
  bien pastilles et facette (0 `circle`, 1 `polygon`), le header les garde
  (4 `circle`, 2 `polygon`). Une seule graisse de diamant par page. Aucun HTML a
  style en ligne recopie d'un `.dc.html`, rien tire de `support.js`.
- **Marque** : aucun hex en dur ajoute dans un composant, tout passe par
  `tokens.css`. Aucun ambre, aucun turquoise, aucun violet dans le code livre.
  Trois produits, aucun ALTARYS ENTERPRISE sur une page publique.
- **Accessibilite** : navigation au clavier verifiee par vraies frappes Tab, pas
  par `focus()` : l'ordre est skip-link, logo, lien de nav, bouton de menu, et
  chaque etape calcule `outline: rgb(184,121,30) solid 2px`, decalage 3 px, avec
  `:focus-visible` reellement apparie. Cet anneau `--gold-deep` sur creme mesure
  3,45:1, au-dessus du seuil 3:1 de la regle 1.4.11 pour un indicateur de focus ;
  au pied de page `--gold` sur `#040C16` monte a 7,11:1. SVG `aria-hidden="true"`
  aux deux endroits et sans descendant focalisable, nom accessible unique porte
  par l'ancre et contenant le texte visible, donc 2.5.3 tenu. Un seul `h1` par
  page. Le texte "ALTARYS LABS" du verrou est un vrai noeud de texte avec une
  espace, donc lu en deux mots. Cibles a 44 px aux deux ancres. Aucun
  chevauchement de la zone cliquable etendue du pied de page avec un autre
  element interactif : `elementFromPoint` renvoie l'ancre elle-meme en haut comme
  en bas de sa boite.
- **SEO** : `BaseLayout.astro` garde la main sur canonical, hreflang, OG, Twitter,
  JSON-LD et sitemap. `og-image.png`, `og-image-en.png` et `assets/favicon.svg`
  sont bien presents dans `public/` et repris dans `dist/`. Aucune route ajoutee,
  `robots.txt` inchange, aucune page orpheline.
- **Performance** : aucun JavaScript client ajoute, aucune dependance, aucune
  ressource externe bloquante. Le mot-marque en texte HTML retire deux elements
  `<text>` du DOM SVG. Aucune graisse de police supplementaire demandee.
- **Deploiement** : sortie statique preservee, `pages_build_output_dir` toujours
  `./dist`, binding D1 toujours commente, aucun secret, aucun adaptateur. La PR
  visait bien `refonte-multipages`.
- **Garde-fous editoriaux** : aucune copie publique touchee. Aucun prix, aucun nom
  de client, aucune date exacte, aucun chiffre invente.

### Summary
Les cinq constats de la ronde 1 sont tous leves et verifies sur la page rendue,
pas seulement sur la source : plus de soulignement, cibles a 44 px aux deux
ancres sans deplacement de la mise en page, graisse 600 reellement chargee,
renvois de decision exacts et favicon recentre. Le travail sur le verrou est
propre et fidele aux deux maquettes lues a la racine du projet de design. Ce qui
bloque est ce que la PR laisse derriere elle : les deux images Open Graph portent
toujours l'ancien logomark sur les 26 pages et dans les deux langues, et la carte
anglaise y ajoute un positionnement que `CLAUDE.md` a explicitement remplace. Le
suivi UI-005 existe mais se declare CHR, renvoie a une constante qui n'existe pas
et fige par son critere 4 la copie qu'il faudrait justement corriger ; enfin
l'encart d'amendement ajoute a la charte v3.1 redirige le prochain lecteur vers
une section couleurs faite d'ambre et de turquoise.
