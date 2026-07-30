import type { PageKey } from './routes';

/**
 * Dictionnaire français. C'est la langue de référence : le type Dictionary est
 * dérivé de ce fichier, donc toute clé ajoutée ici devient obligatoire en
 * anglais et le build échoue tant qu'elle manque.
 */
export const fr = {
  common: {
    skipToContent: 'Aller au contenu principal',
    newTab: 'ouvre un nouvel onglet',
    switchLanguage: 'Changer de langue',
    learnMore: 'En savoir plus',
    discover: 'Découvrir',
  },

  /**
   * Disponibilité de Papillon Collection Solution, centralisée ici et nulle
   * part ailleurs. Le jour du lancement, une seule ligne à changer pour passer
   * à "Disponible". Jamais de date exacte sur une page publique.
   */
  availability: {
    pcs: 'Disponible T3 2026',
  },

  nav: {
    products: 'Produits',
    services: 'Services',
    about: 'À propos',
    contact: 'Contact',
    cta: 'Discutons',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    home: 'Accueil',
  },

  /** Libellé court de chaque page, utilisé en navigation et en fil d'Ariane. */
  pageName: {
    home: 'Accueil',
    products: 'Produits',
    productsHr: 'Papillon HR Suite',
    productsFinance: 'Papillon Corporate Finance Suite',
    productsPcs: 'Papillon Collection Solution',
    services: 'Services',
    servicesConsulting: 'Conseil IT, RH et Finance',
    servicesDev: 'Développement sur mesure',
    servicesAi: 'IA souveraine',
    about: 'À propos',
    contact: 'Contact',
    legalNotice: 'Mentions légales',
    privacy: 'Politique de confidentialité',
  } satisfies Record<PageKey, string>,

  /** Accroche courte de chaque page, affichée dans les menus déroulants. */
  pageTagline: {
    home: '',
    products: '',
    productsHr: 'SaaS RH et paie conforme OHADA',
    productsFinance: 'Budgétisation conforme SYSCOHADA',
    productsPcs: 'Recouvrement de primes en zone CIMA',
    services: '',
    servicesConsulting: "Systèmes d'information, RH et gestion financière",
    servicesDev: 'Applications web, mobile et intégrations',
    servicesAi: 'Aide à la décision et souveraineté des données',
    about: '',
    contact: '',
    legalNotice: '',
    privacy: '',
  } satisfies Record<PageKey, string>,

  /**
   * Cartes produits et services. Une seule source pour l'accueil et pour les
   * pages hub : les deux ne peuvent pas diverger.
   */
  cards: {
    products: {
      /* PCS n'a pas de badge propre : il porte sa disponibilité, lue dans
         `availability.pcs` pour rester centralisée. */
      productsPcs: {
        text: "Automatise le renouvellement de contrats et la relance de primes des assureurs et courtiers de la zone CIMA, par SMS, WhatsApp et email.",
      },
      productsHr: {
        badge: 'SaaS RH et paie',
        text: "Ressources humaines et paie conformes OHADA, pensées pour les PME de 2 à 350 employés, offline-first et mobile-first.",
      },
      productsFinance: {
        badge: 'SaaS Finance',
        text: "Budgétisation conforme SYSCOHADA pour les directions financières des PME de la zone OHADA, dépenses et engagements.",
      },
    },
    services: {
      servicesConsulting: {
        text: "Accompagnement des entreprises OHADA sur leurs systèmes d'information, leurs processus RH et leur gestion financière.",
      },
      servicesDev: {
        text: "Applications web et mobiles, intégrations et architectures cloud-native conçues pour vos besoins métier.",
      },
      servicesAi: {
        text: "Solutions d'aide à la décision alimentées par une IA souveraine, hébergée et opérée en Afrique.",
      },
    },
  },

  home: {
    heroBadge: 'Papillon Collection Solution',
    heroTitle: "Des solutions technologiques pour les entreprises d'Afrique.",
    heroEmphasis: 'Zones OHADA et CIMA',
    heroSubtitle:
      "Ressources humaines, finance d'entreprise et recouvrement de créances, trois domaines où nos suites logicielles et notre expertise conseil accompagnent la croissance des entreprises.",
    heroPrimary: 'Contactez notre équipe commerciale',
    heroSecondary: 'Découvrir nos produits',

    productsLabel: 'Nos produits',
    productsTitle: "Trois suites SaaS pensées pour l'OHADA et le CIMA",

    servicesLabel: 'Nos services',
    servicesTitle: 'Une expertise sectorielle au service de vos projets',

    aboutLabel: 'ALTARYS LABS',
    aboutText:
      "Une SASU de droit ivoirien, active sur les zones OHADA et CIMA, portée par une équipe d'experts techniques et fonctionnels expérimentés en banque, en assurance et dans la mise en œuvre de systèmes métiers complexes et sécurisés.",

    ctaTitle: 'Discutons de votre projet',
    ctaLabel: 'Contactez notre équipe commerciale',
  },

  productsPage: {
    label: 'Produits',
    title: "Trois suites SaaS pour l'OHADA et le CIMA",
    intro:
      "Chacune répond aux exigences réglementaires et opérationnelles propres aux entreprises de la zone. Conformité, connectivité limitée et pluralité des pays sont traitées dès la conception, pas ajoutées après coup.",
    ctaTitle: 'Une question sur nos produits ?',
    ctaLabel: 'Contactez notre équipe commerciale',
  },

  servicesPage: {
    label: 'Services',
    title: 'Une expertise au service de vos projets',
    intro:
      "Notre expertise sectorielle nourrit aussi bien nos produits que nos missions de conseil et de développement pour compte de tiers. Ce que nous éprouvons sur nos propres plateformes, nous le mettons au service des vôtres.",
    ctaTitle: 'Discutons de votre besoin',
    ctaLabel: 'Contactez notre équipe commerciale',
  },

  /** Libellés partagés par les trois fiches produit. */
  product: {
    label: 'Produit',
    ctaDemo: 'Demander une démo',
    ctaSales: 'Contactez notre équipe commerciale',
  },

  productHr: {
    intro:
      "Solution SaaS de ressources humaines et de paie conforme OHADA, pensée pour les PME de 2 à 350 employés, offline-first et mobile-first pour les zones à connectivité limitée.",

    features: [
      {
        title: 'Conformité CNPS et ITS',
        text: 'Alignée sur la réglementation ivoirienne dès la première version.',
      },
      {
        title: 'Offline-first',
        text: 'Fonctionne sans connexion, synchronisation au retour du réseau.',
      },
      {
        title: 'Mobile-first',
        text: "Optimisée pour les smartphones d'entrée de gamme.",
      },
      {
        title: '2 à 350 employés',
        text: 'Pensée pour la réalité opérationnelle des PME.',
      },
    ],

    deploymentLabel: 'Déploiement',
    deploymentTitle: 'Une couverture progressive de la zone OHADA',
    deploymentText:
      "Le déploiement démarre en Côte d'Ivoire, puis s'étend au Bénin, au Cameroun, au Sénégal et en RDC, avec l'ambition d'étendre progressivement la couverture à l'ensemble de la zone OHADA.",
    waves: [
      {
        label: 'Vague 1, 2026',
        text: "Contrôle de présence, gestion des absences, gestion budgétaire, gestion des dépenses et engagements.",
      },
      {
        label: 'Vague 2, fin 2026 et début 2027',
        text: 'Paie complète.',
      },
      {
        label: 'Vague 3, 2027',
        text: 'Évaluation et performance, recrutement.',
      },
    ],

    modulesLabel: 'Modules de la plateforme',
    modules: [
      'Paie CNPS et ITS',
      'Présences QR',
      'Congés et absences',
      'RH Core',
      'Gestion employés',
      'Temps et activités',
      'Santé et sécurité',
      'Performance',
      'Compétences',
      'Formation',
      'Recrutement',
      'Documents avancés',
    ],

    ctaTitle: 'Voir Papillon HR Suite en action',
  },

  productFinance: {
    intro:
      "Solution SaaS de budgétisation conforme SYSCOHADA, destinée aux directions financières des PME de la zone OHADA. Elle s'appuie sur la même plateforme technique que Papillon HR Suite, pour une cohérence totale de vos données d'entreprise.",
    cards: [
      {
        title: 'Gestion des dépenses',
        text: "Suivi et validation des notes de frais et des dépenses courantes, avec traçabilité complète pour vos équipes financières.",
      },
      {
        title: 'Budget et engagements',
        text: 'Pilotage budgétaire et suivi des engagements financiers, conforme au référentiel SYSCOHADA.',
      },
    ],
    ctaTitle: 'Voir Papillon Corporate Finance Suite en action',
  },

  productPcs: {
    intro:
      "Papillon Collection Solution permet aux assureurs et aux courtiers en assurance de la zone CIMA d'automatiser le renouvellement de contrats et la relance de primes, par SMS, WhatsApp et email, jusqu'à l'authentification et au paiement par leurs clients.",
    externalCta: 'Découvrir PCS sur papillon-collection.com',
  },

  meta: {
    home: {
      title: 'ALTARYS LABS | Solutions technologiques pour les entreprises OHADA et CIMA',
      description:
        "Éditeur de suites SaaS et prestataire de conseil et de développement pour les entreprises d'Afrique de l'Ouest et Centrale. Ressources humaines, finance d'entreprise, recouvrement et assurance.",
    },
    products: {
      title: 'Nos produits | ALTARYS LABS',
      description:
        'Trois suites SaaS conçues pour les spécificités réglementaires et opérationnelles des entreprises des zones OHADA et CIMA.',
    },
    productsHr: {
      title: 'Papillon HR Suite | SaaS RH et paie conforme OHADA',
      description:
        "Solution SaaS de gestion des ressources humaines et de paie pour les PME de la zone OHADA. Pensée mobile-first et offline-first pour les contextes à connectivité limitée.",
    },
    productsFinance: {
      title: 'Papillon Corporate Finance Suite | Budgétisation conforme SYSCOHADA',
      description:
        "Solution SaaS de gestion budgétaire, des engagements et des dépenses, conforme SYSCOHADA, pour les directions financières des PME de la zone OHADA.",
    },
    productsPcs: {
      title: 'Papillon Collection Solution | Recouvrement de primes en zone CIMA',
      description:
        "Automatisation du renouvellement de contrats et de la relance de primes par SMS, WhatsApp et email, pour les assureurs et courtiers de la zone CIMA.",
    },
    services: {
      title: 'Nos services | ALTARYS LABS',
      description:
        "Conseil IT, RH et Finance, développement sur mesure et solutions d'aide à la décision par IA souveraine pour les entreprises des zones OHADA et CIMA.",
    },
    servicesConsulting: {
      title: 'Conseil IT, RH et Finance | ALTARYS LABS',
      description:
        "Accompagnement des entreprises OHADA sur leurs systèmes d'information, leurs processus RH et leur gestion financière.",
    },
    servicesDev: {
      title: 'Développement sur mesure | ALTARYS LABS',
      description:
        "Conception et développement d'applications web et mobile et d'intégrations sur mesure, sur une architecture cloud-native éprouvée en production.",
    },
    servicesAi: {
      title: "Solutions d'aide à la décision par IA souveraine | ALTARYS LABS",
      description:
        "Conception de solutions d'aide à la décision alimentées par une IA souveraine, hébergée et opérée en Afrique, pour répondre aux enjeux de souveraineté des données des entreprises OHADA.",
    },
    about: {
      title: 'À propos | ALTARYS LABS',
      description:
        "ALTARYS LABS, SASU de droit ivoirien, rend accessibles aux entreprises OHADA et CIMA des outils SaaS et une expertise conseil habituellement réservés aux grands groupes.",
    },
    contact: {
      title: 'Contact | ALTARYS LABS',
      description:
        "Échangez avec notre équipe commerciale sur vos besoins en solutions RH, finance, recouvrement, conseil ou développement sur mesure.",
    },
    legalNotice: {
      title: 'Mentions légales | ALTARYS LABS',
      description:
        "Éditeur, hébergement, propriété intellectuelle et droit applicable du site altaryslabs.com, édité par ALTARYS LABS, SASU de droit ivoirien.",
    },
    privacy: {
      title: 'Politique de confidentialité | ALTARYS LABS',
      description:
        "Comment ALTARYS LABS traite les données personnelles collectées sur altaryslabs.com, conformément à la loi ivoirienne n° 2013-450 du 19 juin 2013.",
    },
  } satisfies Record<PageKey, { title: string; description: string }>,

  footer: {
    tagline:
      "Solutions technologiques pour les entreprises d'Afrique, zones OHADA et CIMA.",
    columnProducts: 'Produits',
    columnServices: 'Services',
    columnCompany: 'Entreprise',
    legalEntity: 'ALTARYS LABS, SASU de droit ivoirien',
    rccm: 'RCCM CI-ABI-03-2026-B17-00070',
    location: "Abidjan, Côte d'Ivoire",
    rights: 'Tous droits réservés.',
  },

  /** Libellés communs aux deux pages légales. */
  legal: {
    /* Sur-titre commun : répéter le titre de la page juste au-dessus de
       lui-même n'apporte rien au lecteur. */
    sectionLabel: 'Informations légales',
    lastUpdated: 'Dernière mise à jour',
    updatedOn: '30 juillet 2026',
  },
} as const;

/**
 * Même forme que `fr`, mais avec des `string` au lieu des littéraux figés par
 * `as const`. C'est le contrat que doit remplir chaque traduction : mêmes clés,
 * texte libre. Une clé oubliée ou en trop fait échouer le build.
 */
type Translated<T> = {
  [K in keyof T]: T[K] extends string ? string : Translated<T[K]>;
};

export type Dictionary = Translated<typeof fr>;
