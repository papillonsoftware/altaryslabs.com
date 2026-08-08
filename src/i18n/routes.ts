import type { Locale } from './config';

/**
 * Table de routage bilingue.
 *
 * Chaque page du site est identifiee par une cle stable (PageKey) independante
 * de la langue. C'est cette cle, et non l'URL, qui circule dans les composants :
 * le header, le pied de page et le selecteur de langue en derivent l'URL de la
 * langue courante et celle de la langue alternative.
 *
 * Consequence : changer un slug ici suffit a le repercuter partout, et les
 * hreflang reciproques ne peuvent pas se desynchroniser.
 *
 * Le francais est a la racine (prefixDefaultLocale: false), l'anglais est
 * prefixe par /en et ses slugs sont traduits pour le referencement.
 */
export const ROUTES = {
  home: { fr: '/', en: '/en' },

  products: { fr: '/produits', en: '/en/products' },
  productsHr: {
    fr: '/produits/papillon-hr-suite',
    en: '/en/products/papillon-hr-suite',
  },
  productsFinance: {
    fr: '/produits/papillon-corporate-finance',
    en: '/en/products/papillon-corporate-finance',
  },
  productsPcs: { fr: '/produits/pcs', en: '/en/products/pcs' },

  services: { fr: '/services', en: '/en/services' },
  servicesConsulting: { fr: '/services/conseil', en: '/en/services/consulting' },
  servicesDev: {
    fr: '/services/developpement-sur-mesure',
    en: '/en/services/custom-development',
  },
  servicesAi: { fr: '/services/ia-souveraine', en: '/en/services/sovereign-ai' },

  about: { fr: '/a-propos', en: '/en/about' },
  contact: { fr: '/contact', en: '/en/contact' },

  legalNotice: { fr: '/mentions-legales', en: '/en/legal-notice' },
  privacy: { fr: '/confidentialite', en: '/en/privacy' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof ROUTES;

/** URL relative d'une page dans une langue donnee. */
export function path(key: PageKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** Sous-pages du menu deroulant Produits, dans l'ordre d'affichage. */
export const PRODUCT_KEYS = [
  'productsPcs',
  'productsHr',
  'productsFinance',
] as const satisfies readonly PageKey[];

/** Sous-pages du menu deroulant Services, dans l'ordre d'affichage. */
export const SERVICE_KEYS = [
  'servicesConsulting',
  'servicesDev',
  'servicesAi',
] as const satisfies readonly PageKey[];

/** Pages legales, listees dans le bandeau du pied de page. */
export const LEGAL_KEYS = ['legalNotice', 'privacy'] as const satisfies readonly PageKey[];

/** Lien externe unique vers le site dedie a PCS. */
export const PCS_EXTERNAL_URL = 'https://papillon-collection.com';
