export const locales = ['en', 'pt'] as const;
export const defaultLocale = 'en';
export const localePrefix: 'as-needed' | 'always' | 'never' = 'as-needed';

// Localized pathnames
export const pathnames = {
  '/': '/',
  '/properties': { en: '/properties', pt: '/imoveis' },
  '/agents': { en: '/agents', pt: '/agentes' },
  '/services': { en: '/services', pt: '/servicos' },
  '/favorites': { en: '/favorites', pt: '/favoritos' },
  '/dashboard': { en: '/dashboard', pt: '/painel' },
  '/profile': { en: '/profile', pt: '/perfil' },
  '/contact': { en: '/contact', pt: '/contacto' },
  '/privacy': { en: '/privacy', pt: '/privacidade' },
  '/terms': { en: '/terms', pt: '/termos' },
} as const;
