-- Demandes issues du formulaire de contact du site.
--
-- Appliquer avec :
--   npx wrangler d1 migrations apply altaryslabs-contact --remote
--
-- Les colonnes reprennent un pour un les six donnees que la section 2 de
-- /confidentialite enumere, plus l'horodatage pose par le serveur et la langue
-- de la page d'ou part la demande. Cette liste est close : la politique publiee
-- se termine par "Aucune autre donnee n'est collectee a votre insu sur ce
-- site". Ni adresse IP, ni user-agent, ni pays. Voir D093.
--
-- La base est hebergee en Europe et assumee provisoire : la relocalisation sur
-- le continent africain est etudiee, et la politique de confidentialite le dit
-- deja. Voir D090.

CREATE TABLE IF NOT EXISTS contact_requests (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,

  -- ISO 8601 UTC, pose par la fonction serveur, jamais par le navigateur.
  submitted_at  TEXT NOT NULL,

  -- Langue de la page d'origine, qui dicte la langue de la reponse commerciale.
  locale        TEXT NOT NULL,

  name          TEXT NOT NULL,

  -- Les deux champs facultatifs du formulaire. NULL veut dire "non renseigne",
  -- ce qu'une chaine vide ne saurait pas distinguer d'une saisie effacee.
  company       TEXT,
  phone         TEXT,

  email         TEXT NOT NULL,

  -- Cle de page stable (productsHr, servicesConsulting, ...) ou "other", et non
  -- l'intitule traduit : le meme interet ne doit pas arriver sous deux chaines
  -- selon la langue du visiteur. Voir D070.
  interest      TEXT NOT NULL,

  message       TEXT NOT NULL
);

-- Seul motif de lecture prevu : les demandes les plus recentes d'abord.
CREATE INDEX IF NOT EXISTS idx_contact_requests_submitted_at
  ON contact_requests (submitted_at DESC);
