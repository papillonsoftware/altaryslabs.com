import { DEFAULT_LOCALE, LOCALES, SITE_URL, isLocale, type Locale } from './config';
import { fr, type Dictionary } from './fr';
import { en } from './en';
import { ROUTES, type PageKey } from './routes';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en };

/** Dictionnaire complet d'une langue. */
export function useTranslations(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Deduit la langue depuis l'URL courante. Le francais etant a la racine, seul
 * le prefixe /en bascule en anglais.
 */
export function getLocaleFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/').filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** URL relative d'une page dans une langue donnee. */
export function localizedPath(key: PageKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** URL absolue, requise pour les canonical, hreflang et balises Open Graph. */
export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).href;
}

/**
 * Paires hreflang reciproques d'une page, plus le x-default pointant vers le
 * francais. Les slugs etant traduits, cette table est la seule source fiable :
 * il n'existe aucun moyen de deriver /en/products depuis /produits.
 */
export function alternates(key: PageKey): Array<{ hreflang: string; href: string }> {
  const list: Array<{ hreflang: string; href: string }> = LOCALES.map((locale) => ({
    hreflang: locale as string,
    href: absoluteUrl(ROUTES[key][locale]),
  }));

  list.push({ hreflang: 'x-default', href: absoluteUrl(ROUTES[key][DEFAULT_LOCALE]) });
  return list;
}

/** Langue vers laquelle bascule le selecteur depuis la langue courante. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}
