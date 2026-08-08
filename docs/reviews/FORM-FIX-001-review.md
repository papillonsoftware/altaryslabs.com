# FORM-FIX-001 - Revue

## Round 1 - 2026-08-07
**Verdict**: CHANGES REQUESTED

Perimetre revu : `git diff origin/refonte-multipages...origin/fix/contact-langue-saisie-jeton`,
6 fichiers, 293 insertions. Worktree de revue dedie, `npm ci`, `npm run build`,
`npm run check` relances de maniere independante, site servi et capture aux trois
largeurs dans les deux langues.

**La branche a avance pendant la ronde.** Le push de la revue a ete refuse en
non-fast-forward, et `8c9e1ce` etait arrive : fusion de `refonte-multipages` et
renumerotation des lignes D de D102-D106 en **D103-D107**. J'ai relu les commits
entrants. Aucun ne touche a la logique du lot : les quatre fichiers de code ne
recoivent que la renumerotation dans leurs commentaires, et `CLAUDE.md` n'est
modifie que sur la charte v3.1 et les vignettes de partage (D101, D102). Aucun
constat de cette ronde n'est perime; les citations ci-dessous portent les
nouveaux numeros et les numeros de ligne d'apres rebasage. Build et `astro check`
ont ete relances sur ce nouveau sommet et restent verts.

### Ce qui est verifie et tenu

Les cinq criteres du contrat sont atteints, et le code lui-meme est sain. Aucun
defaut de logique, de securite ou de perte de donnees n'a survecu a la
verification, ni dans ma lecture ni dans la passe generique.

| Critere | Preuve dans cette ronde |
|---|---|
| 1 - langue du widget | `data-language="fr"` dans `dist/contact/index.html`, `data-language="en"` dans `dist/en/contact/index.html`. **Confirme visuellement** : le meme Chrome, en-tetes identiques, rend le peritexte Turnstile en francais sur `/contact` ("Impossible de se connecter au site web / Resolution de problemes") et en anglais sur `/en/contact` ("Unable to connect to website / Troubleshoot"). C'est exactement la demonstration que l'attribut bat `Accept-Language` |
| 2 - saisie conservee | brouillon ecrit a `submit`, relu sur `?statut=erreur`, efface sur `?statut=envoye`; le jeton est exclu par construction, ce qui est necessaire |
| 3 - focus du panneau | `tabindex="-1"` present sur `#form-sent` et `#form-error` dans le HTML produit, focus differe a `DOMContentLoaded`, `scrollIntoView` qui lit `prefers-reduced-motion` au lieu de l'imposer |
| 4 - destinataire | repli sur `CONTACT_EMAIL`, un motif par ligne de journal; le test `recipient !== notifyEmail?.trim()` couvre correctement les trois cas absent, vide et blanc |
| 5 - liaison du jeton | `hostname` traverse les six chemins de retour de `verifyTurnstileToken` sans trou, comparaison a `new URL(request.url).hostname`, refus par defaut quand Cloudflare ne fournit rien |

Build vert, `astro check` a 0 erreur / 0 avertissement / 0 indice sur 64 fichiers,
26 pages generees. Aucune dependance ajoutee. Aucun cadratin ni point median dans
le diff ni dans le message de commit. Palette, typographie, jetons, garde-fous
editoriaux : rien touche, rien introduit. La PR vise bien `refonte-multipages`.

La divergence assumee avec la ronde 1 de `FORM-001` sur le critere 5 est la bonne
decision : comparer a l'hote de la requete plutot qu'a une liste blanche resiste
a la bascule DNS et aux URL de previsualisation par branche, et Turnstile
autorisant deja les sous-domaines d'un hote liste, `altaryslabscom.pages.dev`
couvre les previsualisations sans configuration supplementaire.

### Blockers

Aucun.

### Important

- [ ] **[IMPORTANT]** `CLAUDE.md:153-156` - La section Build & Deploy affirme encore que **trois** variables d'execution **doivent** exister sur le projet Pages, en Production et en Preview, `CONTACT_NOTIFY_EMAIL` (texte) comprise. D106, livree par cette PR, en fait un remplacement facultatif : en son absence la notification part vers `CONTACT_EMAIL`. Le document que le depot presente comme son contrat decrit donc desormais l'inverse du code. C'est le defaut le plus couteux du lot, parce que la prochaine session qui debogue le formulaire lira CLAUDE.md avant le code. -> Reecrire : deux secrets obligatoires, `TURNSTILE_SECRET_KEY` et `RESEND_API_KEY`; `CONTACT_NOTIFY_EMAIL` facultative, avec repli documente sur `CONTACT_EMAIL`.

- [ ] **[IMPORTANT]** `wrangler.jsonc:33-43` - Le bloc de commentaire annonce toujours "TROIS variables a definir dans le dashboard Cloudflare Pages" et decrit `CONTACT_NOTIFY_EMAIL` comme "texte, adresse qui recoit les notifications". Deux fois trompeur apres cette PR : la variable n'est plus a definir, et la justification meme de D106 pose qu'une variable en clair ne parvient pas a un projet configure par `wrangler.jsonc`. Le commentaire prescrit donc une action que la decision du meme lot declare sans effet. -> Reecrire le bloc : deux secrets obligatoires, remplacement facultatif, et dire explicitement qu'une variable de type texte est inerte sur ce projet.

- [ ] **[IMPORTANT]** `server/notify-resend.ts:4-5` - L'en-tete de fichier affirme "Ce message est interne : il part vers `CONTACT_NOTIFY_EMAIL`". Cette phrase est rendue fausse par les lignes 118-122 de la meme PR, qui ajoutent le repli sur `CONTACT_EMAIL`. Ce n'est pas un commentaire perime herite : la PR le perime elle-meme, il n'entre donc pas dans le report vers `FORM-CHR-001`. -> "il part vers `CONTACT_NOTIFY_EMAIL` ou, a defaut, vers `CONTACT_EMAIL`".

- [ ] **[IMPORTANT]** `server/turnstile.ts:4-6` - L'en-tete affirme "C'est cette verification, **et elle seule**, qui fait tenir l'anti-robot". Le commentaire ajoute par cette PR en `functions/api/contact.ts:177-183` dit exactement le contraire, "Un jeton valide ne suffit pas", et la seconde moitie du controle vit desormais hors de ce fichier. Un mainteneur qui lit `turnstile.ts` seul en conclut que ce module est autoportant et peut supprimer la comparaison d'hote sans voir ce qu'il ouvre. Meme raisonnement que ci-dessus : perime par cette PR, donc dans son perimetre. -> Nommer la comparaison d'hote comme la seconde moitie necessaire et renvoyer a D107.

- [ ] **[IMPORTANT]** `docs/reviews/FORM-001-review.md` - Le fichier est absent de cette branche **et** de `refonte-multipages`. Il n'existe que sur `origin/feat/formulaire-contact`, au commit `62a2148`, pousse apres la fusion de la PR #34 : cette branche ne sera plus jamais fusionnee, donc l'enregistrement durable de la ronde qui justifie tout ce lot n'atteindra jamais l'integration. Le corps de la PR #36 pointe vers ce chemin, et ce lien renvoie un 404. Le fichier de revue est, par convention du depot, le seul enregistrement durable d'une ronde; le perdre vide la boucle de revue de sa memoire. -> Reporter `62a2148` sur `fix/contact-langue-saisie-jeton` (`git cherry-pick 62a2148`), ce qui repare du meme geste le lien du corps de la PR.

- [ ] **[IMPORTANT]** `docs/work-items/FORM-FIX-001.md:89-92` - Le hors-perimetre renvoie quatre constats IMPORTANT confirmes de la ronde 1 de `FORM-001` vers `FORM-CHR-001`, et le corps de la PR fait de meme. **`FORM-CHR-001` n'existe nulle part** : ni `docs/work-items/FORM-CHR-001.md`, ni branche, ni ligne D. Le report n'est donc pas un suivi, c'est un abandon silencieux. La regle du depot est explicite : un defaut hors perimetre se materialise par un work item plus une ligne D, le suivi s'ajoute au blocage et ne le remplace pas. -> Creer `docs/work-items/FORM-CHR-001.md` avec les constats nommes un a un, ou replier les corrections dans cette PR; elles sont toutes d'une ligne.

- [ ] **[IMPORTANT]** `.gitignore:72-74` - "Les **quatre** variables du formulaire de contact vivent dans le dashboard Cloudflare Pages". Il y en a trois depuis D100, et deux seulement restent obligatoires depuis D106. Le compte est faux dans les deux sens, dans le fichier meme dont le role est d'empecher qu'un secret soit commite. Constat pre-existant de la ronde 1 de `FORM-001`, non traite, et que cette PR aggrave. -> Corriger le compte et le libelle.

- [ ] **[IMPORTANT]** `docs/kb/turnstile-d1-resend-setup.md:63-66` - "Le fichier de ce depot porte volontairement un bloc D1 commente en attendant cette etape" est faux : `wrangler.jsonc:25-31` porte un bloc `d1_databases` actif avec un `database_id` reel. Le guide dit a un operateur de reactiver quelque chose qui l'est deja, dans le seul document que quelqu'un ouvrira en urgence si la base doit etre recreee. Constat pre-existant, confirme. -> Reecrire la section 2 comme faite, ou dater le guide comme enregistrement historique.

- [ ] **[IMPORTANT]** `src/components/ContactContent.astro:424-426` - Le commentaire de `.turnstile-slot` justifie encore la hauteur reservee "que la cle soit posee ou non". Depuis D100 la cle ne peut plus etre absente, et le peritexte de la meme PR le dit lui-meme aux lignes 57-63. Les deux commentaires du meme fichier se contredisent, et cette PR edite justement l'element que le second decrit. -> Supprimer la justification a deux etats et ne garder que la reservation de hauteur.

### Suggestions

- **[SUGGESTION]** `functions/api/contact.ts:18-22` - L'en-tete se presente comme l'enumeration complete de l'ordre des operations ("Turnstile d'abord, validation ensuite, ecriture, puis notification") et n'a pas ete etendu au controle d'hote que la PR insere entre les deux premieres etapes, trente lignes plus bas. Incomplet plutot que faux, d'ou le classement, mais c'est le meme geste que les deux en-tetes ci-dessus. -> Ajouter l'etape et renvoyer a D107.

- **[SUGGESTION]** `docs/kb/turnstile-d1-resend-setup.md` - Le guide est integralement en francais alors que la regle du depot met la documentation et les specifications en anglais, les commentaires et les commits en francais. Un runbook operationnel se situe a la frontiere des deux; le constat a deja ete leve par la ronde 1 de `FORM-001` sans qu'aucune ligne D ne le tranche. -> Decision fondateur, puis ligne D, dans un sens ou dans l'autre.

- **[SUGGESTION]** `src/pages/confidentialite.astro:157-162` et `src/pages/en/privacy.astro:148-153` - La section 9 ne parle que de cookies. Le brouillon `sessionStorage` introduit par D104 n'est pas une collecte au sens de la politique (la saisie du visiteur reste dans son propre navigateur, meurt avec l'onglet, et n'est jamais transmise), donc rien n'est faux aujourd'hui. Une phrase le disant epargnerait la question a un lecteur qui inspecte le stockage de la page, sur une page ou la credibilite est precisement le sujet. -> Une ligne dans les deux langues, ou une decision explicite de ne pas la mettre.

### Correctness (code-review skill)

Passe generique executee via `code-review:code-review` sur la PR #36, nom
qualifie du greffon, conformement a D082. Cinq lecteurs independants : conformite
CLAUDE.md, balayage de bogues, contexte git et blame, commentaires des PR
anterieures sur ces memes fichiers, et conformite aux commentaires en place.

Retenu apres confirmation contre le code :

- **[IMPORTANT]** `server/notify-resend.ts:4-5` - en-tete rendu faux par la PR. Repris ci-dessus.
- **[IMPORTANT]** `server/turnstile.ts:4-6` - "et elle seule" contredit par D107. Repris ci-dessus.
- **[IMPORTANT]** `.gitignore:72`, `docs/kb/turnstile-d1-resend-setup.md:63`, `src/components/ContactContent.astro:424` - trois constats de la ronde 1 de `FORM-001` toujours vivants, reportes vers un `FORM-CHR-001` inexistant. Repris ci-dessus.
- **[SUGGESTION]** `functions/api/contact.ts:18-22` - enumeration non etendue. Reprise ci-dessus.
- **[SUGGESTION]** `server/notify-resend.ts:17` - le module importe tout le dictionnaire `fr` pour les seuls libelles de `pageName`, ce qui alourdit le bundle du Worker. Deja leve en suggestion par la ronde 1 de `FORM-001`, sans consequence fonctionnelle.

Ecarte comme faux positif :

- Le balayage de bogues, la lecture git et l'audit CLAUDE.md sont revenus vides. J'ai reverifie moi-meme les trois points ou un defaut etait plausible et je confirme l'absence : le `hostname` est bien propage sur les six chemins de retour de `verifyTurnstileToken` sans etat partiel; `recipient = notifyEmail?.trim() || CONTACT_EMAIL` traite correctement absent, vide et blanc, et l'avertissement ne se declenche que dans ces cas; la rehydratation n'ecrit que dans `.value`, jamais dans le document, donc le parametre d'URL ne peut rien injecter.
- La cle de brouillon `altarys.contact.brouillon` n'est pas prefixee par langue. Sans consequence : les valeurs d'`interest` sont des PageKeys identiques dans les deux langues, donc un brouillon francais se restaure correctement sur la page anglaise.

### Verification visuelle

`npm run preview` dans le worktree de revue, servi sur **http://localhost:4323**
(4321 et 4322 etaient pris par d'autres worktrees; proprietaire du port confirme
par `lsof -p ... -d cwd` pointant sur `review-FORM-FIX-001`). Douze captures via
`bin/review_shots`, une instance de Chrome, aux trois largeurs de la Definition
of Done.

| Surface | 360 | 768 | 1440 |
|---|---|---|---|
| `/contact` | conforme | conforme | conforme |
| `/en/contact` | conforme | conforme | conforme |
| `/contact?statut=erreur` | conforme | conforme | conforme |
| `/en/contact?statut=envoye` | conforme | conforme | conforme |

Aucun ecart de gouttiere, d'echelle typographique, de jeton de couleur ni
d'alignement. La banniere d'erreur garde son filet lateral gauche et la carte de
succes son cadre centre, donc les deux etats restent distingues par la forme et
par le texte, jamais par la seule couleur. Navy et or seuls, aucun ambre, aucun
sarcelle, aucun violet. Cormorant Garamond sur les titres, DM Sans sur le corps,
Space Mono sur les eyebrows.

Une seule reserve, et elle est un artefact de bac a sable : le widget Turnstile
ne peut pas joindre `challenges.cloudflare.com` depuis cet environnement, si bien
que les captures montrent son peritexte d'erreur au lieu de la case a cocher.
C'est ce qui rend la preuve du critere 1 particulierement propre - le peritexte
d'erreur est lui aussi localise par `data-language` - mais le rendu nominal du
widget reste un oeil du fondateur sur le deploiement. Le point 2 du "Still to
verify" du work item couvre deja ce controle.

### Summary

Le code est bon : les cinq criteres sont atteints, la comparaison d'hote est la
meilleure forme de la correction demandee, et la conservation de la saisie repare
le defaut le plus couteux commercialement du formulaire. Ce qui bloque est
entierement documentaire et entierement verifie : cette PR change le contrat
d'execution de `CONTACT_NOTIFY_EMAIL` et laisse `CLAUDE.md`, `wrangler.jsonc` et
l'en-tete de `notify-resend.ts` decrire l'ancien, perime "et elle seule" dans
`turnstile.ts`, reporte quatre constats confirmes vers un `FORM-CHR-001` qui
n'existe pas, et laisse la revue de `FORM-001` echouee sur une branche deja
fusionnee. Neuf corrections, toutes courtes, aucune ne touchant la logique.

---

## Round 2 - 2026-08-07
**Verdict**: CHANGES REQUESTED

Perimetre revu : `git diff origin/refonte-multipages...origin/fix/contact-langue-saisie-jeton`
au sommet `01cde29`, 12 fichiers, 683 insertions. Worktree de revue dedie sur
`review-form-fix-001`, `npm ci`, `npm run build` et `npm run check` relances de
maniere independante, site servi et pilote au protocole DevTools dans les deux
langues.

**Avertissement de numerotation.** Cette ronde est la ronde 2 du fichier de
revue de `FORM-FIX-001`. Ce que le doc de l'item, le corps de la PR et D111
appellent "round 2" est en realite la ronde 1 ci-dessus. Voir le constat 5.

### Ce qui est verifie et tenu

Les neuf constats de la ronde precedente sont tous traites, verifies un a un
contre le code, et aucun ne survit. Le diff de code est bien integralement fait
de commentaires : aucune ligne executable n'a bouge depuis la ronde 1, ce que
confirme la relecture ligne a ligne.

Les cinq criteres du contrat sont atteints, et cette fois **exerces dans un vrai
navigateur** et non seulement lus dans le HTML produit. Sonde CDP sur
`http://localhost:4323`, brouillon pose a la main puis pages chargees :

| Critere | Preuve mesuree cette ronde |
|---|---|
| 1 - langue du widget | `data-language="fr"` sur `/contact`, `"en"` sur `/en/contact`, lu sur le DOM rendu |
| 2 - saisie conservee | sur `/en/contact?statut=erreur`, les quatre champs testes reviennent peuples, `select` compris : `["Awa Kone","awa@ex.ci","productsHr","Trois paragraphes."]`; le brouillon est conserve apres relecture, et efface sur `?statut=envoye` |
| 3 - focus du panneau | `document.activeElement.id` vaut `form-error` sur les deux pages d'erreur et `form-sent` sur la page de succes; le formulaire est bien masque sur le succes |
| 4 - destinataire | `recipient = notifyEmail?.trim() \|\| CONTACT_EMAIL` couvre absent, vide et blanc; un motif par ligne de journal |
| 5 - liaison du jeton | `hostname` present sur les six chemins de retour de `verifyTurnstileToken`, comparaison a `new URL(request.url).hostname` placee apres `verdict.ok` et avant toute ecriture, refus par defaut quand Cloudflare ne fournit rien |

Build vert, 26 pages. `astro check` a 0 erreur / 0 avertissement / 0 indice sur
64 fichiers. Aucune dependance ajoutee, `package.json` et `package-lock.json`
intacts. Aucun cadratin ni point median dans le diff ni dans les messages de
commit. La PR vise bien `refonte-multipages`.

Palette verifiee mecaniquement sur le CSS produit : 22 hex distincts, aucun
ambre, aucun sarcelle, aucun violet, aucune teinte dans les plages 165-200 ni
255-330 degres. `bin/contrast_sweep` sur les deux pages Contact : aucun echec AA.
Un `h1` par page, aucun niveau saute. SEO central et reciproque : canoniques
justes, `hreflang` fr / en / x-default identiques des deux cotes, `og:locale`
`fr_CI` et `en`, vignettes `og-image.png` et `og-image-en.png` presentes dans
`public/`, les deux routes Contact dans le sitemap. Polices : un seul appel
Google Fonts avec `preconnect` et `display=swap`, exactement les graisses que
`CLAUDE.md` liste. Turnstile charge en `async defer`. Page a 28 Ko de HTML et
20 Ko de CSS.

### Blockers

Aucun.

### Important

- [ ] **[IMPORTANT]** `docs/kb/turnstile-d1-resend-setup.md:141-151` - La
  promesse centrale de cette PR est fausse sur l'un des quatre fichiers qu'elle
  nomme. D110 (`docs/DECISIONS.md:127`) affirme que le runbook ne porte "neither
  the list nor its count" et ajoute "no copy is allowed to carry one";
  `CLAUDE.md:156-158` le repete mot pour mot. Or la ligne 141 dit "Les **deux**
  cles, lues a l'execution par la fonction Pages :" et le tableau des lignes
  143-146 nomme `TURNSTILE_SECRET_KEY` et `RESEND_API_KEY`. C'est un compte et
  une liste partielle, sous une phrase, lignes 148-151, qui affirme le
  contraire : "Ce tutoriel n'en porte que la procedure de saisie". Le scenario
  de degradation est exactement celui que D110 existe pour fermer : le jour ou
  un troisieme secret apparait, ou ou `CONTACT_NOTIFY_EMAIL` redevient
  obligatoire, "Les deux cles" est faux, dans le document qu'un operateur ouvre
  en urgence. -> Retirer le compte de la ligne 141 (par exemple "Les cles a
  poser, lues a l'execution :") et, si le tableau doit rester comme procedure de
  saisie, dire explicitement qu'il ne fait pas foi sur la liste. Sinon, corriger
  D110 et `CLAUDE.md`, qui decrivent aujourd'hui un etat que le depot n'a pas.

- [ ] **[IMPORTANT]** `docs/DECISIONS.md:126-127` - Le journal saute de D107 a
  D110. D108 et D109 n'existent sur **aucune reference du depot** : ni sur
  `refonte-multipages`, ni sur une branche distante, ni sur une branche locale,
  ni dans l'historique. Le fichier a pourtant sa propre convention pour cela,
  ligne 130 : "D033 to D035 are reserved by `SITE-FIX-001` ... The gap is
  deliberate, not a missing entry." Rien d'equivalent ici, et
  `docs/work-items/FORM-FIX-001.md:121` enjambe le trou en silence ("D103 to
  D107, plus D110 and D111"). L'en-tete du journal demande a chaque session de
  relever le plus haut numero avant d'en assigner un : une session qui suit
  cette regle aujourd'hui trouve D108 et D109 libres et peut les reutiliser,
  soit la collision exacte que la note sur D033-D035 a ete ecrite pour empecher.
  Un trou non explique se lit aussi comme deux decisions perdues. -> Ajouter une
  ligne de reservation nommant qui les tient, ou renumeroter D110 et D111 en
  D108 et D109 et mettre a jour leurs cinq references.

- [ ] **[IMPORTANT]** `docs/work-items/FORM-FIX-001.md:125-135` - Le
  hors-perimetre renvoie cinq points (les trois suggestions de la ronde 1 de
  `FORM-001`, la frontiere de langue de `docs/kb/`, et la regle incomplete
  laissee dans D100 par D106) vers `SITE-FIX-011`. **`SITE-FIX-011` n'a ni
  fiche, ni ligne D, ni commit** : `docs/work-items/SITE-FIX-011.md` n'existe
  sur aucune reference, `grep` sur `docs/DECISIONS.md` ne renvoie rien, et la
  branche `fix/perimetre-des-items-de-suite` qui est censee le nommer ne porte
  aucun commit au-dela de `refonte-multipages`. C'est mot pour mot la structure
  que la ronde precedente a bloquee sur `FORM-CHR-001` : un report sans support
  est un abandon. Le doc l'ecrit lui-meme lignes 132-135 ("Its fiche must exist
  before either item merges, or this paragraph becomes the same defect finding 6
  reported"), ce qui nomme le risque sans le lever. Se signaler soi-meme n'est
  pas se corriger. -> Creer `docs/work-items/SITE-FIX-011.md` avec les cinq
  points enumeres un a un, plus sa ligne D, avant la fusion.

- [ ] **[IMPORTANT]** `docs/work-items/FORM-FIX-001.md:140-145` - La cause
  structurelle derriere le constat 5 de la ronde precedente (l'etape 11 de
  `.claude/commands/review.md` pousse le compte rendu sur la branche de l'item,
  et ses regles de cloture interdisent de le commiter sur `refonte-multipages`,
  donc toute ronde qui tourne apres la fusion perd son compte rendu) est
  reconnue comme reelle et renvoyee "in a separate `SITE` item". Cet item n'a
  **aucun identifiant** : pas de numero, pas de fiche, pas de ligne D, pas de
  branche. La regle du depot est que le hors-perimetre se materialise par un
  work item plus une ligne D, et que ce suivi s'ajoute au blocage sans le
  remplacer. Un renvoi vers un item anonyme est le degre zero du suivi : rien ne
  peut le retrouver. Et le defaut est cher, puisqu'il detruit l'enregistrement
  durable de rondes futures, ce dont cette PR a deja paye une instance. ->
  Attribuer un identifiant `SITE-FIX-NNN`, ouvrir la fiche, poser la ligne D.

- [ ] **[IMPORTANT]** `docs/work-items/FORM-FIX-001.md:85`,
  `docs/DECISIONS.md:128` et le corps de la PR - Trois documents renvoient a une
  "review round 2" / "ronde 2" de cet item pour designer des constats que
  l'enregistrement durable classe sous `## Round 1`. La reference ne resout deja
  pas aujourd'hui : un lecteur qui ouvre `docs/reviews/FORM-FIX-001-review.md` a
  la recherche de "Round 2" n'y trouve rien. **Et elle devient franchement
  fausse avec la presente ronde**, qui est la vraie Round 2 de ce fichier et
  porte d'autres constats : "review round 2" designera desormais deux rondes
  differentes selon le document ouvert. Le fichier de revue est par convention
  du depot le seul enregistrement durable d'une ronde; une reference croisee qui
  designe la mauvaise le vide de son usage. -> Reecrire ces trois renvois en
  "ronde 1 de `FORM-FIX-001`", ou en "la ronde qui a suivi la ronde 1 de
  `FORM-001`", sans reutiliser un numero que le fichier de revue attribue.

- [ ] **[IMPORTANT]** `src/components/LangSwitcher.astro:25`,
  `src/components/Header.astro:60` et `src/i18n/config.ts:20` - Trois
  `aria-label` des pages anglaises portent la typographie francaise, sur
  **toutes** les pages `/en/` du site : `aria-label="Change language : Francais"`,
  `aria-label="Products : Open menu"` et `aria-label="Services : Open menu"`,
  releves sur `dist/en/index.html`, `dist/en/about/index.html` et
  `dist/en/contact/index.html`. L'anglais ne met pas d'espace avant un
  deux-points; le francais si, et le cote francais est correct
  ("Produits : Ouvrir le menu"). La cause est la meme dans les deux composants :
  un litteral gabarit qui code en dur `` ` : ` `` pour les deux langues.
  `Francais` est en outre mal orthographie, sans cedille, dans un depot qui
  accentue partout ailleurs ("Legal", "Cote d'Ivoire", "Ouvrir"). La checklist
  de parite nomme explicitement les libelles ARIA parmi les surfaces ou une
  chaine ne doit pas fuir d'une langue a l'autre. Defaut pre-existant, non
  touche par cette PR, non arbitre a ce jour (aucune ligne D, aucun constat
  anterieur), donc bloquant a la barre maximale. -> Porter le separateur dans
  les dictionnaires (`fr.ts` avec l'espace insecable, `en.ts` sans espace)
  plutot que dans le gabarit, et corriger `Francais` en `Français`.

- [ ] **[IMPORTANT]** `src/styles/tokens.css:34-35` - `--ok: #2e7d52` et
  `--err: #b93838` sont declares et **jamais utilises** : `grep` sur
  `var(--ok)` et `var(--err)` ne renvoie rien dans `src/`, et le CSS produit ne
  contient que leurs declarations, zero reference. Ce sont deux valeurs hors
  palette, un vert et un rouge, servies sur chaque page du site, posees trois
  lignes sous le commentaire qui dit "Le site est integralement navy et or" et
  qui interdit de reintroduire une teinte retiree. La page Contact, elle,
  distingue deliberement succes et erreur par la forme et le texte plutot que
  par la couleur. Le prochain auteur qui cherche un jeton d'etat trouvera ces
  deux-la et peindra un rouge dans un site navy et or, avec l'autorite d'un
  jeton officiel. Code mort et risque de palette dans le fichier meme qui fait
  foi sur la palette. -> Supprimer les deux jetons, ou, s'ils sont voulus pour
  un usage futur, les documenter comme reserves et non utilisables sans decision
  fondateur.

### Suggestions

- **[SUGGESTION]** `src/components/ContactContent.astro:320-327` - `panneau.focus()`
  est appele sans `{ preventScroll: true }` juste apres un
  `scrollIntoView({ behavior: 'smooth' })`. En theorie le defilement implicite de
  `focus()` annule l'animation que les trois lignes precedentes prennent soin de
  conditionner a `prefers-reduced-motion`. **Je n'ai pas pu le confirmer** :
  mesure sur Chrome, depuis le bas de la page, `scrollY` evolue de facon
  identique avec et sans `preventScroll` (749 -> 709 contre 755 -> 729 a 60 ms,
  0 dans les deux cas a l'arrivee), le panneau etant de toute facon en haut du
  document donc la destination des deux defilements est la meme. Non confirme,
  donc non bloquant. -> Ajouter `{ preventScroll: true }` par surete si le
  panneau devait un jour descendre dans la page.

- **[SUGGESTION]** `docs/kb/turnstile-d1-resend-setup.md` et
  `docs/reviews/*.md` - La frontiere de langue reste non tranchee, et elle
  s'est elargie. Le runbook est en francais alors que la regle du depot met la
  documentation en anglais; le corpus des revues est lui-meme mixte
  (`FORM-001-review.md` et `PAGE-002-review.md` en anglais, `UI-004-review.md`
  et ce fichier en francais). Constat deja leve en ronde 1 de `FORM-001` puis en
  ronde 1 de cet item, sans ligne D. -> Une decision fondateur couvrant les deux
  familles, puis la ligne D, dans un sens ou dans l'autre.

- **[SUGGESTION]** `server/notify-resend.ts:17` - Le module importe tout le
  dictionnaire `fr` pour les seuls libelles de `pageName`, ce qui alourdit le
  bundle du Worker. Deja leve en ronde 1 de `FORM-001` et en ronde 1 de cet
  item; renvoye a `SITE-FIX-011`, voir le constat correspondant ci-dessus.

- **[SUGGESTION]** `wrangler.jsonc:53` - "et c'est deliberé" porte un seul
  accent, sur la derniere syllabe, dans un fichier qui ecrit sans accents
  partout ailleurs. Ni l'un ni l'autre : "délibéré" ou "delibere". Ligne non
  touchee par cette PR.

### Correctness (code-review skill)

Passe generique executee via `code-review:code-review` sur la PR #36, nom
qualifie du greffon, conformement a D082. Cinq lecteurs Sonnet independants :
conformite `CLAUDE.md`, balayage de bogues, contexte git et blame, commentaires
des PR anterieures sur ces memes fichiers, et conformite aux commentaires en
place.

Retenu apres confirmation contre le code :

- **[IMPORTANT]** `docs/DECISIONS.md:126-127` - trou D108 / D109 non explique.
  Leve independamment par le lecteur git et par le lecteur de commentaires, et
  reverifie par moi sur toutes les references. Repris ci-dessus.
- **[IMPORTANT]** `docs/work-items/FORM-FIX-001.md:125-135` - report vers
  `SITE-FIX-011` sans fiche. Leve par le lecteur des PR anterieures, qui a
  verifie que la branche `fix/perimetre-des-items-de-suite` ne porte aucun
  commit. Repris ci-dessus.
- **[IMPORTANT]** `docs/work-items/FORM-FIX-001.md:85` - "round 2" qui ne
  resout pas. Leve par le lecteur de commentaires. Repris ci-dessus.
- **[SUGGESTION]** `src/components/ContactContent.astro:327` - `focus()` sans
  `preventScroll`. Leve par le lecteur git, non confirme a la mesure, classe en
  suggestion pour cette raison.
- **[SUGGESTION]** `wrangler.jsonc:53` - "deliberé". Repris ci-dessus.

Ecarte comme faux positif :

- "Le fichier de revue est en francais alors que tous les autres sont en
  anglais, donc violation de la regle de langue." La premisse est fausse :
  `docs/reviews/UI-004-review.md` est en francais, `docs/reviews/UI-002-review.md`
  en anglais. Le corpus est mixte et la regle n'a jamais ete tranchee pour cette
  famille de documents. Reclasse en suggestion ci-dessus plutot que retenu comme
  constat.
- "Le runbook ne porte plus ni liste ni compte, D110 tient." Verifie moi-meme et
  **infirme** : la ligne 141 porte un compte et le tableau une liste partielle.
  C'est le constat IMPORTANT numero 1 ci-dessus, et c'est le seul point ou ma
  lecture contredit celle de la passe generique.
- Le balayage de bogues est revenu vide, et je le confirme. J'ai reverifie
  moi-meme les quatre points ou un defaut etait plausible : l'ecouteur `submit`
  est bien enregistre avant le retour anticipe sur `statut`, donc le brouillon
  est capture quel que soit l'etat de l'URL; `typeof brouillon[nom] === 'string'`
  preserve correctement une chaine vide sur les deux champs facultatifs; la
  comparaison d'hote est placee apres `verdict.ok` et avant toute ecriture; et
  `URL.hostname` comme l'hote rapporte par Cloudflare sont tous deux en
  minuscules, donc aucun risque de casse.
- La cle de brouillon `altarys.contact.brouillon` n'est pas prefixee par langue.
  Verifie a l'execution cette ronde : un brouillon dont `interest` vaut
  `productsHr` se restaure correctement sur la page anglaise, les valeurs etant
  des PageKeys communes aux deux langues. Sans consequence.

### Verification visuelle

`npm run preview` dans le worktree de revue, servi sur **http://localhost:4323**
(4321 et 4322 pris par d'autres worktrees; proprietaire du port confirme,
`lsof -nP -iTCP:4323 -sTCP:LISTEN` puis `lsof -p 89124 -d cwd` pointant sur
`review-FORM-FIX-001`). Douze captures via `bin/review_shots`, une instance de
Chrome, aux trois largeurs de la Definition of Done, plus une sonde CDP separee
pour l'etat du DOM.

| Surface | 360 | 768 | 1440 |
|---|---|---|---|
| `/contact` | conforme | conforme | conforme |
| `/en/contact` | conforme | conforme | conforme |
| `/contact?statut=erreur` | conforme | conforme | conforme |
| `/en/contact?statut=envoye` | conforme | conforme | conforme |

Aucun ecart de gouttiere, d'echelle typographique, de jeton de couleur ni
d'alignement par rapport a la ronde 1, qui est la reference de non-regression
ici : le diff de code de cette ronde ne peint rien. La banniere d'erreur garde
son filet lateral gauche gold et la carte de succes son cadre centre, donc les
deux etats restent distingues par la forme et par le texte, jamais par la seule
couleur. Cormorant Garamond sur les titres, DM Sans sur le corps, Space Mono sur
les eyebrows et le bandeau legal.

Meme reserve qu'a la ronde 1, et c'est un artefact de bac a sable : le widget
Turnstile ne joint pas `challenges.cloudflare.com` depuis cet environnement, si
bien que les captures montrent son peritexte d'erreur, en francais sur `/contact`,
au lieu de la case a cocher. Le rendu nominal du widget reste un oeil du
fondateur sur le deploiement, ce que le point 2 du "Still to verify" du work item
couvre deja.

### Summary

Le lot de code est bon et il est maintenant prouve a l'execution : les cinq
criteres passent dans un vrai navigateur, dans les deux langues, et les neuf
constats de la ronde precedente sont tous traites. Ce qui bloque est a nouveau
entierement documentaire, mais deux constats touchent le coeur meme de ce que
cette PR pretend accomplir : la regle d'enumeration unique de D110 est fausse sur
le runbook, qui porte encore un compte et une liste, et le journal des decisions
ouvre un trou non explique en D108-D109. S'y ajoutent deux reports vers des items
qui n'existent pas, un `SITE-FIX-011` sans fiche et un item `SITE` sans meme un
identifiant, soit exactement la structure que la ronde precedente a bloquee sur
`FORM-CHR-001`, plus deux defauts latents confirmes hors perimetre : la
typographie francaise dans trois `aria-label` anglais de tout le site, et deux
jetons de couleur morts et hors palette dans `tokens.css`.
