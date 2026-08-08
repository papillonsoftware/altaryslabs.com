import type { Dictionary } from './fr';

/**
 * English dictionary.
 *
 * This is a re-adaptation, not a literal translation. It addresses three
 * audiences that the French version does not: anglophone African markets,
 * international investors and partners, and institutional funders and NGOs.
 *
 * Practical consequences:
 *  - Expand OHADA and CIMA in body copy when a page argues the regulatory
 *    point: the acronyms carry no meaning for a reader in Accra, Lagos or
 *    Nairobi. The house form is "the OHADA business-law zone and the CIMA
 *    insurance zone".
 *    Keep the bare acronyms where the expansion does not fit: a title a search
 *    engine truncates around 60 characters, a heading that would wrap to a
 *    third line, a column too narrow to hold it.
 *    These lines are written as instructions, and they name constraints rather
 *    than keys, on purpose. Every earlier version described the file instead:
 *    which pages expanded the acronyms, how many did not, which surfaces were
 *    exempt and why. Every one of those descriptions was found false, some only
 *    after shipping. No build step reads a comment, so a description drifts from
 *    what it describes and nothing says so. An instruction can be poor advice;
 *    it cannot be factually wrong.
 *    This paragraph therefore does not say which pages expand them. Measure it:
 *      grep -rl "business-law zone" dist/en --include=index.html
 *      grep -rl "insurance zone"    dist/en --include=index.html
 *    Run BOTH. The two halves do not travel together: when this paragraph was
 *    written the first returned the HR page and not PCS, and the second
 *    returned PCS and not HR. A single-marker grep is what let a false claim
 *    through more than once.
 *    Both also match the `<head>`, where a meta description carries the phrase
 *    on a page whose body never shows it. That is how PCS was once listed among
 *    the pages that expand. For body copy only:
 *      node -e 'const fs=require("fs");for(const f of process.argv.slice(1)){
 *      const h=fs.readFileSync(f,"utf8");if(/business-law zone|insurance zone/
 *      .test(h.slice(h.indexOf("</head>"))))console.log(f)}' \
 *      $(find dist/en -name index.html)
 *    Per D075, the sweep itself is verified key by key against `fr.ts`, never
 *    by grepping markers.
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
    servicesConsulting: 'IT, HR & Corporate Finance Consulting',
    servicesDev: 'Custom Development',
    servicesAi: 'Sovereign AI',
    about: 'About',
    contact: 'Contact',
    legalNotice: 'Legal notice',
    privacy: 'Privacy policy',
  },

  pageTagline: {
    home: '',
    products: '',
    productsHr: 'OHADA-compliant HR and payroll SaaS',
    productsFinance: 'Budgeting aligned with the SYSCOHADA accounting standard',
    productsPcs: 'Premium and instalment collection in the CIMA zone',
    services: '',
    servicesConsulting: 'Information systems, HR and financial management',
    servicesDev: 'Web and mobile applications, and systems integration',
    servicesAi: 'Decision support and data sovereignty',
    about: '',
    contact: '',
    legalNotice: '',
    privacy: '',
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
    heroTitle: 'Your technology partner for businesses across Africa.',
    heroEmphasis: 'OHADA and CIMA regions',
    heroSubtitle:
      'Human resources, corporate finance and insurance premium collection. Three domains where our software and our consulting practice support the growth of African organisations.',
    heroPrimary: 'Talk to our team',
    heroSecondary: 'Explore our products',

    /* Voir le commentaire de `ogSubtitle` dans fr.ts. */
    ogSubtitle:
      'SaaS software for insurance, collections, corporate finance and HR. IT consulting, sovereign AI, custom software projects.',

    productsLabel: 'Our products',
    productsTitle: 'Three SaaS suites designed for OHADA and CIMA regulatory realities',

    servicesLabel: 'Our services',
    servicesTitle: 'Sector expertise applied to your projects',

    aboutLabel: 'ALTARYS LABS',
    aboutText:
      'An Ivorian company operating across the OHADA business-law zone and the CIMA insurance zone, run by technical and functional specialists with a background in banking, insurance and the delivery of complex, secure business systems.',

    ctaTitle: "Let's discuss your project",
    ctaLabel: 'Talk to our team',
  },

  productsPage: {
    label: 'Products',
    title: 'Three SaaS suites for the OHADA and CIMA regions',
    intro:
      'Each one answers the regulatory and operational realities of the OHADA business-law zone and the CIMA insurance zone. Compliance, limited connectivity and multi-country operations are designed in from the start, not bolted on afterwards.',
    ctaTitle: 'A question about our products?',
    ctaLabel: 'Talk to our team',
  },

  servicesPage: {
    label: 'Services',
    title: 'Expertise applied to your projects',
    intro:
      'The same sector expertise drives our own products and the consulting and development work we deliver for others. What we prove on our platforms, we bring to yours.',
    ctaTitle: "Let's discuss what you need",
    ctaLabel: 'Talk to our team',
  },

  product: {
    label: 'Product',
    ctaDemo: 'Request a demo',
    ctaSales: 'Talk to our team',
  },

  productHr: {
    intro:
      'A SaaS platform for human resources and payroll, built for companies of 2 to 350 employees. Offline-first and mobile-first, so it keeps working where connectivity does not.',

    features: [
      {
        title: 'Configurable compliance',
        text: 'Payroll and social contribution rules set per country, starting with Ivorian regulations.',
      },
      {
        title: 'Offline-first',
        text: 'Works without a connection and synchronises when the network returns.',
      },
      {
        title: 'Mobile-first',
        text: 'Optimised for entry-level smartphones.',
      },
      {
        title: '2 to 350 employees',
        text: 'Designed around how small and mid-sized companies actually operate.',
      },
    ],

    deploymentLabel: 'Rollout',
    deploymentTitle: 'Progressive coverage across the OHADA zone',
    deploymentText:
      "The rollout starts in Côte d'Ivoire, then extends to Benin, Cameroon, Senegal and the Democratic Republic of the Congo, with the ambition of progressively covering the whole OHADA business-law zone.",
    waves: [
      {
        label: 'Wave 1, 2026',
        text: 'Attendance tracking, absence management, budget management, expense and commitment tracking.',
      },
      {
        label: 'Wave 2, late 2026 into 2027',
        text: 'Full payroll.',
      },
      {
        label: 'Wave 3, 2027',
        text: 'Appraisals and performance, recruitment.',
      },
    ],

    modulesLabel: 'Platform modules',
    modules: [
      'Payroll and social contributions',
      'QR attendance',
      'Leave and absences',
      'HR core',
      'Employee management',
      'Time and activities',
      'Health and safety',
      'Performance',
      'Skills',
      'Training',
      'Recruitment',
      'Advanced documents',
    ],

    ctaTitle: 'See Papillon HR Suite in action',
  },

  productFinance: {
    intro:
      'A SaaS platform for budgeting aligned with the SYSCOHADA accounting standard, built for the finance departments of small and mid-sized companies. It runs on the same technical platform as Papillon HR Suite, so company data stays consistent across both.',
    cards: [
      {
        title: 'Expense management',
        text: 'Tracking and approval of expense claims and day-to-day spending, with a full audit trail for your finance team.',
      },
      {
        title: 'Budgets and commitments',
        text: 'Budget control and commitment tracking, aligned with the SYSCOHADA accounting standard.',
      },
    ],
    ctaTitle: 'See Papillon Corporate Finance Suite in action',
  },

  service: {
    label: 'Service',
    ctaTitle: "Let's discuss what you need",
    ctaLabel: 'Talk to our team',
  },

  serviceConsulting: {
    intro:
      'We help African organisations strengthen their information systems, HR processes and financial management. The same expertise shapes the design of our own Papillon suites.',
    domains: [
      {
        title: 'Information systems',
        text: 'Audit, scoping and support for the digital transformation of your business tools.',
      },
      {
        title: 'Human resources',
        text: 'Structuring HR processes and support with regulatory compliance across the region.',
      },
      {
        title: 'Financial management',
        text: 'Budget scoping, SYSCOHADA compliance and financial steering for your teams.',
      },
      {
        title: 'Change management',
        text: 'Training your teams and supporting the rollout of new tools.',
      },
    ],
  },

  serviceDev: {
    intro:
      'We design web and mobile applications, along with custom integrations, on a cloud-native architecture built to last.',
    approachLabel: 'Our approach',
    approachText:
      'Web and mobile applications, integrations and business connectors, custom portals. We rely on proven technologies: Java and Spring Boot on the server, React and TypeScript on the interface, with a cloud-native architecture for reliability and scale.',
    tags: ['Java / Spring Boot', 'React / TypeScript', 'Cloud-native architecture'],
  },

  serviceAi: {
    intro:
      'We design AI-powered decision support systems hosted and operated in Africa, built for organisations that cannot let their data leave the continent.',
    domains: [
      {
        title: 'Data sovereignty',
        text: 'Hosted and operated in Africa, to meet local regulatory requirements.',
      },
      {
        title: 'Decision support',
        text: 'Systems designed to inform the financial, HR and operational decisions your teams make.',
      },
    ],
  },

  productPcs: {
    intro:
      'Papillon Collection Solution lets insurers and insurance brokers automate policy renewal and premium follow-up over SMS, WhatsApp and email, through to customer authentication and payment.',
    externalCta: 'Discover PCS on papillon-collection.com',
  },

  about: {
    title: 'Why ALTARYS LABS',
    intro:
      "ALTARYS LABS is a company incorporated in Côte d'Ivoire, operating across the OHADA business-law zone and the CIMA insurance zone. Our mission is to bring SaaS tools and consulting expertise, usually reserved for large corporations, within reach of the companies of those regions.",
    team:
      'Our team brings together technical and functional specialists with a background in banking, insurance and the delivery of complex, secure business systems, working to support the growth of African companies.',

    approachLabel: 'Our approach',
    approach: [
      {
        title: 'Regional compliance',
        text: 'Regional frameworks are designed in from the start: country payroll and social contribution rules, and the SYSCOHADA accounting standard for budgeting. Compliance is never bolted on afterwards.',
      },
      {
        title: 'Offline-first by design',
        text: 'Our applications keep working without a permanent connection and synchronise when the network returns. They are built for entry-level smartphones and 3G networks.',
      },
      {
        title: 'Data isolation',
        text: 'Every customer gets its own space. Several database isolation levels cover requirements from small companies to large organisations.',
      },
    ],

    leadershipLabel: 'Leadership',
    leaderName: 'Emmanuel Blonvia',
    leaderRole: 'Founder and Chairman',

    ctaTitle: "Let's discuss your project",
    ctaLabel: 'Talk to our team',
  },

  contact: {
    title: 'Talk to our sales team',
    intro: 'Tell us about your needs and we will get back to you quickly.',

    optional: '(optional)',

    nameLabel: 'Full name',
    namePlaceholder: 'Your name',
    companyLabel: 'Company',
    companyPlaceholder: 'Your company name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@company.com',
    phoneLabel: 'Phone',
    phonePlaceholder: '+225 ...',
    interestLabel: 'I am interested in',
    interestPrompt: 'Select an option',
    interestOther: 'Other',
    messageLabel: 'Message',
    messagePlaceholder: 'Describe what you need',

    submit: 'Send',

    privacyNotice:
      'By sending this form, you agree that your details may be used to respond to your enquiry.',
    privacyLink: 'Read our privacy policy',

    successTitle: 'Message sent',
    successText:
      'Thank you for your message. Our sales team will get back to you shortly.',

    errorTitle: 'Message not sent',
    errorText:
      'Your message could not be delivered. Check your connection and try again in a few moments.',

    fallbackText: 'You can also write to us directly at',

    noScriptText:
      'Sending this form requires JavaScript, which is turned off in your browser.',
  },

  meta: {
    home: {
      title: 'ALTARYS LABS | Technology partner in the OHADA and CIMA regions',
      description:
        'SaaS software publisher for insurance, corporate finance and human resources. Consulting and software engineering for companies across West and Central Africa.',
    },
    products: {
      title: 'Products | ALTARYS LABS',
      description:
        'Three SaaS suites designed for the regulatory and operational realities of companies in the OHADA and CIMA regions.',
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
        'Automated policy renewal and premium collection over SMS, WhatsApp and email, for insurers and brokers operating in the CIMA insurance zone.',
    },
    services: {
      title: 'Services | ALTARYS LABS',
      description:
        'IT, HR & Corporate Finance Consulting, Custom Development, and Sovereign AI decision support for organisations operating in Africa.',
    },
    servicesConsulting: {
      title: 'IT, HR & Corporate Finance Consulting | ALTARYS LABS',
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
    legalNotice: {
      title: 'Legal notice | ALTARYS LABS',
      description:
        'Publisher, hosting, intellectual property and applicable law for altaryslabs.com, published by ALTARYS LABS, a company incorporated in Cote d\'Ivoire.',
    },
    privacy: {
      title: 'Privacy policy | ALTARYS LABS',
      description:
        'How ALTARYS LABS handles personal data collected on altaryslabs.com, under Ivorian law no. 2013-450 of 19 June 2013.',
    },
  },

  footer: {
    tagline:
      'Software publisher and consulting practice, OHADA and CIMA regions.',
    columnProducts: 'Products',
    columnServices: 'Services',
    columnContact: 'Contact',
    columnLegal: 'Legal',
    emailLabel: 'Email:',
    phoneLabel: 'Phone:',
    contactForm: 'Contact form',
    legalEntity: "ALTARYS LABS, a company incorporated in Côte d'Ivoire",
    rccm: 'Company registration CI-ABJ-03-2026-B17-00070',
    location: "Abidjan, Côte d'Ivoire",
  },

  legal: {
    sectionLabel: 'Legal information',
    lastUpdated: 'Last updated',
    updatedOn: '30 July 2026',
  },
};
