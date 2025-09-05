// src/app/buy/listings/residential/page.tsx
import Client from './Client';

export const dynamic = 'force-dynamic'; // or revalidate if you cache

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  // Initial SSR fetch to hydrate
  const params = await searchParams;
  const qs = new URLSearchParams(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(params).filter(([, v]) => v != null) as any
  ).toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/listings${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  const initial = await res.json();

  return <Client initial={initial} />;
}

// Basic SEO can be added here via generateMetadata if needed later.
