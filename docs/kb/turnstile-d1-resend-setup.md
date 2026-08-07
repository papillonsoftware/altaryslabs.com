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

## 2. Reactiver le binding dans `wrangler.jsonc`

Le fichier de ce depot porte volontairement un bloc D1 commente en attendant
cette etape, avec l'avertissement suivant conserve tel quel : un bloc
`d1_databases` avec un `database_id` factice fait echouer le build Cloudflare
Pages, pas seulement le binding local.

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

| Variable | Type | Valeur |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Texte (jamais Secret) | Site Key de l'etape 3. Publique par nature, exposee dans le HTML rendu. |
| `TURNSTILE_SECRET_KEY` | Secret | Secret Key de l'etape 3. |
| `RESEND_API_KEY` | Secret | Cle API de l'etape 5. |
| `CONTACT_NOTIFY_EMAIL` | Texte | Adresse qui recoit chaque notification (pas necessairement l'adresse publique du site). |

**Jamais dans le depot.** Ni cle, ni `database_id` sensible (celui de D1 ne
l'est pas en soi, mais la convention du depot le garde hors dictionnaire),
ni fichier `.env` commite. Un commentaire dans `wrangler.jsonc` documente les
noms attendus sans jamais porter leur valeur.

## Verification de bout en bout

Avant de considerer l'integration terminee :

1. `npm run build` et `npm run check` verts en local, binding D1 actif.
2. Le build Cloudflare Pages lui-meme vert (un vert local ne prouve rien sur
   la resolution des secrets cote plateforme).
3. Une soumission reelle depuis l'URL de preview cree une ligne en base et
   declenche un email recu a `CONTACT_NOTIFY_EMAIL`.
4. Une soumission avec jeton Turnstile absent ou invalide est rejetee cote
   serveur, jamais seulement cote client.
