/**
 * Reception du formulaire de contact.
 *
 * Fonction Cloudflare Pages, deployee par Cloudflare independamment du build
 * Astro : le site reste en sortie statique, sans adapter.
 *
 * CE FICHIER NE CONTIENT AUCUN SQL ET NE NOMME PAS D1. Il orchestre, il ne
 * stocke pas. Le magasin est derriere `storeContactRequest`, seul endroit du
 * depot qui connaisse le fournisseur, parce que ce fournisseur est provisoire.
 * Voir D090.
 *
 * POST PUIS REDIRECTION 303, jamais de `fetch`. Le succes est porte par l'URL
 * et non par la reponse d'un appel asynchrone : si la connexion lache apres que
 * le POST est parti, le visiteur ne recupere pas son formulaire intact et ne
 * renvoie donc pas le message qui vient d'arriver. C'est la raison d'etre du
 * balisage pose par D066, et cette fonction s'y conforme. Voir D092.
 *
 * ORDRE DES OPERATIONS, ET CE QU'IL IMPLIQUE. Turnstile d'abord, puis la
 * comparaison de l'hote du jeton avec celui de la requete, puis la validation
 * des champs, l'ecriture, et enfin la notification. Un jeton refuse, ou produit
 * sur un autre hote, n'ecrit rien et n'envoie rien. Une ecriture qui echoue
 * montre l'erreur. Une notification qui echoue ne l'annule pas : la demande est
 * en base, redemander au visiteur de renvoyer ne produirait qu'un doublon. Voir
 * D097 pour l'ordre et D107 pour le controle d'hote.
 */

import { DEFAULT_LOCALE, isLocale, type Locale } from '../../src/i18n/config';
import { PRODUCT_KEYS, ROUTES, SERVICE_KEYS } from '../../src/i18n/routes';
import { storeContactRequest, type ContactRequest, type ContactRequestStore } from '../../server/contact-store';
import { sendContactNotification } from '../../server/notify-resend';
import { TURNSTILE_FIELD_NAME, verifyTurnstileToken } from '../../server/turnstile';

/**
 * ENUMERATION DE REFERENCE DES VARIABLES DU FORMULAIRE. C'est ici, et nulle
 * part ailleurs, que la liste est tenue a jour et commentee variable par
 * variable. `CLAUDE.md`, `wrangler.jsonc`, `.gitignore` et le runbook
 * `docs/kb/turnstile-d1-resend-setup.md` y renvoient sans la recopier et sans
 * en donner le compte. Voir D110.
 *
 * La raison de cette regle est un defaut survenu deux fois de suite : D100
 * retire une variable, D106 en rend une facultative, et a chaque fois les
 * descriptions eparpillees sont restees en arriere, jusqu'a decrire l'inverse
 * du code. La description vit donc a cote du comportement, parce que c'est le
 * comportement qui bouge.
 *
 * Aucune valeur ne vit dans le depot. Toutes sont lues a l'EXECUTION par cette
 * fonction, jamais au build : le projet n'a plus aucune variable de build
 * depuis D100.
 */
interface Env {
  /**
   * Binding D1 des demandes de contact. Declare dans `wrangler.jsonc`, pas dans
   * le dashboard.
   */
  DB: ContactRequestStore;

  /**
   * OBLIGATOIRE. Secret Key du widget Turnstile, verifiee cote serveur. A poser
   * dans le dashboard Cloudflare Pages, en Production ET en Preview, avec le
   * type "Secret" et jamais "Text". Absente, toute soumission est refusee :
   * `server/turnstile.ts` echoue ferme.
   */
  TURNSTILE_SECRET_KEY?: string;

  /**
   * OBLIGATOIRE. Cle API Resend, portee "Sending access" seule. Meme regle de
   * type que ci-dessus. Absente, la demande est enregistree mais aucune
   * notification ne part, et le journal le dit sur sa propre ligne. Voir D097
   * et D106.
   */
  RESEND_API_KEY?: string;

  /**
   * FACULTATIVE, remplacement du destinataire des notifications. En son absence
   * elles partent vers `CONTACT_EMAIL`, constante de `src/i18n/config.ts`, donc
   * le formulaire ne depend pas de cette variable pour fonctionner. Ne pas
   * chercher a la poser en type "Text" dans le dashboard : sur un projet dont
   * `wrangler.jsonc` porte `pages_build_output_dir`, une variable en clair
   * n'atteint pas le projet. C'est ce piege qui a coute trois demandes reelles.
   * Voir D100 et D106.
   */
  CONTACT_NOTIFY_EMAIL?: string;
}

/**
 * Contexte d'une fonction Pages, reduit a ce que ce gestionnaire utilise. Voir
 * `server/contact-store.ts` pour la raison de ne pas dependre de
 * `@cloudflare/workers-types`.
 */
interface PagesContext {
  request: Request;
  env: Env;
}

/**
 * Offres selectionnables, derivees de la table de routage : le formulaire ne
 * peut pas accepter un interet que la navigation ignore, et l'ajout d'une page
 * produit ici la bonne valeur sans qu'on y touche. `other` complete la liste,
 * comme la derniere option du select.
 */
const VALID_INTERESTS = new Set<string>([...PRODUCT_KEYS, ...SERVICE_KEYS, 'other']);

/**
 * Longueurs maximales. Une demande legitime tient largement dedans ; la borne
 * existe pour qu'un robot ne puisse pas faire grossir la base ni la
 * notification. 254 pour l'email est le maximum d'une adresse selon la RFC.
 */
const MAX_LENGTHS = {
  name: 120,
  company: 160,
  email: 254,
  phone: 40,
  message: 5000,
} as const;

/* Volontairement permissive : le role de cette expression est d'ecarter une
   saisie qui n'est manifestement pas une adresse, pas de trancher la validite
   d'un domaine. La seule preuve qu'une adresse existe est qu'un message y
   arrive. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valeur nettoyee d'un champ, ou null si absente ou vide. */
function readField(form: FormData, name: string, maxLength: number): string | null {
  const value = form.get(name);
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;

  return trimmed;
}

/**
 * Renvoie le visiteur sur la page Contact de sa langue, etat en clair dans
 * l'URL. La cible est lue dans `ROUTES` et jamais construite depuis une entree
 * du client : une valeur trafiquee dans le champ `locale` ne peut donc produire
 * que l'une des deux pages du site, jamais une redirection ouverte. Voir D091.
 */
function redirectToStatus(request: Request, locale: Locale, status: 'envoye' | 'erreur'): Response {
  const target = new URL(ROUTES.contact[locale], request.url);
  target.search = `statut=${status}`;

  return new Response(null, {
    status: 303,
    headers: {
      Location: target.toString(),
      /* Une reponse de soumission ne doit jamais etre servie depuis un cache
         intermediaire, sous peine d'afficher le succes d'un autre visiteur. */
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Un GET sur l'endpoint renvoie sur la page Contact.
 *
 * Sans ce gestionnaire, `wrangler pages dev` sert la page d'accueil en 200 a
 * cette URL, ce qui est un contenu duplique pour un moteur de recherche et un
 * cul-de-sac deroutant pour un humain qui aurait suivi un lien errant. Un 405
 * nu serait correct sur le plan protocolaire mais offrirait la meme impasse. On
 * redirige donc, sans `?statut` puisqu'il n'y a rien a annoncer, et on interdit
 * l'indexation de l'URL elle-meme.
 *
 * La langue est inconnue sur un GET nu : il n'y a ni champ cache ni contexte.
 * Le francais est donc le defaut, comme partout ailleurs dans le site.
 */
export const onRequestGet = ({ request }: PagesContext): Response => {
  const target = new URL(ROUTES.contact[DEFAULT_LOCALE], request.url);

  return new Response(null, {
    status: 303,
    headers: {
      Location: target.toString(),
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    },
  });
};

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    /* Corps illisible : la langue est inconnue, donc le francais par defaut. Ce
       cas ne vient pas du formulaire du site. */
    console.error('[contact] corps de requete illisible');
    return redirectToStatus(request, DEFAULT_LOCALE, 'erreur');
  }

  /* Langue portee par un champ cache du formulaire, et non deduite du
     `Referer`. Cet en-tete est facultatif par conception : supprime par une
     extension ou un proxy, il renverrait silencieusement un visiteur
     anglophone sur la page francaise, sans qu'aucun journal ne le signale. Le
     champ, lui, ne peut pas disparaitre. Et la langue est une donnee de la
     demande, pas une supposition : elle est enregistree comme telle. Voir D091. */
  const rawLocale = form.get('locale');
  const locale: Locale =
    typeof rawLocale === 'string' && isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  /* Turnstile avant tout le reste : un robot ne doit ni faire grossir la base,
     ni declencher un email, ni consommer une ecriture. */
  const verdict = await verifyTurnstileToken(
    env.TURNSTILE_SECRET_KEY,
    typeof form.get(TURNSTILE_FIELD_NAME) === 'string'
      ? (form.get(TURNSTILE_FIELD_NAME) as string)
      : null,
  );

  if (!verdict.ok) {
    /* Les codes restent au journal. Le visiteur recoit l'etat d'erreur de la
       page, ecrit dans sa langue, qui lui propose de reessayer et lui donne
       l'adresse email de repli. Voir D082. */
    console.error(`[contact] Turnstile a refuse la soumission : ${verdict.errorCodes.join(', ')}`);
    return redirectToStatus(request, locale, 'erreur');
  }

  /* LE JETON DOIT AVOIR ETE PRODUIT SUR CET HOTE.
     Un jeton valide ne suffit pas : la cle de site est publique et figure dans
     le HTML servi, donc n'importe qui peut servir une page sur un hote autorise
     par le widget, resoudre le defi, et poster le jeton ici. Tant que
     `localhost` figurait dans la liste du widget, c'etait faisable depuis une
     machine de bureau, ce qui vidait de son sens la verification sur laquelle
     repose tout le critere 2.

     La comparaison porte sur l'hote de la requete et non sur une liste blanche.
     Le formulaire poste vers `/api/contact`, une URL relative, donc l'hote de la
     page et celui du POST sont toujours identiques pour une soumission
     legitime. Aucune configuration a maintenir, rien a mettre a jour a la
     bascule DNS, et rien qui casse en silence sur une URL de preview par
     branche : une liste blanche aurait du enumerer altaryslabs.com, son `www`,
     le sous-domaine pages.dev et tous ses sous-domaines de preview. Voir D107. */
  const expectedHostname = new URL(request.url).hostname;

  if (verdict.hostname !== expectedHostname) {
    console.error(
      `[contact] jeton produit sur un autre hote, rejete : ${verdict.hostname ?? '(absent)'} au lieu de ${expectedHostname}`,
    );
    return redirectToStatus(request, locale, 'erreur');
  }

  const name = readField(form, 'name', MAX_LENGTHS.name);
  const email = readField(form, 'email', MAX_LENGTHS.email);
  const interest = readField(form, 'interest', 64);
  const message = readField(form, 'message', MAX_LENGTHS.message);

  const missing =
    !name ||
    !email ||
    !EMAIL_SHAPE.test(email) ||
    !interest ||
    !VALID_INTERESTS.has(interest) ||
    !message;

  if (missing) {
    /* Le navigateur bloque deja ce cas : les quatre champs sont `required` et
       l'email est un `type="email"`. Une requete qui arrive ici n'a donc pas
       ete postee par le formulaire du site, et n'a pas besoin d'un message
       plus precis que l'etat d'erreur generique. */
    console.error('[contact] soumission incomplete ou hors contrat, rejetee');
    return redirectToStatus(request, locale, 'erreur');
  }

  const contactRequest: ContactRequest = {
    locale,
    name,
    company: readField(form, 'company', MAX_LENGTHS.company),
    email,
    phone: readField(form, 'phone', MAX_LENGTHS.phone),
    interest,
    message,
  };

  try {
    await storeContactRequest(env.DB, contactRequest);
  } catch (error) {
    /* Rien n'est enregistre : c'est le seul cas ou le visiteur doit reessayer,
       et le seul ou l'etat d'erreur dit la verite. */
    console.error('[contact] echec de l enregistrement de la demande', error);
    return redirectToStatus(request, locale, 'erreur');
  }

  const notified = await sendContactNotification(
    env.RESEND_API_KEY,
    env.CONTACT_NOTIFY_EMAIL,
    contactRequest,
  );

  if (!notified) {
    /* Deliberement pas une erreur pour le visiteur : la demande est en base et
       ne sera pas perdue. Le journal est le canal de rattrapage. Voir D097. */
    console.error('[contact] demande enregistree mais notification non partie');
  }

  return redirectToStatus(request, locale, 'envoye');
};
