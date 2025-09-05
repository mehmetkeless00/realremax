import Client from './Client';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null) as [string, string][]
  ).toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/listings${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, { cache: 'no-store' });
  let initial = { items: [], total: 0, page: 1, pageSize: 24 };
  try {
    if (res.ok) initial = await res.json();
  } catch {}
  return <Client initial={initial} />;
}
