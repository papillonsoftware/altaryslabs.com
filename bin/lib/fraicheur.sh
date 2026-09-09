#!/bin/bash
# ALTARYS LABS - altaryslabs.com
# Garde-fou de fraicheur partage par bin/reviewer et bin/autonomous_reviewer.
#
# Les deux lanceurs amorcent la session avec --system-prompt-file
# .claude/personalities/REVIEWER.md et --append-system-prompt depuis
# .claude/reviewer-append.txt. Ces deux chemins sont resolus dans l'arbre de
# travail d'ou le script tourne, quel qu'il soit. Si cet arbre est en retard sur
# origin/post-refonte, le relecteur recoit une version perimee de ses
# propres instructions et RIEN ne le lui signale.
#
# Constate reellement sur la ronde 3 de SITE-FIX-002 : l'arbre etait 20 commits
# en retard, la session a donc ete amorcee avec un REVIEWER.md anterieur a
# SITE-FIX-001. Elle a recu l'ordre de lancer la skill a --effort high (mandat
# retire par D033) et celui de comparer les rendus au dossier fige
# design_handoff_altaryslabs_refonte/, que D037 et CLAUDE.md interdisent
# explicitement. Sur une PR touchant des pages, cette derive produit des
# constatations visuelles fausses, sans aucun moyen pour la ronde de s'en rendre
# compte.
#
# C'est la meme classe de defaut que D052 : une procedure qui fait
# silencieusement autre chose que ce qu'elle annonce. Le garde-fou la rend
# bruyante, au premier geste, la ou l'operateur peut encore agir.
#
# Complete D058, qui impose de lancer le relecteur depuis le worktree de l'item
# plutot que depuis le checkout principal : la convention dit OU lancer, ce
# controle verifie que l'arbre en question est effectivement a jour.
#
# Le fichier est partage plutot que duplique dans les deux lanceurs : deux copies
# d'une meme procedure divergent, c'est precisement ce que le critere
# d'acceptation 3 de SITE-FIX-002 interdit.

# Les trois seuls fichiers dont la peremption fausse une ronde. Le controle porte
# sur eux et sur rien d'autre : une branche d'item est en retard sur l'integration
# par construction, et arreter sur un ecart quelconque reviendrait a interdire la
# revue de toute PR ouverte du depot, y compris celle qui livre ce garde-fou.
FICHIERS_AMORCAGE=(
  ".claude/personalities/REVIEWER.md"
  ".claude/reviewer-append.txt"
  ".claude/commands/review.md"
)

verifier_fraicheur() {
  local base="origin/post-refonte"

  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "ERREUR : $(pwd) n'est pas un depot git. Lancer le relecteur depuis le worktree de l'item." >&2
    exit 1
  fi

  if ! git fetch origin --quiet; then
    echo "ERREUR : 'git fetch origin' a echoue. Impossible de verifier la fraicheur des instructions du relecteur." >&2
    echo "Retablir l'acces reseau puis relancer ; ne pas contourner ce controle." >&2
    exit 1
  fi

  local retard
  if ! retard=$(git rev-list --count "HEAD..$base" -- "${FICHIERS_AMORCAGE[@]}" 2>/dev/null); then
    echo "ERREUR : impossible de comparer cet arbre a $base." >&2
    echo "La ref existe-t-elle ? Verifier 'git rev-parse --verify $base' puis relancer ;" >&2
    echo "ne pas contourner ce controle." >&2
    exit 1
  fi

  if [ "$retard" -ne 0 ]; then
    echo "ERREUR : les instructions du relecteur sont en retard de $retard commit(s) sur $base." >&2
    echo "" >&2
    echo "Fichiers surveilles :" >&2
    printf '  %s\n' "${FICHIERS_AMORCAGE[@]}" >&2
    echo "" >&2
    echo "Commits en cause :" >&2
    git log --oneline "HEAD..$base" -- "${FICHIERS_AMORCAGE[@]}" | sed 's/^/  /' >&2
    echo "" >&2
    echo "Une ronde amorcee ainsi applique des regles annulees sans le savoir, et son" >&2
    echo "verdict n'est pas recevable. Mettre a jour puis relancer :" >&2
    echo "  git merge $base        # depuis la branche de l'item" >&2
    exit 1
  fi
}
