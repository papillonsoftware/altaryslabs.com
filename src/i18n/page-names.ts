import type { PageKey } from './routes';

/**
 * Libellés français des pages, isolés du dictionnaire.
 *
 * POURQUOI CE FICHIER EXISTE. Ces libellés ont deux consommateurs qui n'ont
 * rien à voir l'un avec l'autre : le dictionnaire `fr.ts`, qui les sert à la
 * navigation et au fil d'Ariane, et `server/notify-resend.ts`, qui les sert à
 * nommer l'offre visée dans la notification interne. Importer `fr` depuis la
 * fonction Pages tirait les 20 Ko du dictionnaire entier dans le bundle du
 * Worker pour quatorze chaînes. Les isoler ici réduit la surface de dépendance
 * de la fonction, dans l'esprit de D090, sans rien changer au dictionnaire.
 *
 * CE QU'IL NE FAUT PAS FAIRE À LA PLACE : recopier ces libellés dans la
 * fonction. D096 exige qu'un renommage de page arrive dans l'email sans que
 * personne y pense, exactement comme D068 l'exigeait déjà pour le select du
 * formulaire. Une copie diverge en silence, et l'email est le seul endroit où
 * personne ne verrait la divergence. Une seule table, deux lecteurs. Voir D118.
 *
 * `satisfies Record<PageKey, string>` est le garde-fou : ajouter une route dans
 * `routes.ts` sans son libellé fait échouer le build.
 */
export const PAGE_NAMES_FR = {
  home: 'Accueil',
  products: 'Produits',
  productsHr: 'Papillon HR Suite',
  productsFinance: 'Papillon Corporate Finance Suite',
  productsPcs: 'Papillon Collection Solution',
  services: 'Services',
  servicesConsulting: 'Conseil IT, RH & Corporate Finance',
  servicesDev: 'Développement sur mesure',
  servicesAi: 'IA souveraine',
  about: 'À propos',
  contact: 'Contact',
  legalNotice: 'Mentions légales',
  privacy: 'Politique de confidentialité',
} satisfies Record<PageKey, string>;

/**
 * Septième option du select « Je suis intéressé par », la seule qui ne soit pas
 * une page. Elle voyage avec les treize autres parce que la notification doit
 * savoir rendre les sept valeurs possibles du champ, pas seulement six.
 */
export const INTEREST_OTHER_FR = 'Autre';
