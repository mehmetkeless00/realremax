import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { searchProperties } from '@/repositories/propertyRepo';
import FiltersBar from '@/components/search/FiltersBar';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getFirstValidUrl } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface SearchParams {
  mode?: string;
  type?: string;
  city?: string;
  district?: string;
  price_min?: string;
  price_max?: string;
  beds_min?: string;
  sort?: string;
  page?: string;
  per?: string;
  recent_days?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const t = await getTranslations('properties');
  const params = await searchParams;

  // Validate and parse search parameters
  if (params.mode && !['rent', 'buy'].includes(params.mode)) {
    notFound();
  }

  if (
    params.sort &&
    !['recent', 'price_asc', 'price_desc'].includes(params.sort)
  ) {
    notFound();
  }

  const filters = {
    type: params.type,
    minPrice: params.price_min ? Number(params.price_min) : undefined,
    maxPrice: params.price_max ? Number(params.price_max) : undefined,
    bedrooms: params.beds_min ? Number(params.beds_min) : undefined,
    location: params.city || params.district,
  } as const;

  const properties = await searchProperties(filters);

  // Add empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <Suspense fallback={<div>{t('loadingFilters')}</div>}>
          <FiltersBar initialFilters={filters} />
        </Suspense>
        <div className="mt-12 text-center text-muted-foreground">
          <div className="text-2xl font-semibold mb-2">{t('emptyTitle')}</div>
          <p>{t('emptySubtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <Suspense fallback={<div>{t('loadingFilters')}</div>}>
        <FiltersBar initialFilters={filters} />
      </Suspense>
      <div className="mt-4 text-sm text-muted-foreground">
        {properties.length} listings
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={{
              pathname: '/properties/[id]',
              params: { id: property.slug || property.id.toString() },
            }}
            className="rounded-2xl bg-white border shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={getFirstValidUrl(property.photos, '/logo.png')}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="text-lg font-semibold">
                {Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(property.price)}
              </div>
              <div className="text-sm text-muted-foreground">
                {property.city || property.location}
              </div>
              <div className="mt-2 text-xs inline-flex items-center gap-3">
                {typeof property.size === 'number' && (
                  <span>{property.size} m²</span>
                )}
                {typeof property.bedrooms === 'number' && (
                  <span>{property.bedrooms} bd</span>
                )}
                {typeof property.bathrooms === 'number' && (
                  <span>{property.bathrooms} ba</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
