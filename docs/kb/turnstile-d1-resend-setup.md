# Mise en place Turnstile, D1 et Resend sur un projet Cloudflare Pages

Tutoriel ecrit a partir de la mise en place reelle sur `altaryslabscom`, le
2026-08-07, pour FORM-001 (soumission du formulaire de contact). Reutilisable
tel quel pour un autre projet Astro statique sur Cloudflare Pages avec une
Pages Function.

## Ce que ces trois services couvrent

- **D1** : stockage des soumissions (base SQLite geree par Cloudflare).
- **Turnstile** : anti-spam, verifie cote serveur. Un widget cote client seul
  ne prouve rien ; c'est la Pages Function qui doit revalider le jeton aupres
  de Cloudflare.
- **Resend** : envoi de la notification email a chaque soumission.

## Prealable

`wrangler` authentifie sur la machine qui execute les commandes CLI :

```
npx wrangler login
```

Ouvre un lien dans le navigateur par defaut. **Piege reel rencontre en
session** : lancer cette commande avec un `&` final a l'interieur d'un
processus deja mis en tache de fond la rend orpheline des que le shell parent
se termine, et le serveur local qui doit recevoir le callback OAuth
(`localhost:8976`) meurt avec elle. La commande semble reussir (elle imprime
le lien), mais `wrangler whoami` reste "not authenticated" ensuite. Verifier
que le processus ecoute reellement avant de cliquer le lien :

```
lsof -i :8976
```

Doit afficher une ligne `LISTEN`. Sinon, relancer `wrangler login` proprement,
sans l'empaqueter dans un second niveau de backgrounding.

Verifier l'authentification :

```
npx wrangler whoami
```

## 1. Creer la base D1

```
npx wrangler d1 list
```

Verifie qu'aucune base du meme nom n'existe deja, avant de creer :

```
npx wrangler d1 create <nom-de-la-base>
```

La commande retourne un `database_id`. Elle propose aussi d'ecrire elle-meme
le binding dans `wrangler.jsonc` ; en session non interactive elle repond
"no" par defaut, donc l'edition reste manuelle.

## 2. Declarer le binding dans `wrangler.jsonc`

**Fait sur ce depot depuis le 2026-08-07** : `wrangler.jsonc` porte un bloc
`d1_databases` actif, avec le `database_id` reel de `altaryslabs-contact`. Il
n'y a rien a reactiver ici. La forme du bloc est conservee ci-dessous pour un
autre projet, avec l'avertissement qui la justifie : un bloc `d1_databases`
avec un `database_id` factice fait echouer le build Cloudflare Pages, pas
seulement le binding local.

```jsonc
{
  "pages_build_output_dir": "./dist",

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "<nom-de-la-base>",
      "database_id": "<identifiant retourne par wrangler d1 create>"
    }
  ]
}
```

**Piege reel : la virgule apres `"pages_build_output_dir": "./dist"`.** Sans
elle, le JSON est invalide et le build casse silencieusement en apparence (le
message d'erreur ne pointe pas toujours clairement vers la virgule
manquante). Verifier systematiquement avec :

```
npm run build && npm run check
```

## 3. Creer le widget Turnstile

Dashboard Cloudflare > **Turnstile** > **Add widget**.

- **Domain** : le domaine de production, plus `localhost` si un test local est
  prevu, plus le sous-domaine `*.pages.dev` du projet si connu a l'avance.
- **Widget Mode** : **Managed**, Cloudflare ajuste seul le niveau de friction.

La creation affiche **Site Key** et **Secret Key** une seule fois visibles
sans avoir a rouvrir un ecran dedie ; les noter immediatement.

## 4. Compte Resend et verification de domaine

Dashboard Resend > **Domains** > **Add Domain**, saisir le domaine
d'envoi. Resend fournit une liste d'enregistrements DNS (au moins un `TXT`
pour DKIM sous `resend._domainkey`, un `MX` et un `TXT` SPF sous `send`).

Les poser dans la zone DNS du domaine (ici, deja geree par Cloudflare) **en
ajout seulement**, jamais en modification des enregistrements existants qui
servent un site en production. Verifier ensuite depuis Resend : le domaine
passe par les trois etats **Domain added > DNS verified > Domain verified**,
observes en quelques minutes dans cette session.

**Ne pas activer "Enable Receiving"** si le service ne fait qu'envoyer les
notifications : ce depot n'a besoin d'aucune reception email entrante.

## 5. Cle API Resend

Dashboard Resend > **API Keys** > **Create API Key**.

- **Permission : "Sending access" uniquement**, restreinte au domaine si
  l'interface le permet. Jamais "Full access" pour une cle qui ne fait
  qu'envoyer.
- La cle complete n'est affichee **qu'une seule fois** a la creation. La
  copier immediatement ; en cas de perte, la revoquer et en creer une
  nouvelle, elle ne redevient jamais visible.

## 6. Poser les secrets sur le projet Cloudflare Pages

Dashboard Cloudflare > **Workers & Pages** > le projet > **Settings** >
**Environment variables** (ou **Variables and Secrets** sur les interfaces
recentes).

**Repeter la saisie pour les deux environnements, Production et Preview.**
Un projet dont le domaine personnalise n'est pas encore attache (bascule DNS
non faite) ne tourne qu'en Preview : oublier cet environnement bloque toute
verification avant la mise en production.

Les deux cles, lues a l'**execution** par la fonction Pages :

| Variable | Type | Valeur |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | **Secret** | Secret Key de l'etape 3. |
| `RESEND_API_KEY` | **Secret** | Cle API de l'etape 5. |

**Sur ce depot, la liste complete des variables attendues est tenue a un seul
endroit**, l'interface `Env` de `functions/api/contact.ts` : elle nomme chacune,
dit si elle est obligatoire ou facultative, et ce qui se passe en son absence.
Ce tutoriel n'en porte que la procedure de saisie. Voir D110.

**Un mot sur les variables en clair.** Sur un projet dont `wrangler.jsonc` porte
`pages_build_output_dir`, ce fichier devient la source de verite de la
configuration et une variable de type Texte posee au dashboard n'atteint pas le
projet. Les Secrets, eux, continuent de fonctionner. C'est pourquoi ce tableau
ne liste que des Secrets. Voir D100 et D106.

**Le type Secret n'est pas cosmetique.** Une cle posee en type Texte reste
lisible en clair par quiconque ouvre l'ecran, et se retrouve dans la premiere
capture d'ecran partagee pour demander de l'aide. Erreur commise en session : les
deux secrets avaient ete poses en Texte, ce qui a impose de les faire tourner
tous les deux. Si le menu Type refuse de passer de Texte a Secret sur une ligne
existante, supprimer la ligne et la recreer directement en Secret.

**Masquer ne repare pas.** Une valeur qui a circule en clair reste valide :
seule la rotation la neutralise. Cote Resend, revoquer puis recreer, la cle
n'etant affichee qu'une fois. Cote Turnstile, `Rotate secret key` sur le widget,
ce qui ne change **pas** la Site Key et n'exige donc aucun rebuild.

**Jamais dans le depot** : aucun secret, aucun fichier `.env` commite. Ajouter
`.env`, `.env.*`, `.dev.vars` et `.dev.vars.*` au `.gitignore` avant de creer le
premier secret, pas apres.

## 7. Le piege qui coute un build : la cle de site ne doit pas etre une variable

**A lire avant de poser une variable de build sur un projet Pages qui possede un
`wrangler.jsonc`.**

Des lors que ce fichier porte la cle `pages_build_output_dir`, il devient la
source de verite de la configuration du projet et **Cloudflare cesse de lire les
variables du dashboard pour le build**. Le journal l'annonce, mais de facon
facile a manquer :

```
Found wrangler.json file. Reading build configuration...
pages_build_output_dir: dist
Build environment variables: (none found)
```

`(none found)` alors que le dashboard montre la variable, posee dans les deux
environnements. On cherche alors l'erreur du mauvais cote, en verifiant et
reverifiant une saisie qui est correcte.

**La bonne reponse n'est pas de reparer la plomberie, c'est de supprimer le
besoin.** La Site Key Turnstile n'est pas un secret et ne peut pas en etre un :
Turnstile exige qu'elle figure dans le HTML rendu, servie en clair a chaque
visiteur. Avec elle seule on ne peut ni forger un jeton ni en verifier un, les
deux exigeant le secret, et la liste de hostnames du widget borne les domaines
qui peuvent en produire.

Deux consequences qui tranchent la question :

1. La valeur est **deja publique**. La mettre dans le code ne publie rien de
   neuf.
2. La faire tourner **exigeait deja un rebuild**, puisqu'un site statique la fige
   dans le HTML a la compilation. La porter dans le code ne coute donc aucune
   souplesse.

Elle vit donc dans une constante du code, ici `TURNSTILE_SITE_KEY` dans
`src/i18n/config.ts`, et le projet n'a **plus aucune variable de build**. Le
garde-fou qui faisait echouer le build en son absence devient inutile : une
constante ne peut pas manquer.

Verifier que la dependance a disparu, en construisant sans la variable :

```
env -u PUBLIC_TURNSTILE_SITE_KEY npm run build
```

La variable `PUBLIC_TURNSTILE_SITE_KEY` peut ensuite etre supprimee du dashboard
dans les deux environnements. La laisser ne casse rien mais entretient l'idee
qu'elle sert encore.

## Verification de bout en bout

Avant de considerer l'integration terminee :

1. `npm run build` et `npm run check` verts en local, binding D1 actif.
2. Le schema applique en base **distante**, avant la mise en ligne, puis verifie
   independamment :

   ```
   npx wrangler d1 migrations apply <base> --remote
   npx wrangler d1 execute <base> --remote --command \
     "SELECT name FROM sqlite_master WHERE type='table';"
   ```

   La commande doit etre lancee depuis un repertoire qui contient reellement
   `migrations/`. Erreur commise en session : lancee depuis le checkout
   principal, dont la branche n'avait pas encore le dossier, elle repond
   `No migrations present at ...` et l'on croit a un probleme de configuration.
3. Le build Cloudflare Pages lui-meme vert (un vert local ne prouve rien sur
   la resolution des secrets cote plateforme).
4. Une soumission reelle depuis l'URL de deploiement cree une ligne en base et
   declenche un email recu a l'adresse de notification. Le hostname de cette URL
   doit figurer dans la liste du widget Turnstile, sinon le widget refuse de se
   rendre et le test est impossible pour une raison sans rapport avec le code.
5. Une soumission avec jeton Turnstile absent ou invalide est rejetee cote
   serveur, jamais seulement cote client.

## Verifier avant de chercher ailleurs

Deux commandes qui repondent a des questions qu'on a tendance a deviner. Le nom
du projet Pages, son sous-domaine et sa branche de production :

```
npx wrangler pages project list
```

Le nom du projet doit correspondre **exactement** au champ `name` de
`wrangler.jsonc`. Desynchronise, un `wrangler pages deploy` cree un second
projet au lieu de viser le bon, et le doublon part avec ses secrets sans que
personne sache ce qu'il contenait.

Savoir aussi quelle branche est la branche de production evite de courir apres
une URL de preview a hash : si c'est la branche d'integration, la fusion publie
directement sur `<projet>.pages.dev`, une adresse stable.
