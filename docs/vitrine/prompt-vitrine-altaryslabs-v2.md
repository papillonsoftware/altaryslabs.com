# Prompt de génération , Site vitrine ALTARYS LABS v2

## Contexte stratégique (LIRE EN PREMIER)

ALTARYS LABS est une société ivoirienne de technologie (SAS, droit OHADA) basée
à Abidjan. L'entreprise a deux sources de revenus :

1. **Revenus immédiats (priorité du site)** : Conseil IT, RH & Corporate Finance
   + Développement logiciel sur mesure, orienté solutions métier pour la zone OHADA.
   Ces activités financent la R&D du produit SaaS.

2. **Vision produit (vitrine secondaire)** : Deux lignes de produits SaaS en cours
   de développement :
   - Papillon HR Suite (gestion des talents, PME 2-350 employés)
   - Papillon Corporate Finance Suite (gestion financière, PME)
   - ALTARYS ENTERPRISE (ETI/Grands comptes, horizon M+18)

Le site doit positionner ALTARYS LABS comme **un partenaire technologique crédible
pour répondre à des appels d'offre**, tout en montrant que la société investit dans
ses propres produits innovants. Le message est : "Nous construisons le futur de la
gestion RH et financière en Afrique, et nous mettons cette expertise à votre service
sur vos projets."

---

## Fichiers de référence fournis

- `altarys-brand-identity-v3.1.html` : charte graphique complète (couleurs, polices,
  logomarks SVG, règles d'usage) , v3.1 avec Papillon Corporate Finance Suite
- `altarys-saas-architecture-v2.md` : architecture produit et contexte métier
- `platform-vision-prd.md` : PRD produit (source de contenu pour la section Produits)

## Consigne principale

Lis attentivement les fichiers de référence AVANT d'écrire une seule ligne de code.
Extrais de la charte : les variables CSS, les polices Google Fonts, les logomarks
SVG, et la palette de couleurs. Réutilise-les à l'identique.

---

## Balises SEO & Open Graph (obligatoire dans le `<head>`)

Le site sera partagé sur LinkedIn et WhatsApp (canaux de prospection B2B en
Côte d'Ivoire). Les balises Open Graph et Twitter Card sont indispensables
pour un aperçu professionnel.

Inclure dans le `<head>` :

```html
<!-- SEO de base -->
<meta name="description" content="ALTARYS LABS | Développement logiciel sur mesure 
et conseil IT, RH & Finance pour la zone OHADA. Éditeur de Papillon HR Suite 
et Papillon Corporate Finance Suite. Abidjan, Côte d'Ivoire.">
<meta name="keywords" content="OHADA, développement logiciel, Côte d'Ivoire, 
RH, paie, CNPS, SYSCOHADA, SaaS, Abidjan, conseil IT">
<link rel="canonical" href="https://altaryslabs.com/">

<!-- Open Graph (LinkedIn, Facebook, WhatsApp) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://altaryslabs.com/">
<meta property="og:title" content="ALTARYS LABS | Partenaire technologique zone OHADA">
<meta property="og:description" content="Développement logiciel sur mesure, 
conseil IT/RH/Finance, et éditeur de solutions SaaS pour les entreprises 
en zone OHADA. Basé à Abidjan.">
<meta property="og:image" content="https://altaryslabs.com/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="fr_CI">
<meta property="og:site_name" content="ALTARYS LABS">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="ALTARYS LABS | Partenaire technologique zone OHADA">
<meta name="twitter:description" content="Développement logiciel sur mesure, 
conseil IT/RH/Finance, et éditeur de solutions SaaS pour les entreprises 
en zone OHADA.">
<meta name="twitter:image" content="https://altaryslabs.com/assets/og-image.png">

<!-- Favicon (losange ALTARYS en SVG) -->
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
```

NOTE : le fichier `assets/og-image.png` (1200×630px) sera créé séparément.
Pour l'instant, inclure les balises avec ce chemin. L'image devra reprendre
le logo ALTARYS LABS sur fond navy #07111E avec la baseline du site.

---

## Stack technique

- HTML5 + CSS3 + Vanilla JS (pas de framework)
- Un seul fichier index.html auto-suffisant
- Google Fonts (déjà dans la charte) :
  Cormorant Garamond (300, 400, 600), DM Sans (300, 400, 500, 600), Space Mono (400, 700)
- Pas de dépendances npm, pas de build step

---

## Structure du site (single page, navigation sticky)

### SECTION 1 : HERO

- Logo ALTARYS LABS (SVG extrait de la charte v3)
- Baseline principale : positionnement partenaire technologique zone OHADA
  (PAS "éditeur SaaS", PAS "startup produit")
- Sous-titre : mentionner Conseil + Développement sur mesure + Édition de logiciels
- **CTA principal** : "Discutons de votre projet" (ancre vers section Contact)
- CTA secondaire discret : "Découvrir nos produits" (ancre vers section Produits)
- Ambiance visuelle : sobre, premium, confiance. Pas startup flashy.

### SECTION 2 : NOS SERVICES (première priorité visuelle, ~60% de l'attention)

Deux grandes cards mises en avant, avec le développement sur mesure en position
dominante (visuellement plus grande ou en premier).

**Card A , Développement logiciel sur mesure (LA STAR)**
- Positionnement : solutions métier spécifiques pour la zone OHADA
- Types de projets mis en avant :
  * Applications de gestion RH et paie conformes au droit du travail local
  * Plateformes de gestion financière et comptable (SYSCOHADA, OHADA)
  * Outils de conformité réglementaire (CNPS, ITS, déclarations fiscales)
  * Portails et applications métier sur mesure
  * Intégrations API et connecteurs ERP
- Stack technique mentionnée sobrement : Java/Spring Boot, React, PostgreSQL,
  cloud-native, mobile-first
- Argument clé : "Nous ne développons pas juste du code, nous comprenons la
  réglementation OHADA qui encadre votre métier"
- CTA : "Demander un devis"

**Card B , Conseil IT, RH & Corporate Finance**
- Positionnement : accompagnement stratégique et opérationnel
- Domaines :
  * Audit et mise en conformité OHADA (code du travail, SYSCOHADA)
  * Transformation digitale RH et Finance
  * Cadrage et assistance à maîtrise d'ouvrage (AMOA)
  * Choix et intégration de solutions logicielles
  * Formation et conduite du changement
- Argument clé : "15 ans d'expertise en ingénierie logicielle, combinée à une
  connaissance approfondie du cadre OHADA"
- CTA : "Prendre rendez-vous"

### SECTION 3 : NOS PRODUITS (vitrine secondaire, ~40% de l'attention)

Introduire avec un titre du type : "Nous éditons aussi nos propres solutions"
ou "Notre R&D au service des PME africaines"

**Bloc Papillon HR Suite** (palette amber #D4810A / #F5A623)
- Description courte : gestion des talents pour PME de 2 à 350 employés
- Modules en vedette (MVP, avec badges "Disponible") :
  * Paie CNPS/ITS (bulletins de paie automatisés, déclarations sociales)
  * Congés & Absences (Code du Travail ivoirien, accruals automatiques)
  * Présences QR Code (pointage mobile, offline-first)
- Points forts à mentionner : conforme OHADA, offline-first, mobile-first,
  fonctionne sur 3G, Android entry-level, 14 jours d'essai gratuit
- PAS DE PRIX affichés
- CTA : "Demander une démo"

**Bloc Papillon Corporate Finance Suite** (même palette amber)
- Description courte : gestion financière SYSCOHADA pour PME
- Modules en vedette (MVP) :
  * Engagements budgétaires (workflows d'approbation multi-niveaux)
  * Lignes budgétaires (suivi en temps réel, conformité SYSCOHADA)
- Module à venir :
  * Notes de frais (mobile-first, photo de reçu)
- PAS DE PRIX affichés
- CTA : "Demander une démo"

**Mention ALTARYS ENTERPRISE** (palette teal #1A8FA0, discret)
- Une ligne ou un petit encart : "Solutions pour ETI et grands comptes,
  disponibles à partir de 2027"
- Pas de détails, juste un teaser

**Liste complète des modules** (discrète, en bas de section)
- Grille ou liste compacte des 14 modules avec statut :
  * Disponible : ABSMGT, QRCONTR, COMMIT (+BUDMGT auto-inclus), PAYROL
  * Bientôt : EXPMGT, HRCORE, EMPMGT
  * En développement : TIMACT, HSEMGT, PERFOB, GPEC, LTRAIN, ATSMGT, ADVDOC
- Style discret (font-size petit, opacité réduite), pas le focus principal

### SECTION 4 : EXPERTISE & MARCHÉS

- Bandeau crédibilité : "Conformité OHADA native", "17 pays membres",
  "SYSCOHADA", "Multi-pays"
- Timeline ou carte d'expansion géographique :
  * 2026 : Côte d'Ivoire (actif), Bénin + Cameroun
  * 2027 : RDC, Sénégal
  * 2028 : 6 nouveaux pays OHADA
- Différenciateurs technologiques (sobres, pas jargon) :
  * Offline-first : fonctionne sans connexion internet
  * Mobile-first : optimisé pour les smartphones Android
  * Multi-tenant : chaque entreprise a ses données isolées
  * Cloud-native : infrastructure moderne et évolutive
  * Conformité automatisée : les règles OHADA sont intégrées dans le code

### SECTION 5 : À PROPOS / POURQUOI ALTARYS LABS

- Court paragraphe sur la vision : démocratiser l'accès à des outils de gestion
  professionnels pour les entreprises africaines
- Mentionner : fondée à Abidjan, équipe d'ingénieurs, expertise OHADA
- Pas de noms individuels ni de photos d'équipe pour l'instant

### SECTION 6 : CONTACT / CTA FINAL

- **CTA principal** : "Discutons de votre projet" (orienté appel d'offre / dev sur mesure)
- **CTA secondaire** : "Demander une démo Papillon" (orienté produit SaaS)
- Formulaire de contact : Nom, Entreprise, Email, Téléphone, Message, Type de demande
  (Projet sur mesure / Conseil / Démo produit / Autre)
- Coordonnées : Abidjan, Côte d'Ivoire (pas d'adresse physique précise pour l'instant)
- Email de contact
- Liens réseaux sociaux (placeholders si pas encore créés)

---

## Contraintes de design (RESPECTER ABSOLUMENT)

- Fond dominant : #07111E (noir profond) ou #0F1724 (navy deep)
- Accent principal : #C8922A (or) et #E5B55A (or clair)
- Papillon : #D4810A et #F5A623 (amber), uniquement dans la section Produits
- ALTARYS ENTERPRISE : #1A8FA0 (teal), uniquement dans la mention Enterprise
- **Aucun violet** : le violet #7C5CBF est réservé exclusivement à altarys.ai
- Aucun dégradé violet générique
- Aucune police Arial, Inter, Roboto ou system-font
- Logomark SVG : losange aplati avec A inscrit, 4 points dorés aux sommets,
  extraire exactement de la charte v3
- Animations : CSS uniquement, sobres (fade-in au scroll, hover states).
  Pas d'animations de type startup/tech flashy. Ton premium et professionnel.
- Mobile-first : breakpoint principal 768px. Doit être parfait sur 360px.
- Typographie stricte :
  * Cormorant Garamond : grands titres marketing / héros
  * DM Sans : corps de texte, navigation, boutons
  * Space Mono : données techniques, labels système, badges modules
- Touch targets minimum 48px sur mobile

## Ton éditorial

- Langue : Français
- Ton : **professionnel, confiant, expert, ancré Afrique de l'Ouest**
- PAS un ton startup / disruptif / "on va changer le monde"
- Plutôt un ton cabinet de conseil technologique haut de gamme :
  "Nous comprenons votre contexte réglementaire. Nous construisons des solutions
  qui fonctionnent dans votre réalité."
- Vocabulaire : parler de "solutions", "expertise", "accompagnement", "conformité",
  "partenaire technologique" plutôt que "produit", "plateforme", "innovation"
- Mettre en avant : expertise OHADA, ancrage Abidjan, compréhension du terrain,
  qualité d'exécution
- Les sections Produits (Papillon) peuvent être un peu plus chaleureuses et
  accessibles (c'est la marque PME), mais le ton global du site reste corporate

## Hiérarchie visuelle (CRITIQUE)

Le visiteur prioritaire est un **décideur ivoirien (DG, DSI, DRH) qui cherche
un prestataire** pour un projet IT, RH ou Finance. Il doit comprendre en 5
secondes que ALTARYS LABS peut répondre à son besoin.

Ordre d'impact visuel :
1. HERO : "Nous sommes votre partenaire technologique OHADA"
2. SERVICES : "Voici ce que nous pouvons faire pour vous maintenant"
3. PRODUITS : "Et voici nos propres produits innovants"
4. EXPERTISE : "Voici pourquoi nous sommes crédibles"
5. CONTACT : "Parlons de votre projet"

Le prospect ne doit JAMAIS se dire "ah c'est un éditeur de logiciel SaaS,
ils ne font pas de sur mesure".

---

## Output attendu

Un fichier `index.html` unique, production-ready, commenté par section.
Taille cible : page complète, qualité portfolio professionnel.
Le site doit inspirer confiance à un directeur qui évalue des prestataires
pour un appel d'offre de 20 à 100 millions FCFA.

### Fichiers supplémentaires à générer

En plus de `index.html`, génère ces fichiers pour un déploiement GitHub Pages :

- `CNAME` : contient uniquement `altaryslabs.com` (une seule ligne)
- `robots.txt` : autoriser tous les robots, sitemap reference
- `assets/favicon.svg` : le logomark losange ALTARYS en SVG (or #C8922A sur
  fond transparent), extrait de la charte v3.1

### Compatibilité GitHub Pages

Le site sera hébergé sur GitHub Pages. Contraintes :
- Fichiers statiques uniquement (HTML, CSS, JS, images, SVG)
- Pas de PHP, pas de SSR, pas de Node.js côté serveur
- Pas de .htaccess (les redirections se font via JS ou meta refresh si besoin)
- Le formulaire de contact ne peut PAS soumettre de données côté serveur.
  Utiliser un service tiers (Formspree, Getform, ou mailto: link).
  Recommandation : utiliser Formspree (formspree.io) avec un endpoint gratuit,
  ou un simple lien mailto: comme solution minimale.
