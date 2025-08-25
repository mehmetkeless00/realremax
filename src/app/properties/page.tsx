import FiltersBar from '@/components/search/FiltersBar';
import { getProperties } from '@/server/data/properties';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Properties',
  description:
    'Browse our extensive collection of properties for sale and rent. Find your perfect home with detailed listings, photos, and agent information.',
  keywords: [
    'properties',
    'real estate',
    'buy property',
    'rent property',
    'homes for sale',
    'apartments for rent',
  ],
  openGraph: {
    title: 'Properties - Remax Unified Platform',
    description:
      'Browse our extensive collection of properties for sale and rent.',
    url: '/properties',
    type: 'website',
  },
  twitter: {
    title: 'Properties - Remax Unified Platform',
    description:
      'Browse our extensive collection of properties for sale and rent.',
  },
  alternates: {
    canonical: '/properties',
  },
};

export default async function PropertiesIndex({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters = {
    mode: ((params.mode as string) || 'buy') as 'rent' | 'buy',
    type: params.type as string | undefined,
    city: params.city as string | undefined,
    district: params.district as string | undefined,
    price_min: params.price_min ? Number(params.price_min) : undefined,
    price_max: params.price_max ? Number(params.price_max) : undefined,
    beds_min: params.beds_min ? Number(params.beds_min) : undefined,
    sort: ((params.sort as string) || 'recent') as
      | 'recent'
      | 'price_asc'
      | 'price_desc',
    page: params.page ? Number(params.page) : 1,
    per: params.per ? Number(params.per) : 12,
    recent_days: params.recent_days ? Number(params.recent_days) : undefined,
  } as const;

  const { items, count } = await getProperties(filters);

  // Add empty state
  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <Suspense fallback={<div>Loading filters...</div>}>
          <FiltersBar initialFilters={filters} />
        </Suspense>
        <div className="mt-12 text-center text-muted-foreground">
          <div className="text-2xl font-semibold mb-2">No listings found</div>
          <p>Try adjusting your filters or come back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <Suspense fallback={<div>Loading filters...</div>}>
        <FiltersBar initialFilters={filters} />
      </Suspense>
      <div className="mt-4 text-sm text-muted-foreground">
        {count?.toLocaleString() ?? items.length} listings
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((it) => (
          <Link
            key={it.id}
            href={`/properties/${it.slug}`}
            className="rounded-2xl bg-white border shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={it.images?.[0]?.src ?? '/logo.png'}
                alt={it.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold">
                {Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: it.currency ?? 'EUR',
                  maximumFractionDigits: 0,
                }).format(it.price)}
              </div>
              <div className="text-sm text-muted-foreground">
                {it.location?.city}
                {it.location?.district ? `, ${it.location.district}` : ''}
              </div>
              <div className="mt-2 text-xs inline-flex items-center gap-3">
                {typeof it.netArea === 'number' && <span>{it.netArea} m²</span>}
                {typeof it.bedrooms === 'number' && (
                  <span>{it.bedrooms} bd</span>
                )}
                {typeof it.bathrooms === 'number' && (
                  <span>{it.bathrooms} ba</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-3">
        {filters.page > 1 && (
          <Link
            href={{
              pathname: '/properties',
              query: { ...filters, page: String(filters.page - 1) },
            }}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Previous
          </Link>
        )}
        {count && filters.page * (filters.per ?? 12) < count && (
          <Link
            href={{
              pathname: '/properties',
              query: { ...filters, page: String(filters.page + 1) },
            }}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
