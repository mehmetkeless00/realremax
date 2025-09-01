// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // PT is now the default
  locales: ['en', 'pt'] as const,
  defaultLocale: 'pt',
  // 'as-needed' = default locale has NO /pt prefix; root "/" serves PT.
  // If you want "/pt" prefix on every PT URL, change to 'always'.
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/properties': { en: '/properties', pt: '/imoveis' },
    '/properties/[id]': { en: '/properties/[id]', pt: '/imoveis/[id]' },
    '/agents': { en: '/agents', pt: '/agentes' },
    '/agents/[id]': { en: '/agents/[id]', pt: '/agentes/[id]' },
    '/services': { en: '/services', pt: '/servicos' },
    '/favorites': { en: '/favorites', pt: '/favoritos' },
    '/dashboard': { en: '/dashboard', pt: '/painel' },
    '/profile': { en: '/profile', pt: '/perfil' },
    '/contact': { en: '/contact', pt: '/contacto' },
    '/privacy': { en: '/privacy', pt: '/privacidade' },
    '/terms': { en: '/terms', pt: '/termos' },

    // helpers (same slug in all locales)
    '/advanced-search-bar': '/advanced-search-bar',
    '/property-listing-form': '/property-listing-form',
    '/auth/signin': '/auth/signin',
    '/auth/signup': '/auth/signup',
    '/reset-password': '/reset-password',
  } as const,
});
