/**
 * Verification serveur du jeton Cloudflare Turnstile.
 *
 * Le widget cote client ne prouve rien : il produit un jeton, et n'importe qui
 * peut poster le formulaire sans passer par la page. Cette verification est la
 * premiere moitie de l'anti-robot.
 *
 * LA SECONDE MOITIE VIT AILLEURS, ET CE MODULE N'EST PAS AUTOPORTANT. Un jeton
 * valide ne suffit pas : la cle de site est publique par construction, donc
 * quiconque sert une page sur un hote que le widget autorise peut resoudre le
 * defi et poster le jeton ici. C'est pourquoi ce module renvoie le `hostname`
 * rapporte par siteverify au lieu de le jeter, et pourquoi
 * `functions/api/contact.ts` le compare a l'hote de la requete et refuse un
 * jeton produit ailleurs. Ne pas supprimer cette comparaison en croyant que ce
 * fichier tient seul : elle est necessaire, pas decorative. Voir D107.
 *
 * ECHEC FERME. Toute anomalie (secret absent, jeton absent, reseau coupe,
 * reponse illisible) renvoie un refus. Un anti-spam qui laisse passer quand il
 * tombe en panne ne protege rien : il donne juste la fenetre pendant laquelle
 * il est inutile.
 *
 * L'ADRESSE IP N'EST PAS TRANSMISE. Le parametre `remoteip` de siteverify est
 * facultatif. On ne lit donc l'adresse du visiteur a aucun moment de la chaine,
 * ce qui rend le code trivialement conforme a la section 2 de
 * `/confidentialite`, qui ferme la liste des donnees collectees. Voir D093.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Nom du champ que Turnstile injecte lui-meme dans le formulaire. */
export const TURNSTILE_FIELD_NAME = 'cf-turnstile-response';

export interface TurnstileVerdict {
  ok: boolean;
  /**
   * Hote sur lequel le defi a reellement ete resolu, tel que Cloudflare le
   * rapporte. C'est la seule facon de savoir ou le jeton a ete produit, et
   * l'ignorer rend la verification contournable : la cle de site est publique
   * et figure dans le HTML servi, donc n'importe qui peut servir une page sur un
   * hote autorise par le widget, resoudre le defi, et poster le jeton ailleurs.
   * `null` quand Cloudflare ne le fournit pas. Voir D107.
   */
  hostname: string | null;
  /**
   * Codes d'erreur renvoyes par Cloudflare, ou un code local pour les cas
   * traites avant l'appel. Destines au journal du serveur uniquement : ils ne
   * sont jamais montres au visiteur, qui recoit un message ecrit dans sa
   * langue depuis le dictionnaire.
   */
  errorCodes: string[];
}

interface SiteverifyResponse {
  success?: boolean;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Valide un jeton aupres de Cloudflare.
 *
 * @param secret Cle secrete du widget, lue dans l'environnement Pages.
 * @param token  Jeton produit par le widget, ou null s'il est absent du POST.
 */
export async function verifyTurnstileToken(
  secret: string | undefined,
  token: string | null,
): Promise<TurnstileVerdict> {
  /* Le secret manquant est une erreur de configuration de la plateforme, pas
     du visiteur, mais la conclusion reste le refus : sans lui, aucune
     soumission ne peut etre distinguee d'un robot. */
  if (!secret) return { ok: false, hostname: null, errorCodes: ['secret-absent-de-l-environnement'] };
  if (!token) return { ok: false, hostname: null, errorCodes: ['jeton-absent-du-formulaire'] };

  let response: Response;
  try {
    response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
  } catch {
    return { ok: false, hostname: null, errorCodes: ['siteverify-injoignable'] };
  }

  if (!response.ok) {
    return { ok: false, hostname: null, errorCodes: [`siteverify-http-${response.status}`] };
  }

  let payload: SiteverifyResponse;
  try {
    payload = (await response.json()) as SiteverifyResponse;
  } catch {
    return { ok: false, hostname: null, errorCodes: ['siteverify-reponse-illisible'] };
  }

  return {
    ok: payload.success === true,
    hostname: payload.hostname ?? null,
    errorCodes: payload['error-codes'] ?? [],
  };
}
