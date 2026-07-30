import type { PageKey } from './routes';

/**
 * Dictionnaire francais. C'est la langue de reference : le type Dictionary est
 * derive de ce fichier, donc toute cle ajoutee ici devient obligatoire en
 * anglais et le build echoue tant qu'elle manque.
 */
export const fr = {
  common: {
    skipToContent: 'Aller au contenu principal',
    newTab: 'ouvre un nouvel onglet',
    switchLanguage: 'Changer de langue',
  },

  nav: {
    products: 'Produits',
    services: 'Services',
    about: 'A propos',
    contact: 'Contact',
    cta: 'Discutons',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    home: 'Accueil',
  },

  /** Libelle court de chaque page, utilise en navigation et en fil d'Ariane. */
  pageName: {
    home: 'Accueil',
    products: 'Produits',
    productsHr: 'Papillon HR Suite',
    productsFinance: 'Papillon Corporate Finance Suite',
    productsPcs: 'Papillon Collection Solution',
    services: 'Services',
    servicesConsulting: 'Conseil IT, RH et Finance',
    servicesDev: 'Developpement sur mesure',
    servicesAi: 'IA souveraine',
    about: 'A propos',
    contact: 'Contact',
  } satisfies Record<PageKey, string>,

  /** Accroche courte de chaque page, affichee dans les menus deroulants. */
  pageTagline: {
    home: '',
    products: '',
    productsHr: 'SaaS RH et paie conforme OHADA',
    productsFinance: 'Budgetisation conforme SYSCOHADA',
    productsPcs: 'Recouvrement de primes en zone CIMA',
    services: '',
    servicesConsulting: "Systemes d'information, RH et gestion financiere",
    servicesDev: 'Applications web, mobile et integrations',
    servicesAi: "Aide a la decision et souverainete des donnees",
    about: '',
    contact: '',
  } satisfies Record<PageKey, string>,

  meta: {
    home: {
      title: 'ALTARYS LABS | Solutions technologiques pour les entreprises OHADA et CIMA',
      description:
        "Editeur de suites SaaS et prestataire de conseil et de developpement pour les entreprises d'Afrique de l'Ouest et Centrale. Ressources humaines, finance d'entreprise, recouvrement et assurance.",
    },
    products: {
      title: 'Nos produits | ALTARYS LABS',
      description:
        'Trois suites SaaS concues pour les specificites reglementaires et operationnelles des entreprises des zones OHADA et CIMA.',
    },
    productsHr: {
      title: 'Papillon HR Suite | SaaS RH et paie conforme OHADA',
      description:
        "Solution SaaS de gestion des ressources humaines et de paie pour les PME de la zone OHADA. Pensee mobile-first et offline-first pour les contextes a connectivite limitee.",
    },
    productsFinance: {
      title: 'Papillon Corporate Finance Suite | Budgetisation conforme SYSCOHADA',
      description:
        "Solution SaaS de gestion budgetaire, des engagements et des depenses, conforme SYSCOHADA, pour les directions financieres des PME de la zone OHADA.",
    },
    productsPcs: {
      title: 'Papillon Collection Solution | Recouvrement de primes en zone CIMA',
      description:
        "Automatisation du renouvellement de contrats et de la relance de primes par SMS, WhatsApp et email, pour les assureurs et courtiers de la zone CIMA.",
    },
    services: {
      title: 'Nos services | ALTARYS LABS',
      description:
        'Conseil IT, RH et Finance, developpement sur mesure et solutions d\'aide a la decision par IA souveraine pour les entreprises des zones OHADA et CIMA.',
    },
    servicesConsulting: {
      title: 'Conseil IT, RH et Finance | ALTARYS LABS',
      description:
        "Accompagnement des entreprises OHADA sur leurs systemes d'information, leurs processus RH et leur gestion financiere.",
    },
    servicesDev: {
      title: 'Developpement sur mesure | ALTARYS LABS',
      description:
        "Conception et developpement d'applications web et mobile et d'integrations sur mesure, sur une architecture cloud-native eprouvee en production.",
    },
    servicesAi: {
      title: "Solutions d'aide a la decision par IA souveraine | ALTARYS LABS",
      description:
        "Conception de solutions d'aide a la decision alimentees par une IA souveraine, hebergee et operee en Afrique, pour repondre aux enjeux de souverainete des donnees des entreprises OHADA.",
    },
    about: {
      title: 'A propos | ALTARYS LABS',
      description:
        "ALTARYS LABS, SASU de droit ivoirien, rend accessibles aux entreprises OHADA et CIMA des outils SaaS et une expertise conseil habituellement reserves aux grands groupes.",
    },
    contact: {
      title: 'Contact | ALTARYS LABS',
      description:
        "Echangez avec notre equipe commerciale sur vos besoins en solutions RH, finance, recouvrement, conseil ou developpement sur mesure.",
    },
  } satisfies Record<PageKey, { title: string; description: string }>,

  footer: {
    tagline:
      "Editeur de solutions SaaS et partenaire technologique des entreprises des zones OHADA et CIMA.",
    columnProducts: 'Produits',
    columnServices: 'Services',
    columnCompany: 'Entreprise',
    legalEntity: 'ALTARYS LABS, SASU de droit ivoirien',
    rccm: 'RCCM CI-ABI-03-2026-B17-00070',
    location: 'Abidjan, Cote d\'Ivoire',
    rights: 'Tous droits reserves.',
  },
} as const;

/**
 * Meme forme que `fr`, mais avec des `string` au lieu des litteraux figes par
 * `as const`. C'est le contrat que doit remplir chaque traduction : memes cles,
 * texte libre. Une cle oubliee ou en trop fait echouer le build.
 */
type Translated<T> = {
  [K in keyof T]: T[K] extends string ? string : Translated<T[K]>;
};

export type Dictionary = Translated<typeof fr>;

