# SITE-FIX-002 - Revue

## Round 1 - 2026-08-03
**Verdict**: CHANGES REQUESTED

### Perimetre de la revue

Diff `origin/refonte-multipages...fix/worktree-de-revue` : 3 fichiers, 10 insertions, 7 suppressions.
`.claude/commands/review.md`, `.claude/reviewer-append.txt`, `docs/DECISIONS.md`.
Aucun fichier sous `src/`, `public/`, `astro.config.mjs`, `wrangler.jsonc` ou `package*.json` n'est touche.

Revue conduite dans un worktree dedie forke depuis `origin/fix/worktree-de-revue`, sur la branche
`review-site-fix-002`, c'est-a-dire en appliquant la procedure meme que cette PR introduit. La branche
de l'item etait deja checkoutee dans le worktree de l'auteur : le scenario du defaut D052 etait donc
reellement reuni, et la nouvelle forme a bien produit une branche nommee, pas un HEAD detache.

### Verifications executees

| Etape | Resultat |
|---|---|
| `npm ci` | OK |
| `npm run build` | OK, 26 pages, `dist` produit |
| `npm run check` | OK, 60 fichiers, 0 erreur, 0 avertissement, 0 indication |
| `npm run preview` + captures | OK, FR `/` et EN `/en` a 360, 768 et 1440 px via `bin/review_shots` |
| Em-dash et interpunct dans le diff | Aucun |
| Palette, produits, garde-fous editoriaux sur les rendus | Conformes |

**Controle visuel.** La PR ne touche aucune surface rendue : la sortie de build est identique a celle de
`refonte-multipages` par construction, puisque zero fichier de `src/` ou de `public/` n'est modifie. Les
six captures FR et EN ont tout de meme ete prises comme controle de non-regression et ne montrent rien
d'anormal : marine et or uniquement, aucun violet, aucun ambre, aucun sarcelle, trois produits,
"Papillon Corporate Finance Suite" avec son "Suite", PCS en "Disponible T3 2026", RCCM `CI-ABJ`, aucun
prix affiche, appel a l'action commercial. Aucun oeil du fondateur n'est du sur cette PR.

**Ecart de procedure a signaler.** L'etape 6 de `review.md` impose un passage generique via la skill
`code-review`. Elle n'est pas invocable dans cette session : `Skill code-review cannot be used with Skill
tool due to disable-model-invocation`. Le balayage de correction generique a donc ete fait a la main.
Sur un diff purement documentaire, sans import, sans promesse et sans binding, sa valeur ajoutee etait
de toute facon nulle ; la sous-section dediee est laissee vide en consequence, et l'indisponibilite de
la skill est signalee ci-dessous en suggestion.

### Blockers

- [ ] **[BLOCKER]** `.claude/commands/review.md:53` - L'etape 3 echoue durement des la deuxieme ronde de
  revue d'un meme item. `git worktree add ... -b review-<id-lowercase> origin/<branche>` cree une branche,
  et rien nulle part dans la procedure ne la supprime jamais : ni `review.md`, ni `REVIEWER.md`, ni
  `TECH_LEAD.md`, ni `AI_Development_Workflow.md` ne contiennent la moindre instruction de teardown
  (`git worktree remove`, `git worktree prune`, `git branch -d`). A la ronde suivante, la branche existe
  encore et `git worktree add -b` refuse. Verifie reellement :
  `git worktree add /tmp/wt-collide-test -b review-page-001 origin/feat/accueil-bilingue`
  -> `fatal: a branch named 'review-page-001' already exists`.
  Ce n'est pas theorique : `review-page-001` est presente dans ce depot a l'instant, laissee par la
  ronde R1 de PAGE-001 que D052 cite justement comme origine de l'item, et D053 impose de lancer une
  ronde 2 sur PAGE-001. La toute prochaine utilisation de l'etape 3 corrigee echoue donc. La procedure
  est explicitement multi-rondes : etape 10 "Determine N by counting existing `## Round` headings and
  adding 1", et `AI_Development_Workflow.md` ligne 110 "Fix, push, then R2, then R3 if needed". Le
  critere d'acceptation 1 de l'item ("Following `review.md` step 3 literally ... produces a worktree on a
  named branch") n'est donc satisfait qu'a la premiere ronde.
  -> Ajouter une etape 13 de teardown explicite, executee en fin de ronde et repercutee mot pour mot dans
  `.claude/reviewer-append.txt` :
  `git worktree remove .claude/worktrees/review-<ID>` puis
  `git branch -D review-<id-lowercase>`.
  Et rendre l'etape 3 idempotente malgre tout, pour la ronde dont la precedente s'est mal terminee, par
  exemple en supprimant la branche si elle traine avant de recreer le worktree. Supprimer aussi la
  branche `review-page-001` orpheline, dans SITE-CHR-002 ou dans cet item.

### Important

- [ ] **[IMPORTANT]** `.claude/commands/review.md:54` - Le garde-fou ment sur la cause de l'echec. Le bloc
  de l'etape 3 est une suite de trois commandes sans `set -e` : quand `git worktree add` echoue, pour
  n'importe quelle raison (collision de branche ci-dessus, chemin deja occupe, ref invalide), le shell
  enchaine quand meme sur la ligne suivante, `git -C <chemin> symbolic-ref` echoue parce que le repertoire
  n'existe pas, et le garde-fou affiche `detached HEAD, stop`. Verifie :
  `git -C /tmp/wt-does-not-exist symbolic-ref -q HEAD >/dev/null || echo "detached HEAD, stop"`
  -> `fatal: cannot change to ... No such file or directory` puis `detached HEAD, stop`.
  Le relecteur est donc oriente vers un HEAD detache alors que le probleme est ailleurs. C'est
  exactement le mode de defaillance que l'item entend eliminer, deplace d'un cran : D052 pose que
  "le garde-fou est la partie qui compte" parce qu'il transforme un echec silencieux en echec bruyant ;
  un echec bruyant mais faux n'est pas meilleur qu'un echec silencieux, il coute une investigation. Il
  aggrave directement le blocker ci-dessus, dont c'est le message d'erreur qu'un relecteur verra.
  -> Controler d'abord le code de retour de la creation, puis seulement l'etat de HEAD, avec deux messages
  distincts : `git worktree add ... || { echo "creation du worktree echouee, stop"; exit 1; }` puis
  `git -C ... symbolic-ref -q HEAD >/dev/null || { echo "HEAD detache, stop"; exit 1; }`.

- [ ] **[IMPORTANT]** `docs/AI_Development_Workflow.md:194-197` - La section "Branch and worktree
  discipline" est desormais incomplete et trompeuse. `CLAUDE.md` la designe comme le document de
  reference sur la discipline de branches ; elle enumere la convention de worktree des items
  (`git worktree add -b <type>/<slug> .claude/worktrees/<slug> refonte-multipages`) et ignore totalement
  la nouvelle classe de branches `review-<id-lowercase>` que cette PR institue, ainsi que son cycle de
  vie. Un lecteur qui decouvre `review-page-001` ou `review-site-fix-002` dans `git branch` ne trouve
  aucune trace de leur legitimite dans le document cense la porter. Le critere d'acceptation 3 de l'item
  interdit justement que deux documents decrivant la meme procedure divergent ; un troisieme document a
  ete laisse en arriere.
  -> Ajouter une puce a la section "Branch and worktree discipline" : la revue vit sur une branche
  `review-<id-lowercase>` forkee de la branche de l'item, jetable, poussee par refspec explicite sur la
  branche de l'item, et supprimee en fin de ronde.

### Suggestions

- **[SUGGESTION]** `.claude/autonomous-reviewer-settings.json:25` (pre-existant, NON CONFIRME) -
  L'allowlist du relecteur autonome accorde `Edit(docs/reviews/**)` mais pas `Write(docs/reviews/**)`,
  alors que `REVIEWER.md` prescrit en mode autonome d'ecrire le fichier "directly with Write or Edit" et
  que `review.md` etape 10 prevoit explicitement le cas ou le fichier n'existe pas encore. Une ronde R1
  est par definition celle ou `docs/reviews/<ID>-review.md` n'existe pas et ne peut donc etre creee
  qu'avec `Write`. Classe en suggestion et non en blocage parce que l'observation contredit la lecture :
  la creation de ce fichier-ci, en ronde R1 et en mode autonome, a reussi malgre l'absence d'entree
  `Write`. Le defaut n'est donc pas confirme, et la regle de la barre maximale reserve le blocage aux
  constatations verifiees.
  -> Verifier si `Edit(...)` couvre bien `Write(...)` dans le moteur de permissions ; si ce n'est pas
  garanti, ajouter `"Write(docs/reviews/**)"` a l'allowlist plutot que de dependre d'un comportement
  implicite.

- **[SUGGESTION]** `.claude/commands/review.md:54` - Sous la forme retenue (Option A), le garde-fou ne peut
  plus se declencher sur la condition qu'il vise. Avec `-b <nouvelle-branche>`, `git worktree add` produit
  soit un HEAD symbolique, soit un echec ; le HEAD detache est devenu inatteignable. D054 le presente
  pourtant comme ce qui "turns the silent detachment into a loud failure at step 3". Garder le garde-fou
  comme defense en profondeur est sain, il rattraperait un futur retour a la forme ancienne, mais la
  justification de D054 surestime ce qui a reellement ete livre.
  -> Annoter D054 d'une phrase : sous l'Option A le garde-fou est une defense en profondeur contre une
  regression ulterieure, la protection reelle etant le `-b` lui-meme.

- **[SUGGESTION]** `.claude/commands/review.md:97` - `git push origin HEAD:<branche>` est rejete en
  non-fast-forward si l'auteur a pousse sur `<branche>` entre le fork et la fin de la ronde, ce qui arrive
  des qu'une ronde est longue ou qu'un correctif part en parallele. L'echec est bruyant, mais il tombe au
  dernier geste d'une ronde couteuse, sans indication de sortie.
  -> Documenter la reprise en une ligne : `git fetch origin && git rebase origin/<branche>` puis repousser.

- **[SUGGESTION]** `.claude/commands/review.md:53` et `:57` - L'etape 3 forke depuis `origin/<branche>` alors
  que l'etape 4 diffe toujours contre la ref locale `<branche>`. Les deux coincident presque toujours, mais
  l'incoherence permet en principe de reviser un contenu et d'en diffe un autre.
  -> Aligner l'etape 4 sur `git diff origin/refonte-multipages...origin/<branche>`.

- **[SUGGESTION]** `.claude/commands/review.md:56` - La justification ajoutee et l'instruction operationnelle
  "All subsequent work MUST happen inside ..." sont fondues dans un seul paragraphe de six lignes, ce qui
  enterre l'instruction sous le rationnel. Preference de lisibilite, rien d'objectivement faux.
  -> Separer en deux paragraphes, le rationnel d'abord, l'instruction ensuite.

- **[SUGGESTION]** Outillage, hors diff - La skill `code-review`, rendue obligatoire par l'etape 6 de
  `review.md`, n'est pas invocable par le modele dans la session du relecteur
  (`disable-model-invocation`). Une etape obligatoire qu'aucune ronde ne peut executer est une etape qui
  sera silencieusement sautee, ronde apres ronde.
  -> Soit autoriser l'invocation de la skill dans la configuration du relecteur, soit requalifier l'etape 6
  en "si disponible" et exiger que son indisponibilite soit declaree dans la ronde.

### Correctness (code-review skill)

Aucune constatation. La skill n'a pas pu etre invoquee (voir ci-dessus) et le balayage manuel de
remplacement n'a rien trouve : le diff ne contient ni code, ni import, ni promesse, ni binding, ni
suppression de type.

### Ce qui est correct

- Le defaut vise est reel et le diagnostic de l'item est exact. La forme corrigee resout bien le cas
  nominal, verifie en conditions reelles dans cette ronde meme.
- `.claude/commands/review.md` et `.claude/reviewer-append.txt` decrivent la meme procedure : branche
  dediee, garde-fou, `git push origin HEAD:<branche>`. Le critere d'acceptation 3 est tenu entre ces deux
  fichiers.
- D054 est bien formee, datee du 2026-08-03, rattachee a SITE-FIX-002, et nomme l'Option B comme
  alternative rejetee avec son motif. Elle suit D053 sans collision de numero.
- Aucun em-dash, aucun interpunct dans les fichiers modifies.
- Aucun secret, aucune dependance ajoutee, sortie statique et `pages_build_output_dir` inchanges, binding
  D1 toujours commente, PR ciblant bien `refonte-multipages` et non `main`.
- Aucune regle editoriale ni de marque n'est en cause : la PR ne touche aucune surface publique.

### Suivi

Aucun item de suivi n'est ouvert : le blocker et les deux points importants portent tous sur la procedure
de revue elle-meme, donc sur le perimetre de SITE-FIX-002, et se corrigent dans cette PR. Seule la
suppression de la branche orpheline `review-page-001` peut aller dans SITE-CHR-002, qui traite deja la
cloture de la revue PAGE-001, au choix du fondateur.

### Summary

Le defaut est correctement diagnostique et la forme retenue resout bien le cas nominal, verifie en
conditions reelles pendant cette ronde. Mais la procedure corrigee n'a pas de teardown : la branche
`review-<id-lowercase>` survit a la ronde et fait echouer durement `git worktree add -b` a la ronde
suivante, ce qui bloque des maintenant la ronde 2 de PAGE-001 imposee par D053, et le garde-fou attribue
cet echec a un HEAD detache qu'il n'a pas. Un teardown explicite, un garde-fou qui ne se trompe pas de
diagnostic et la mise a jour de la discipline de branches ferment l'item.
