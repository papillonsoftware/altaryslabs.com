/**
 * Notification email d'une demande de contact, via Resend.
 *
 * Ce message est interne : il part vers `CONTACT_NOTIFY_EMAIL` et n'est jamais
 * lu par le visiteur. Il est donc redige en francais, langue de travail du
 * depot, quelle que soit la langue de la page d'ou vient la demande. La langue
 * du visiteur figure en clair dans le corps, parce qu'elle dicte la langue de
 * la reponse commerciale.
 *
 * L'ECHEC N'EST PAS FATAL. Si la ligne est en base et que seul l'email echoue,
 * la demande n'est pas perdue et le visiteur voit le succes : lui demander de
 * renvoyer produirait un doublon pour rien. Ce module renvoie donc un booleen,
 * jamais une exception, et c'est le gestionnaire qui journalise. Voir D097.
 */

import { fr } from '../src/i18n/fr';
import type { ContactRequest } from './contact-store';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Expediteur. Doit appartenir au domaine verifie dans Resend, DKIM et SPF
 * passes, sans quoi l'API refuse l'envoi en 403. Ce n'est pas un secret : la
 * valeur est publique par nature puisqu'elle voyage dans chaque en-tete
 * `From`. Elle vit donc ici et non dans une variable d'environnement, ce qui
 * evite une cinquieme variable a maintenir sur deux environnements. Voir D096.
 */
const FROM = 'ALTARYS LABS <formulaire@altaryslabs.com>';

/** Libelles des deux langues, pour le corps du message interne. */
const LOCALE_LABELS: Record<string, string> = {
  fr: 'francais',
  en: 'anglais',
};

/**
 * Intitule lisible de l'offre visee.
 *
 * Derive de `pageName`, donc identique a l'intitule du menu et a celui du
 * select : un renommage de page arrive ici sans que personne y pense, comme le
 * voulait D068. Volontairement total : une valeur inattendue est rendue telle
 * quelle plutot que de produire un `undefined` dans un email.
 */
function interestLabel(interest: string): string {
  if (interest === 'other') return fr.contact.interestOther;

  const labels = fr.pageName as Record<string, string | undefined>;
  return labels[interest] ?? interest;
}

/**
 * Nettoie une valeur destinee a la ligne d'objet.
 *
 * Resend construit le message a partir de JSON, donc l'injection d'en-tete par
 * saut de ligne ne passe pas. On retire quand meme les retours chariot : un
 * objet sur trois lignes est illisible dans une boite de reception, et la
 * defense en profondeur ne coute ici qu'une expression reguliere.
 */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function buildBody(request: ContactRequest): string {
  const localeLabel = LOCALE_LABELS[request.locale] ?? request.locale;

  return [
    'Nouvelle demande recue depuis le formulaire de contact du site.',
    '',
    `Nom          : ${request.name}`,
    `Societe      : ${request.company ?? 'non renseignee'}`,
    `Email        : ${request.email}`,
    `Telephone    : ${request.phone ?? 'non renseigne'}`,
    `Interet      : ${interestLabel(request.interest)}`,
    `Langue       : ${localeLabel}`,
    '',
    'Message :',
    request.message,
    '',
    'Repondre a ce message ecrit directement au visiteur.',
  ].join('\n');
}

/**
 * Envoie la notification.
 *
 * @returns `true` si Resend a accepte le message, `false` dans tous les autres
 *          cas. Ne leve jamais.
 */
export async function sendContactNotification(
  apiKey: string | undefined,
  notifyEmail: string | undefined,
  request: ContactRequest,
): Promise<boolean> {
  if (!apiKey || !notifyEmail) {
    console.error('[contact] notification non envoyee : RESEND_API_KEY ou CONTACT_NOTIFY_EMAIL absente');
    return false;
  }

  const subject = singleLine(
    `Nouvelle demande de contact : ${interestLabel(request.interest)} - ${request.name}`,
  );

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [notifyEmail],
        /* Le commercial repond depuis sa boite au visiteur, sans copier une
           adresse a la main. Nom de champ impose par l'API Resend. */
        reply_to: request.email,
        subject,
        text: buildBody(request),
      }),
    });

    if (!response.ok) {
      /* Le corps de la reponse porte le motif du refus (domaine non verifie,
         cle revoquee, portee insuffisante). Il ne contient jamais la cle. */
      const detail = await response.text().catch(() => '(corps illisible)');
      console.error(`[contact] Resend a refuse l'envoi, HTTP ${response.status} : ${detail}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[contact] Resend injoignable', error);
    return false;
  }
}
