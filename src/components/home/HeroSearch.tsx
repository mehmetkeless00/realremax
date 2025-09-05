'use client';
import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type Mode = 'buy' | 'rent';

export default function HeroSearch() {
  const t = useTranslations('home');
  const [mode, setMode] = useState<Mode>('buy');
  const [q, setQ] = useState('');
  const router = useRouter();

  const onSearch = () => {
    const query: Record<string, string> = { mode };
    if (q.trim()) query.q = q.trim();
    router.push({ pathname: '/properties', query });
  };

  const baseTab =
    'px-5 py-2 text-sm md:text-base rounded-full border transition-colors font-medium outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-600/60';
  const activeTab = 'bg-blue-600 text-white border-blue-600';
  const inactiveTab =
    'bg-white text-fg hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700';

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-fg">
        {t('headline')}
      </h1>
      <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('subheadline')}
      </p>

      {/* Tabs */}
      <div
        className="mt-8 flex justify-center"
        role="tablist"
        aria-label="Search mode"
      >
        <div className="inline-flex items-center gap-2">
          {(['buy', 'rent'] as Mode[]).map((tab) => {
            const selected = mode === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={selected}
                onClick={() => setMode(tab)}
                className={`${baseTab} ${selected ? activeTab : inactiveTab}`}
              >
                {tab === 'buy' ? t('buy') : t('rent')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input + CTA */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder={t('searchPlaceholder')}
          className="w-full sm:w-96 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          aria-label={t('search')}
        />
        <Button size="lg" onClick={onSearch} aria-label={t('search')}>
          {t('search')}
        </Button>
      </div>

      {/* Primary CTAs */}
      <div className="mt-6 flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/properties">{t('browseProperties')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/agents">{t('findAgents')}</Link>
        </Button>
      </div>
    </div>
  );
}
