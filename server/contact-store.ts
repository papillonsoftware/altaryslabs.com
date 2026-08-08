/**
 * Stockage des demandes du formulaire de contact.
 *
 * SEUL FICHIER DU DEPOT QUI CONTIENT DU SQL, ET SEUL FICHIER QUI NOMME D1.
 *
 * D1 est un choix provisoire : la base est hebergee en Europe et la politique
 * de confidentialite annonce deja que la relocalisation sur le continent
 * africain est etudiee. Changer de fournisseur ne doit donc toucher que ce
 * fichier. Le gestionnaire de requete appelle `storeContactRequest` et ne sait
 * rien du magasin qui est derriere : ni le nom de la table, ni le dialecte, ni
 * la forme du binding. Voir D090.
 *
 * CE QUI EST ENREGISTRE, ET POURQUOI PAS PLUS. La section 2 de
 * `/confidentialite` enumere six donnees collectees et ferme la liste par
 * "Aucune autre donnee n'est collectee a votre insu sur ce site". La table
 * porte donc ces six champs, plus l'horodatage du serveur et la langue de la
 * page d'ou part la demande. Jamais l'adresse IP, jamais le user-agent, jamais
 * l'en-tete CF-IPCountry : enregistrer l'un des trois mettrait le code en
 * contradiction avec un texte publie. Voir D093.
 */

/**
 * Surface D1 reellement utilisee, declaree ici plutot qu'importee de
 * `@cloudflare/workers-types`.
 *
 * Deux raisons. Le paquet redeclare globalement `Request`, `Response` et
 * `Headers`, que la lib DOM d'Astro fournit deja, et la collision fait echouer
 * `npm run check` sur l'ensemble du projet. Et surtout, ecrire ici la seule
 * partie de l'API du fournisseur dont on depend rend la dette visible : cette
 * interface est la liste exhaustive de ce qu'un remplacant devra offrir.
 */
interface PreparedStatement {
  bind(...values: unknown[]): PreparedStatement;
  run(): Promise<unknown>;
}

export interface ContactRequestStore {
  prepare(query: string): PreparedStatement;
}

/**
 * Une demande validee, prete a etre enregistree.
 *
 * Les deux champs facultatifs du formulaire arrivent ici en `null` et non en
 * chaine vide : la colonne doit distinguer "non renseigne" de "renseigne
 * vide", sans quoi une relance commerciale sur les societes connues devient un
 * filtre sur une chaine magique.
 */
export interface ContactRequest {
  locale: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  /** Cle de page stable (`productsHr`, `servicesConsulting`, ...) ou `other`. */
  interest: string;
  message: string;
}

const INSERT_CONTACT_REQUEST = `
  INSERT INTO contact_requests
    (submitted_at, locale, name, company, email, phone, interest, message)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * Enregistre une demande. Laisse remonter l'erreur du magasin : c'est le
 * gestionnaire qui decide quoi montrer au visiteur, pas ce module.
 */
export async function storeContactRequest(
  store: ContactRequestStore,
  request: ContactRequest,
): Promise<void> {
  /* Horodatage pose par le serveur, jamais par le client : une date fournie
     par le navigateur est fausse des que l'horloge de la machine derive, et
     falsifiable par construction. */
  const submittedAt = new Date().toISOString();

  await store
    .prepare(INSERT_CONTACT_REQUEST)
    .bind(
      submittedAt,
      request.locale,
      request.name,
      request.company,
      request.email,
      request.phone,
      request.interest,
      request.message,
    )
    .run();
}
