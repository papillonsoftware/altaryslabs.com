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

/**
 * Coordonnees commerciales, identiques dans les deux langues.
 *
 * Elles vivent ici et non dans les dictionnaires : une adresse ou un numero
 * dupliques d'une langue a l'autre finissent par diverger, exactement le
 * raisonnement que D027 a applique au RCCM. Seuls les libelles qui les
 * introduisent sont traduits. Le pied de page et la page Contact lisent cette
 * meme source. Voir D076.
 */
export const CONTACT_EMAIL = 'contact@altaryslabs.com';
export const CONTACT_PHONE = '+225 07 20 52 22 69';

/** `tel:` derive du numero affiche, pour que les deux ne puissent pas differer. */
export const CONTACT_PHONE_HREF = `tel:${CONTACT_PHONE.replace(/\s/g, '')}`;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
