'use client';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

export default function DebugI18n() {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div style={{ padding: 24 }}>
      <h1>i18n Debug</h1>
      <p>
        locale: <b>{locale}</b>
      </p>
      <p>
        pathname: <b>{pathname}</b>
      </p>
    </div>
  );
}
