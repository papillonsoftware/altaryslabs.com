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
