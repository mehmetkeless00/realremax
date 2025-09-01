'use client';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const base = 'px-3 py-1 rounded-md border';
  const inactive = '';
  const active = 'opacity-50 cursor-default pointer-events-none';

  const switchTo = (nextLocale: 'en' | 'pt') => {
    // Extract the path without locale prefix
    let pathWithoutLocale: string = pathname as string;

    // Remove /en prefix if it exists
    if (pathname.startsWith('/en')) {
      pathWithoutLocale = pathname.substring(3);
    }

    // Handle root path specially
    if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
      pathWithoutLocale = '/';
    }

    // Navigate to the new locale
    if (nextLocale === 'pt') {
      // PT is default, no prefix needed
      window.location.href = pathWithoutLocale;
    } else {
      // EN needs /en prefix
      window.location.href = `/en${pathWithoutLocale}`;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchTo('en')}
        disabled={locale === 'en'}
        aria-label="Switch to English"
        className={`${base} ${locale === 'en' ? active : inactive}`}
      >
        EN
      </button>
      <button
        onClick={() => switchTo('pt')}
        disabled={locale === 'pt'}
        aria-label="Mudar para Português"
        className={`${base} ${locale === 'pt' ? active : inactive}`}
      >
        PT
      </button>
    </div>
  );
}
