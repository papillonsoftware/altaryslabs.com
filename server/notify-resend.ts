/**
 * Notification email d'une demande de contact, via Resend.
 *
 * Ce message est interne : il part vers `CONTACT_NOTIFY_EMAIL` ou, a defaut,
 * vers `CONTACT_EMAIL`, et n'est jamais lu par le visiteur. Le repli est ce qui
 * rend la variable facultative, voir D106 et l'interface `Env` de
 * `functions/api/contact.ts`, enumeration de reference des variables du
 * formulaire. Il est donc redige en francais, langue de travail du
 * depot, quelle que soit la langue de la page d'ou vient la demande. La langue
 * du visiteur figure en clair dans le corps, parce qu'elle dicte la langue de
 * la reponse commerciale.
 *
 * L'ECHEC N'EST PAS FATAL. Si la ligne est en base et que seul l'email echoue,
 * la demande n'est pas perdue et le visiteur voit le succes : lui demander de
 * renvoyer produirait un doublon pour rien. Ce module renvoie donc un booleen,
 * jamais une exception, et c'est le gestionnaire qui journalise. Voir D097.
 */

import { CONTACT_EMAIL } from '../src/i18n/config';
import { INTEREST_OTHER_FR, PAGE_NAMES_FR } from '../src/i18n/page-names';
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
 * Derive de la meme table que `pageName`, donc identique a l'intitule du menu
 * et a celui du select : un renommage de page arrive ici sans que personne y
 * pense, comme le voulait D068. Volontairement total : une valeur inattendue
 * est rendue telle quelle plutot que de produire un `undefined` dans un email.
 *
 * La table est importee depuis `page-names.ts` et non depuis `fr.ts` : ce
 * module ne tire ainsi que quatorze chaines dans le bundle du Worker au lieu
 * du dictionnaire entier. Recopier ces libelles ici serait la seule facon de
 * faire diverger l'email du menu, dans le seul endroit ou personne ne verrait
 * la divergence. Voir D118.
 */
function interestLabel(interest: string): string {
  if (interest === 'other') return INTEREST_OTHER_FR;

  const labels = PAGE_NAMES_FR as Record<string, string | undefined>;
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
  /* UN SEUL MOTIF PAR MESSAGE. L'ancienne version nommait deux variables dans la
     meme ligne de journal, "RESEND_API_KEY ou CONTACT_NOTIFY_EMAIL absente", et
     ce "ou" a envoye l'enquete du cote de la cle Resend alors que le probleme
     etait le destinataire. Un journal qui laisse choisir entre deux causes ne
     fait que la moitie du travail. Voir D106. */
  if (!apiKey) {
    console.error("[contact] notification non envoyee : RESEND_API_KEY absente de l'environnement");
    return false;
  }

  /* LE DESTINATAIRE NE PEUT PLUS MANQUER.
     `CONTACT_NOTIFY_EMAIL` reste un remplacement, pour le cas ou les
     notifications doivent partir ailleurs que vers l'adresse publique du site,
     mais ce n'est plus une dependance : en son absence on notifie
     `CONTACT_EMAIL`, qui vit dans le depot et sert deja le pied de page et la
     page Contact.

     Cette variable a coute trois demandes reelles. Elle n'avait jamais ete
     posee, et le meme piege de plateforme que D100 l'expliquait : une variable
     en clair ne passe pas par le dashboard sur un projet configure par
     `wrangler.jsonc`. Meme classe d'erreur que la cle de site : une valeur non
     secrete, deja connue du depot, transformee en dependance de plateforme qui
     peut disparaitre en silence. Voir D106. */
  const recipient = notifyEmail?.trim() || CONTACT_EMAIL;

  if (recipient !== notifyEmail?.trim()) {
    console.warn(`[contact] CONTACT_NOTIFY_EMAIL absente, repli sur ${CONTACT_EMAIL}`);
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
        to: [recipient],
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
