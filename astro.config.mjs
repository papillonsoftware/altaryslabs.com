// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sortie 100% statique. Les Cloudflare Pages Functions vivent dans /functions
// et sont deployees par Cloudflare independamment du build Astro : aucun
// adapter n'est necessaire, ce qui garde le site entierement pre-rendu
// (previews OG WhatsApp / LinkedIn fiables, zero cold start).
export default defineConfig({
  site: 'https://altaryslabs.com',
  output: 'static',
  trailingSlash: 'never',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      // Le francais reste a la racine (/produits), l'anglais est prefixe (/en/products).
      // Aucune URL FR existante n'est cassee par la refonte.
      prefixDefaultLocale: false,
    },
  },

  // Les hreflang reciproques sont emis dans le <head> par BaseLayout, avec des
  // slugs traduits par langue. On n'active donc pas l'option i18n du sitemap :
  // elle suppose un prefixe de locale identique dans les deux langues.
  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'auto',
  },
});
