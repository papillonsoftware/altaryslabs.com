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
  fr: 'Français',
  en: 'English',
};

/**
 * Separateur des libelles composes de deux morceaux, du type
 * "Produits : Ouvrir le menu" ou "Change language: English".
 *
 * C'EST UNE DONNEE DE LANGUE, PAS UNE DECORATION. Le francais met une espace
 * avant le deux-points, l'anglais non. Ecrit en dur dans un gabarit, le
 * separateur suit le composant et non la langue : les pages anglaises servaient
 * ainsi `aria-label="Products : Open menu"` sur tout le site.
 *
 * Il vit ici, en une table indexee par la langue, et non dans les
 * dictionnaires : les deux valeurs se lisent alors sur deux lignes voisines,
 * donc une divergence se voit d'un coup d'oeil, alors que `fr.ts` et `en.ts`
 * les auraient eloignees de plusieurs centaines de lignes. Le type Dictionary
 * garantit qu'une cle existe des deux cotes, jamais qu'elle est juste.
 *
 * NE PAS DUPLIQUER DE CONDITION SUR LA LANGUE DANS UN COMPOSANT pour le
 * choisir : c'est exactement ainsi que les deux seules occurrences du motif ont
 * diverge sans que deux rondes de revue le voient. Les composants lisent cette
 * table, indexee par la langue de la page. Voir D124.
 */
export const LABEL_SEPARATOR: Record<Locale, string> = {
  fr: ' : ',
  en: ': ',
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
 * configuration du projet et Cloudflare cesse de lire les variables du
 * dashboard : le journal de build affiche alors "Build environment variables:
 * (none found)" alors que la variable est bien posee dans les deux
 * environnements. Surtout, la valeur est figee dans le HTML statique a la
 * compilation, donc la faire tourner exigeait deja un rebuild : la porter dans
 * le code ne coute aucune souplesse et rend son absence impossible. Voir D100,
 * qui supersede D094.
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
