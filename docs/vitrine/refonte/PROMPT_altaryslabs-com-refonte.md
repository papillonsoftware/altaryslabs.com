# PROMPT CLAUDE CODE - Refonte multi-pages altaryslabs.com

## 0. Contexte

Je gere ALTARYS LABS, SASU de droit ivoirien (RCCM CI-ABI-03-2026-B17-00070), editeur de solutions SaaS et prestataire de conseil/developpement pour les entreprises des zones OHADA et CIMA (Afrique de l'Ouest et Centrale).

Le site actuel (altaryslabs.com) est une page unique qui ne reflete plus notre activite reelle : nous avons maintenant 3 produits SaaS distincts et 3 lignes de service. Objectif de cette mission : transformer le site en site **multi-pages**, en gardant l'identite de marque existante mais en refondant completement le contenu et la structure de navigation.

## 1. Etape 0 obligatoire avant toute modification : audit du site existant

Avant d'ecrire une seule ligne de code, inspecte le depot actuel et rapporte-moi :
- Le framework/stack utilise (Astro, Next.js, HTML statique, autre)
- La structure de fichiers actuelle et l'endroit ou vivent les tokens de design (couleurs, typographie, logo)
- L'hebergement actuel (si detectable dans la config : Coolify, Cloudflare Pages, Vercel, autre)
- Les composants reutilisables deja en place (header, footer, boutons, cartes)

Ne propose pas de refonte technique tant que cet audit n'est pas fait. Si le site est deja sur Astro + Cloudflare Pages, conserve ce choix : c'est deja le pattern retenu pour le reste de l'ecosysteme ALTARYS (papillon-collection.com, monassurance.africa, mon-echeance.com sont tous prevus en Astro statique). Si ce n'est pas le cas, propose-moi une migration avant de continuer et attends ma validation.

## 2. Ce qui ne change pas : identite de marque (ALTARYS brand identity v3.1)

A reutiliser tel quel, ne pas redesigner :
- Navy profond : `#07111E`
- Gold : `#C8922A`
- Typographie titres : Cormorant Garamond
- Typographie corps : DM Sans
- Typographie mono (chiffres, badges techniques) : Space Mono
- Logomark : diamant (voir asset existant dans le depot)

Si le site actuel n'implemente pas fidelement ces tokens (ecart avec la charte v3.1), signale l'ecart avant de le corriger.

## 3. Nouvelle architecture du site (sitemap)

**Decision de positionnement : Produits avant Services dans la navigation.** Raison : Papillon Collection Solution (PCS) est a quelques semaines de son lancement (mi-aout 2026), c'est notre meilleure vitrine commerciale actuelle. Cela ne veut pas dire que les pages Services doivent etre moins soignees : meme niveau de qualite editoriale partout, seul l'ordre de presentation change.

```
/                                  Accueil
/produits                          Hub produits (3 cartes)
/produits/papillon-hr-suite        Page complete
/produits/papillon-corporate-finance  Page complete
/produits/pcs                      Teaser court + renvoi externe vers papillon-collection.com
/services                          Hub services (3 cartes)
/services/conseil                  Conseil IT, RH & Finance
/services/developpement-sur-mesure Developpement sur mesure
/services/ia-souveraine            Solutions d'aide a la decision par IA souveraine
/a-propos                          Equipe, mission, entite legale
/contact                           Formulaire de contact
```

Navigation principale (header) : `Produits` (dropdown 3 items) - `Services` (dropdown 3 items) - `A propos` - `Contact`. Pas de mega-menu complexe : un simple dropdown listant les 3 sous-pages suffit pour une equipe de cette taille.

## 4. Contenu detaille par page

### 4.1 Accueil (`/`)

**Hero** : accroche centree sur la mission du groupe, ex. "Solutions technologiques pour les entreprises d'Afrique OHADA et CIMA" (a affiner). Sous-titre mentionnant les 3 domaines : ressources humaines, finance d'entreprise, recouvrement/assurance. Mettre en avant PCS comme preuve de traction recente : bandeau ou badge "Papillon Collection Solution (PCS) - disponible mi-aout 2026".

**Section Produits** (3 cartes, dans cet ordre) :
1. Papillon Collection Solution (PCS) - badge "Disponible mi-aout 2026", lien externe vers papillon-collection.com
2. Papillon HR Suite - lien vers `/produits/papillon-hr-suite`
3. Papillon Corporate Finance Suite - lien vers `/produits/papillon-corporate-finance`

**Section Services** (3 cartes) : Conseil IT/RH/Finance, Developpement sur mesure, IA souveraine (presentee comme un domaine d'expertise a part entiere, voir 4.9).

**Section preuve institutionnelle** : mention SASU de droit ivoirien, zone d'action OHADA/CIMA, equipe technique (sans surexposer les effectifs exacts). Ne pas citer de noms de clients ou partenaires (NSIA, Orange, IBEMS ou autres) sans leur accord explicite prealable - meme s'ils apparaissent dans nos notes internes, ils ne sont pas confirmes publics.

**CTA final** : "Contactez notre equipe commerciale" (grille tarifaire non figee, ne jamais afficher de prix).

### 4.2 Hub Produits (`/produits`)

Meme 3 cartes que sur l'accueil, avec un paragraphe d'intro : "Trois suites SaaS concues pour les specificites reglementaires et operationnelles des entreprises OHADA et CIMA."

### 4.3 Papillon HR Suite (`/produits/papillon-hr-suite`)

Contenu a couvrir :
- Solution SaaS RH et paie conforme OHADA, pour PME de 2 a 350 employes
- Offline-first, mobile-first (pense pour les zones a connectivite limitee)
- Conformite CNPS/ITS (Cote d'Ivoire)
- Deploiement progressif zone OHADA : Cote d'Ivoire (MVP), puis Benin et Cameroun, Senegal, RDC, avec l'ambition de couvrir 17 pays OHADA a horizon 2028

**Modules a presenter par vagues (formulation trimestrielle, jamais de date exacte type "13 aout")** :
- Vague 1 (2026) : controle de presence, gestion des absences, gestion budgetaire, gestion des depenses et engagements
- Vague 2 (fin 2026 - debut 2027) : paie complete
- Vague 3 (2027) : evaluation/performance, recrutement (ATS)

Ne jamais publier de deadlines internes de sprint sur une page publique : ce sont des engagements d'equipe, pas des promesses client. Formuler en "disponible progressivement a partir de..." ou "prevu pour [trimestre/annee]".

CTA : "Demander une demo" + "Contactez notre equipe commerciale" (pas de prix affiche).

### 4.4 Papillon Corporate Finance Suite (`/produits/papillon-corporate-finance`)

Contenu a couvrir :
- Solution SaaS de budgetisation conforme SYSCOHADA
- Deux briques : gestion des depenses, gestion budgetaire et des engagements
- Cible : directions financieres des PME de la zone OHADA
- Produit plus recent que Papillon HR Suite : ton plus mesure, presenter comme faisant partie de la meme plateforme technique (coherence, pas de duplication d'infrastructure)

CTA identique a HR Suite.

### 4.5 PCS (`/produits/pcs`) - teaser uniquement

Ne pas dupliquer le contenu de papillon-collection.com. Contenu minimal :
- 2-3 phrases : "Papillon Collection Solution (PCS) permet aux assureurs et courtiers de la zone CIMA d'automatiser le renouvellement de contrats et la relance de primes via SMS, WhatsApp et email."
- Mention de la disponibilite mi-aout 2026
- CTA principal et unique : "Decouvrir PCS sur papillon-collection.com" (lien externe, s'ouvre dans un nouvel onglet, marque visuellement comme lien externe)

### 4.6 Hub Services (`/services`)

3 cartes : Conseil IT/RH/Finance, Developpement sur mesure, IA souveraine. Paragraphe d'intro : "Notre expertise sectorielle nourrit aussi bien nos produits que nos missions de conseil et de developpement pour compte de tiers."

### 4.7 Conseil IT, RH & Finance (`/services/conseil`)

Contenu a couvrir :
- Accompagnement des entreprises OHADA sur leurs systemes d'information, leurs processus RH et leur gestion financiere
- Positionner comme l'expertise qui alimente aussi les produits Papillon (credibilite croisee)
- Ne pas citer de references clients nommees sans accord prealable (voir note 4.1)

### 4.8 Developpement sur mesure (`/services/developpement-sur-mesure`)

Contenu a couvrir :
- Developpement d'applications web/mobile et integrations sur mesure
- Stack : Java/Spring Boot, React/TypeScript, architecture cloud-native - a mentionner brievement, sans jargon excessif (audience decideur, pas developpeur)

### 4.9 IA souveraine (`/services/ia-souveraine`)

**Positionnement : expertise, pas prototype en attente.** A presenter au meme niveau de confiance que les deux autres services (Conseil, Developpement sur mesure) - un domaine de competence de l'equipe, pas un chantier en cours de validation qu'on annonce a demi-mot.

Formulation recommandee : "Notre expertise couvre la conception de solutions d'aide a la decision alimentees par une IA souveraine, hebergee et operee en Afrique, pensee pour repondre aux enjeux de souverainete des donnees des entreprises OHADA." Registre affirmatif, present de l'indicatif, pas de conditionnel ni de "nous travaillons actuellement a...".

Seul garde-fou qui reste necessaire (fabrication d'informations, pas de ton) : ne pas inventer de references clients nommees, de chiffres de resultats ou de temoignages qui n'existent pas. L'expertise se demontre par la clarte du discours technique et la comprehension des enjeux (souverainete des donnees, hebergement local, conformite), pas par des preuves fabriquees.

CTA : "Discutons de votre besoin".

### 4.10 A propos (`/a-propos`)

Contenu a couvrir :
- ALTARYS LABS : SASU de droit ivoirien, RCCM CI-ABI-03-2026-B17-00070
- President : Emmanuel Blonvia
- Directeur Projets et Transformation : Basile N'Guessan
- Mission : rendre accessibles aux entreprises OHADA/CIMA des outils SaaS et une expertise conseil habituellement reserves aux grands groupes
- Eviter de publier un organigramme detaille ou des effectifs precis (equipe encore en croissance, pas besoin d'exposer la taille reelle)

### 4.11 Contact (`/contact`)

- Formulaire avec un champ "Je suis interesse par" (menu deroulant : Papillon HR Suite / Papillon Corporate Finance Suite / PCS / Conseil / Developpement sur mesure / IA souveraine / Autre)
- Pas de prix affiche nulle part
- Point en suspens (voir section 6) : destination technique des soumissions du formulaire non definie a ce stade - prevoir un webhook/email configurable facilement, ne pas coder en dur une destination finale

## 5. Contraintes editoriales transverses

- Jamais de caractere `—` (tiret cadratin) ni de point median `·` dans les textes generes : remplacer par `,` `.` ou `-`
- Jamais de prix affiche : toujours "Contactez notre equipe commerciale"
- Jamais de nom de client ou partenaire (NSIA, Orange, IBEMS/Bloomfield, etc.) sans validation explicite prealable de ma part
- Francais uniquement pour cette version (hypothese : pas de bascule anglais pour l'instant - a confirmer si des investisseurs anglophones en font la demande)
- Aucune date de deadline interne (sprint) sur les pages publiques : formulation en trimestre/annee uniquement

## 6. Contraintes techniques

- SEO : meta title + meta description + balises OG propres par page (server-rendered, pas de SPA - important pour les previews WhatsApp/Facebook, tres utilisees dans notre audience)
- Performance mobile/donnees limitees : poids de page leger, priorite au HTML/CSS sur le JS
- Reprendre la stack confirmee lors de l'audit (section 1)
- Formulaire de contact : integration simple (Cloudflare Pages Functions si l'hebergement est deja Cloudflare Pages, sinon voir avec moi avant d'implementer une solution tierce)

## 7. Points en suspens a valider avec moi avant mise en prod

- Destination technique des soumissions de formulaire (CRM, email, webhook)
- Contenu exact de la page A propos (bios equipe, ton exact de la mission)
- Bascule anglais eventuelle
- Visuel/photo pour le hero de chaque page (a fournir ou a generer)
