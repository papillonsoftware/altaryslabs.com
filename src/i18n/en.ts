import type { Dictionary } from './fr';

/**
 * English dictionary.
 *
 * This is a re-adaptation, not a literal translation. It addresses three
 * audiences that the French version does not: anglophone African markets,
 * international investors and partners, and institutional funders and NGOs.
 *
 * Practical consequences, applied consistently across every English string:
 *  - OHADA and CIMA are spelled out on first use, because the acronyms carry no
 *    meaning for a reader in Accra, Lagos or Nairobi.
 *  - Emphasis shifts to what travels across borders (offline-first design,
 *    multi-country deployment, configurable compliance) rather than to
 *    Ivorian-specific schemes such as CNPS or ITS.
 *  - No client names, no performance figures, no testimonials. Credibility is
 *    carried by clarity, never by fabricated proof.
 */
export const en: Dictionary = {
  common: {
    skipToContent: 'Skip to main content',
    newTab: 'opens in a new tab',
    switchLanguage: 'Change language',
    learnMore: 'Learn more',
    discover: 'Explore',
  },

  /**
   * Papillon Collection Solution availability, defined here and nowhere else.
   * One line to change on launch day. Never an exact date on a public page.
   */
  availability: {
    pcs: 'Available Q3 2026',
  },

  nav: {
    products: 'Products',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    cta: "Let's talk",
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    home: 'Home',
  },

  pageName: {
    home: 'Home',
    products: 'Products',
    productsHr: 'Papillon HR Suite',
    productsFinance: 'Papillon Corporate Finance Suite',
    productsPcs: 'Papillon Collection Solution',
    services: 'Services',
    servicesConsulting: 'IT, HR and Finance Consulting',
    servicesDev: 'Custom Development',
    servicesAi: 'Sovereign AI',
    about: 'About',
    contact: 'Contact',
  },

  pageTagline: {
    home: '',
    products: '',
    productsHr: 'Payroll and HR software built for African compliance',
    productsFinance: 'Budgeting aligned with West African accounting standards',
    productsPcs: 'Insurance premium collection across Central and West Africa',
    services: '',
    servicesConsulting: 'Information systems, HR and financial management',
    servicesDev: 'Web and mobile applications, and systems integration',
    servicesAi: 'Decision support and data sovereignty',
    about: '',
    contact: '',
  },

  cards: {
    products: {
      productsPcs: {
        text: 'Automates policy renewal and premium follow-up for insurers and brokers, over SMS, WhatsApp and email.',
      },
      productsHr: {
        badge: 'HR and payroll SaaS',
        text: 'HR and payroll for companies of 2 to 350 employees, offline-first and mobile-first, with compliance rules configurable country by country.',
      },
      productsFinance: {
        badge: 'Finance SaaS',
        text: 'Budgeting, commitments and expense management aligned with the SYSCOHADA accounting standard used across 17 African countries.',
      },
    },
    services: {
      servicesConsulting: {
        text: 'We help African organisations strengthen their information systems, HR processes and financial management.',
      },
      servicesDev: {
        text: 'Web and mobile applications, systems integration and cloud-native architecture, designed around how your teams actually work.',
      },
      servicesAi: {
        text: 'AI-powered decision support, hosted and operated in Africa, for organisations whose data cannot leave the continent.',
      },
    },
  },

  home: {
    heroBadge: 'Papillon Collection Solution',
    heroTitle: 'Enterprise software built for African companies.',
    heroEmphasis: 'West and Central Africa',
    heroSubtitle:
      'Human resources, corporate finance and insurance premium collection. Three domains where our software and our consulting practice support the growth of African organisations.',
    heroPrimary: 'Talk to our team',
    heroSecondary: 'Explore our products',

    productsLabel: 'Our products',
    productsTitle: 'Three SaaS suites designed for African regulatory realities',

    servicesLabel: 'Our services',
    servicesTitle: 'Sector expertise applied to your projects',

    aboutLabel: 'ALTARYS LABS',
    aboutText:
      'An Ivorian company operating across the OHADA business-law zone and the CIMA insurance zone, run by technical and functional specialists with a background in banking, insurance and the delivery of complex, secure business systems.',

    ctaTitle: "Let's discuss your project",
    ctaLabel: 'Talk to our team',
  },

  meta: {
    home: {
      title: 'ALTARYS LABS | Enterprise software for African markets',
      description:
        'We build SaaS platforms and deliver consulting and custom development for companies across West and Central Africa. Human resources, corporate finance, insurance premium collection.',
    },
    products: {
      title: 'Products | ALTARYS LABS',
      description:
        'Three SaaS suites designed for the regulatory and operational realities of companies in West and Central Africa.',
    },
    productsHr: {
      title: 'Papillon HR Suite | Payroll and HR software for African SMEs',
      description:
        'A SaaS platform for human resources and payroll, built for small and mid-sized companies across Africa. Mobile-first and offline-first, so it keeps working where connectivity does not.',
    },
    productsFinance: {
      title: 'Papillon Corporate Finance Suite | Budgeting and expense management',
      description:
        'A SaaS platform for budgeting, commitment tracking and expense management, aligned with the SYSCOHADA accounting standard used across 17 African countries.',
    },
    productsPcs: {
      title: 'Papillon Collection Solution | Insurance premium collection',
      description:
        'Automated policy renewal and premium collection over SMS, WhatsApp and email, for insurers and brokers operating in the CIMA insurance zone of West and Central Africa.',
    },
    services: {
      title: 'Services | ALTARYS LABS',
      description:
        'IT, HR and finance consulting, custom software development, and sovereign AI decision support for organisations operating in Africa.',
    },
    servicesConsulting: {
      title: 'IT, HR and Finance Consulting | ALTARYS LABS',
      description:
        'We help African organisations strengthen their information systems, HR processes and financial management, with the regulatory context factored in from the start.',
    },
    servicesDev: {
      title: 'Custom Development | ALTARYS LABS',
      description:
        'Design and delivery of web and mobile applications and systems integration, on a cloud-native architecture already running our own products in production.',
    },
    servicesAi: {
      title: 'Sovereign AI Decision Support | ALTARYS LABS',
      description:
        'We design AI-powered decision support systems hosted and operated in Africa, built for organisations that cannot let their data leave the continent.',
    },
    about: {
      title: 'About | ALTARYS LABS',
      description:
        'ALTARYS LABS is an Ivorian company bringing SaaS tools and consulting expertise, usually reserved for large corporations, within reach of African businesses.',
    },
    contact: {
      title: 'Contact | ALTARYS LABS',
      description:
        'Talk to our team about HR, finance, premium collection, consulting or custom development.',
    },
  },

  footer: {
    tagline:
      'Enterprise software for African companies, across West and Central Africa.',
    columnProducts: 'Products',
    columnServices: 'Services',
    columnCompany: 'Company',
    legalEntity: "ALTARYS LABS, a company incorporated in Côte d'Ivoire",
    rccm: 'Company registration CI-ABI-03-2026-B17-00070',
    location: "Abidjan, Côte d'Ivoire",
    rights: 'All rights reserved.',
  },
};
