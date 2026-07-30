# BRIEF CLAUDE.AI/DESIGN - Maquette multi-pages altaryslabs.com

## 0. Contexte

ALTARYS LABS, editeur de solutions SaaS et prestataire de conseil/developpement pour les entreprises des zones OHADA et CIMA. Le site actuel est une page unique qui ne reflete plus l'activite reelle du groupe (3 produits SaaS + 3 lignes de service). Objectif de cette maquette : concevoir la structure et le layout d'un site **multi-pages**, avant transfert a Claude Code pour l'implementation.

## 1. Important : ceci n'est pas une exploration visuelle, c'est l'extension d'un systeme de marque deja etabli

Contrairement a une creation de marque de zero, l'identite visuelle d'ALTARYS existe deja (charte v3.1) et ne doit pas etre reinventee. Reutilise strictement :

- Navy profond : `#07111E`
- Gold : `#C8922A`
- Typographie titres : Cormorant Garamond
- Typographie corps : DM Sans
- Typographie mono (chiffres, badges techniques) : Space Mono
- Logomark : un diamant

Registre visuel : serieux, epure, peu d'illustration, fintech B2B institutionnelle. Peu de photos de personnes, preuve par les produits reels (mockups, chiffres) plutot que par le storytelling visuel.

**Avant de commencer, joins a la conversation Claude Design 2-3 captures d'ecran du site altaryslabs.com actuel** (header, hero, footer) pour que la maquette reste fidele a l'existant plutot que de dériver vers une nouvelle direction.

## 2. Pages a maquetter (dans cet ordre de priorite)

```
1. Accueil (/)
2. Hub Produits (/produits)
3. Papillon HR Suite (/produits/papillon-hr-suite)
4. Papillon Corporate Finance Suite (/produits/papillon-corporate-finance)
5. PCS - teaser (/produits/pcs)
6. Hub Services (/services)
7. Conseil IT, RH & Finance (/services/conseil)
8. Developpement sur mesure (/services/developpement-sur-mesure)
9. IA souveraine (/services/ia-souveraine)
10. A propos (/a-propos)
11. Contact (/contact)
```

Header commun a toutes les pages : logo + nav `Produits` (dropdown 3 items) - `Services` (dropdown 3 items) - `A propos` - `Contact`, + CTA "Contactez-nous" toujours visible.

## 3. Layout et contenu par page

### Accueil (/)
- **Hero** : titre "Solutions technologiques pour les entreprises d'Afrique OHADA et CIMA" (a affiner), sous-titre resumant 3 domaines (ressources humaines, finance d'entreprise, recouvrement/assurance), badge visible "Papillon Collection Solution (PCS), disponible mi-aout 2026"
- **Section Produits** (3 cartes, dans cet ordre) : PCS (badge "Disponible mi-aout 2026", marquee comme lien externe), Papillon HR Suite, Papillon Corporate Finance Suite
- **Section Services** (3 cartes, meme poids visuel que les cartes Produits) : Conseil IT/RH/Finance, Developpement sur mesure, IA souveraine
- **Section preuve institutionnelle** : mention SASU de droit ivoirien, zone d'action OHADA/CIMA, equipe technique - pas de logos clients (aucune reference nommee pour l'instant)
- **CTA final** : "Contactez notre equipe commerciale"

### Hub Produits (/produits)
Memes 3 cartes que sur l'accueil + paragraphe d'intro : "Trois suites SaaS concues pour les specificites reglementaires et operationnelles des entreprises OHADA et CIMA."

### Papillon HR Suite (/produits/papillon-hr-suite)
- Hero produit : solution SaaS RH et paie conforme OHADA, PME de 2 a 350 employes, offline-first et mobile-first
- Bloc conformite : CNPS/ITS (Cote d'Ivoire)
- Bloc expansion : Cote d'Ivoire (MVP), puis Benin, Cameroun, Senegal, RDC, ambition 17 pays OHADA a horizon 2028
- Bloc modules par vagues (formulation trimestrielle uniquement, jamais de date exacte) : Vague 1 (2026) controle de presence, absences, budget, depenses/engagements. Vague 2 (fin 2026-debut 2027) paie complete. Vague 3 (2027) evaluation/performance, recrutement.
- CTA : "Demander une demo" + "Contactez notre equipe commerciale"

### Papillon Corporate Finance Suite (/produits/papillon-corporate-finance)
- Hero produit : solution SaaS de budgetisation conforme SYSCOHADA, deux briques (gestion des depenses, gestion budgetaire et des engagements)
- Cible : directions financieres des PME OHADA
- Ton plus mesure que HR Suite (produit plus recent), presente comme faisant partie de la meme plateforme technique
- CTA identique a HR Suite

### PCS - teaser (/produits/pcs)
Page courte, pas un site complet :
- 2-3 phrases : "Papillon Collection Solution (PCS) permet aux assureurs et courtiers de la zone CIMA d'automatiser le renouvellement de contrats et la relance de primes via SMS, WhatsApp et email."
- Badge "Disponible mi-aout 2026"
- Un seul CTA, tres visible : "Decouvrir PCS sur papillon-collection.com" (visuellement marque comme lien externe)

### Hub Services (/services)
3 cartes (Conseil, Developpement sur mesure, IA souveraine) + intro : "Notre expertise sectorielle nourrit aussi bien nos produits que nos missions de conseil et de developpement pour compte de tiers."

### Conseil IT, RH & Finance (/services/conseil)
Accompagnement des entreprises OHADA sur systemes d'information, processus RH, gestion financiere. Positionner comme l'expertise qui alimente aussi les produits Papillon.

### Developpement sur mesure (/services/developpement-sur-mesure)
Developpement d'applications web/mobile et integrations sur mesure. Mention breve de la stack (Java/Spring Boot, React/TypeScript, cloud-native) sans jargon excessif - audience decideur, pas developpeur.

### IA souveraine (/services/ia-souveraine)
**Registre affirmatif, presente comme une expertise etablie** (pas un prototype en attente) : "Notre expertise couvre la conception de solutions d'aide a la decision alimentees par une IA souveraine, hebergee et operee en Afrique, pensee pour repondre aux enjeux de souverainete des donnees des entreprises OHADA." Meme niveau de confiance visuelle que les deux autres pages Services. CTA : "Discutons de votre besoin"

### A propos (/a-propos)
ALTARYS LABS : SASU de droit ivoirien, RCCM CI-ABI-03-2026-B17-00070. President Emmanuel Blonvia. Directeur Projets et Transformation Basile N'Guessan. Mission : rendre accessibles aux entreprises OHADA/CIMA des outils SaaS et une expertise conseil habituellement reserves aux grands groupes. Pas d'organigramme detaille ni d'effectifs precis affiches.

### Contact (/contact)
Formulaire avec champ "Je suis interesse par" (menu deroulant : Papillon HR Suite / Papillon Corporate Finance Suite / PCS / Conseil / Developpement sur mesure / IA souveraine / Autre).

## 4. Contraintes de contenu visibles a l'ecran

- Jamais de prix affiche : toujours "Contactez notre equipe commerciale"
- Jamais de nom de client ou partenaire (NSIA, Orange, IBEMS/Bloomfield, etc.) sans validation prealable - ne pas en inventer non plus pour "faire joli"
- Jamais de date de deadline interne (type "13 aout") visible a l'ecran : formulation en trimestre/annee uniquement
- Jamais le caractere `—` (tiret cadratin) ni `·` (point median) dans les textes generes

## 5. Hors scope pour cette etape (a traiter plus tard avec Claude Code, pas ici)

- Stack technique, hebergement, deploiement
- Integration reelle du formulaire de contact (backend, CRM)
- SEO, balises meta, OG tags
- Ces sujets n'ont pas leur place dans le prompt Claude Design : les mentionner ici ne fait que diluer le resultat visuel.

## 6. Format de sortie souhaite

Demande explicitement une sortie en **HTML/CSS simple**, sans framework JS ni routing cote client. Cela facilite grandement le transfert vers Claude Code quelle que soit la stack finale retenue (un scaffold React/Vite complexe demanderait un travail de demontage avant reutilisation).

## 7. Prochaine etape

Une fois la maquette validee : utiliser la fonction de handoff native de Claude Design vers Claude Code (ou exporter le code genere), puis transmettre en complement le prompt technique deja prepare (`PROMPT_altaryslabs-com-refonte.md`) qui couvre l'audit du site existant, la stack, le SEO, le formulaire et le deploiement - tout ce que cette maquette ne couvre pas.
