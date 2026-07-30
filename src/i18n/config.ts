export const LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

/** Valeur de l'attribut lang et des balises og:locale / hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  fr: 'fr',
  en: 'en',
};

export const OG_LOCALE: Record<Locale, string> = {
  fr: 'fr_CI',
  en: 'en',
};

/** Libelles du selecteur de langue, toujours affiches dans la langue cible. */
export const LOCALE_LABEL: Record<Locale, string> = {
  fr: 'Francais',
  en: 'English',
};

export const SITE_URL = 'https://altaryslabs.com';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
