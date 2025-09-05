'use client';
import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const base = 'px-3 py-1 rounded-md border';
  const inactive = '';
  const active = 'opacity-50 cursor-default pointer-events-none';

  return (
    <div className="flex items-center gap-2">
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        href={pathname as any}
        locale="en"
        aria-label="Switch to English"
        className={`${base} ${locale === 'en' ? active : inactive}`}
      >
        EN
      </Link>
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        href={pathname as any}
        locale="pt"
        aria-label="Mudar para Português"
        className={`${base} ${locale === 'pt' ? active : inactive}`}
      >
        PT
      </Link>
    </div>
  );
}
