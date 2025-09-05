// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  // Localized path mappings:
  pathnames: {
    // Properties listing page
    '/properties': {
      en: '/properties',
      pt: '/imoveis',
    },
    // Property detail page with slug
    '/properties/[slug]': {
      en: '/properties/[slug]',
      pt: '/imoveis/[slug]',
    },
  },
});
