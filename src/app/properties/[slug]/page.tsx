import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getPropertyBySlug,
  getSimilarProperties,
  type PropertyRow,
} from '@/server/db/properties';
import Breadcrumbs from '@/components/property/Breadcrumbs';
import Gallery from '@/components/property/Gallery';
import PriceBar from '@/components/property/PriceBar';
import Facts from '@/components/property/Facts';
import FeaturesList from '@/components/property/FeaturesList';
import MapPlaceholder from '@/components/property/MapPlaceholder';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { filterValidUrls, getFirstValidUrl } from '@/lib/utils';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    };
  }

  // Use property.photos[0] if available, otherwise fallback
  const ogImage = getFirstValidUrl(
    property.photos,
    '/images/placeholder-property.svg'
  );
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property?.currency ?? 'EUR',
    maximumFractionDigits: 0,
  }).format(property.price ?? 0);

  return {
    title: `${property.title} • ${formattedPrice}`,
    description: property.meta_description ?? property.description ?? '',
    openGraph: {
      images: [{ url: ogImage }],
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const amenities = property.amenities ?? [];

  const similar = await getSimilarProperties(property, 6);

  return (
    <div className="container py-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: property.title },
        ]}
      />

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Gallery
            images={filterValidUrls(property.photos || []).map((photo) => ({
              src: photo,
              alt: property.title,
            }))}
          />
        </div>

        <aside className="mt-6 lg:mt-0 lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <PriceBar price={property.price} currency="USD" operation="buy" />
          {/* Facts visible on desktop */}
          <div className="hidden lg:block">
            <Facts
              type={property.type}
              bedrooms={property.bedrooms ?? undefined}
              bathrooms={property.bathrooms ?? undefined}
              netArea={
                (property as PropertyRow & { size?: number }).size ?? undefined
              }
              yearBuilt={
                (property as PropertyRow & { year_built?: number })
                  .year_built ?? undefined
              }
              energyRating={
                (property as PropertyRow & { energy_rating?: string })
                  .energy_rating ?? undefined
              }
            />
            <FeaturesList amenities={amenities} />
          </div>

          {/* Açıklama */}
          {property.description && (
            <div className="prose max-w-none mt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-fg">{property.description}</p>
            </div>
          )}

          {/* Harita placeholder */}
          <div className="mt-8">
            <MapPlaceholder />
          </div>
        </aside>
      </div>

      {/* Benzer ilanlar */}
      {similar?.length ? (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Similar Properties</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((prop) => (
              <Link
                key={prop.id}
                href={{
                  pathname: '/properties/[slug]',
                  params: { slug: prop.slug ?? prop.id },
                }}
                className="group rounded-xl overflow-hidden border"
              >
                <div className="aspect-[16/9] bg-muted relative">
                  <Image
                    src={getFirstValidUrl(prop.photos, '/logo.png')}
                    alt={prop.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="font-medium line-clamp-1">{prop.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {(prop as PropertyRow & { city?: string }).city ||
                      prop.location}
                  </div>
                  <div className="font-medium text-primary">
                    {(
                      prop as PropertyRow & { price?: number }
                    ).price?.toLocaleString?.('pt-PT')}{' '}
                    €
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
