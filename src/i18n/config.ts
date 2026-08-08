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

/**
 * Cle de site du widget Turnstile de la page Contact.
 *
 * CE N'EST PAS UN SECRET, et elle ne peut pas en etre un. Turnstile fonctionne
 * avec deux cles : celle-ci identifie le widget aupres du navigateur et doit
 * donc figurer dans le HTML rendu, servie en clair a chaque visiteur ; la cle
 * secrete, elle, ne quitte jamais le serveur et vit dans l'environnement
 * Cloudflare Pages sous `TURNSTILE_SECRET_KEY`. Avec la seule cle de site on ne
 * peut ni forger un jeton ni en verifier un : les deux exigent le secret. La
 * liste de hostnames du widget borne en plus les domaines qui peuvent en
 * produire.
 *
 * POURQUOI ELLE VIT ICI ET NON DANS UNE VARIABLE DE BUILD. Elle y a vecu, et
 * cela a casse un build. Depuis que `wrangler.jsonc` porte
 * `pages_build_output_dir`, ce fichier est la source de verite de la
 * configuration du projet et AUCUNE VARIABLE EN CLAIR DU DASHBOARD N'ATTEINT
 * PLUS LE PROJET, NI AU BUILD NI A L'EXECUTION ; seuls les secrets y restent
 * gerables. Au build, le journal l'annonce : "Build environment variables:
 * (none found)" alors que la variable est bien posee dans les deux
 * environnements. A l'execution il n'y a aucun journal du tout, la fonction lit
 * simplement undefined.
 *
 * NE PAS REPETER LA FORME COURTE de cette regle ("Cloudflare cesse de lire les
 * variables du dashboard pour le build") : elle est vraie, incomplete, et
 * laisse croire que l'execution, elle, fonctionne. C'est la formulation qui a
 * envoye l'enquete du mauvais cote pendant une heure.
 *
 * Surtout, la valeur est figee dans le HTML statique a la compilation, donc la
 * faire tourner exigeait deja un rebuild : la porter dans le code ne coute
 * aucune souplesse et rend son absence impossible. Voir D115, qui complete
 * D100, laquelle supersede D094.
 */
/* Valeur relue de la source autoritative, `npx wrangler turnstile widget list`,
   et non d'une capture d'ecran : une premiere lecture visuelle avait ajoute un
   `A`, ce qui aurait produit un widget refusant de s'afficher et une enquete
   menee du mauvais cote. Widget `altaryslabs-contact`, mode managed, hostnames
   altaryslabs.com, altaryslabscom.pages.dev et localhost. */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEJi7Va5J9P_VzB3';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
