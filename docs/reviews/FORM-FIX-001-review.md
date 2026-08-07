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
