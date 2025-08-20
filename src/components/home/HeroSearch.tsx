'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Mode = 'buy' | 'rent';

export default function HeroSearch() {
  const [mode, setMode] = useState<Mode>('buy');
  const [q, setQ] = useState('');
  const router = useRouter();

  const onSearch = () => {
    const qp = new URLSearchParams();
    qp.set('mode', mode);
    if (q.trim()) qp.set('q', q.trim());
    router.push(`/properties?${qp.toString()}`);
  };

  const baseTab =
    'px-5 py-2 text-sm md:text-base rounded-full border transition-colors font-medium outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-600/60';
  const activeTab = 'bg-blue-600 text-white border-blue-600';
  const inactiveTab =
    'bg-white text-fg hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700';

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-fg">
        Find Your Dream Home
      </h1>
      <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
        Search thousands of listings and connect with trusted agents.
      </p>

      {/* Tabs */}
      <div
        className="mt-8 flex justify-center"
        role="tablist"
        aria-label="Search mode"
      >
        <div className="inline-flex items-center gap-2">
          {(['buy', 'rent'] as Mode[]).map((t) => {
            const selected = mode === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={selected}
                onClick={() => setMode(t)}
                className={`${baseTab} ${selected ? activeTab : inactiveTab}`}
              >
                {t === 'buy' ? 'Buy' : 'Rent'}
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
          placeholder="City, neighborhood, keyword…"
          className="w-full sm:w-96 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search by location or keyword"
        />
        <Button size="lg" onClick={onSearch} aria-label="Search">
          Search
        </Button>
      </div>

      {/* Primary CTAs */}
      <div className="mt-6 flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/properties">Browse Properties</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/agents">Find Agents</Link>
        </Button>
      </div>
    </div>
  );
}
