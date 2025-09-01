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
import AgentCard from '@/components/property/AgentCard';
import MapPlaceholder from '@/components/property/MapPlaceholder';
import Link from 'next/link';
import Image from 'next/image';

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

  const ogImage = property.photos?.[0] ?? '/images/placeholder-property.svg';
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

  const images = (property.photos ?? []).map((src: string) => ({
    src,
    alt: property.title,
  }));
  const amenities = property.amenities ?? [];

  const operation: 'buy' | 'rent' =
    (property as PropertyRow & { listing_type?: string }).listing_type ===
    'rent'
      ? 'rent'
      : 'buy';
  const currency =
    (property as PropertyRow & { currency?: string }).currency ?? 'EUR';

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

      {/* Üst kısım: Galeri + Fiyat barı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Galeri */}
          {images.length ? (
            <Gallery images={images} />
          ) : (
            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center">
              <Image
                src="/images/placeholder-property.svg"
                alt="No image"
                width={960}
                height={540}
                className="object-contain"
              />
            </div>
          )}

          {/* Başlık / Konum */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground">
              {property.city ?? property.location ?? ''}
            </p>
          </div>

          {/* Özellikler */}
          <div className="mt-6">
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
        </div>

        {/* Sağ panel */}
        <div className="lg:col-span-1">
          {/* Fiyat barı */}
          <PriceBar
            price={property.price ?? 0}
            currency={currency}
            operation={operation}
          />

          {/* İletişim Kartı */}
          <div className="mt-6">
            <AgentCard
              agent={{
                name: 'Agent',
                email: '',
                phone: '',
              }}
            />
          </div>
        </div>
      </div>

      {/* Benzer ilanlar */}
      {similar?.length ? (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Similar Properties</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((prop) => (
              <Link
                key={prop.id}
                href={`/properties/${prop.slug ?? prop.id}`}
                className="group rounded-xl overflow-hidden border"
              >
                <div className="aspect-[16/9] bg-muted relative">
                  <Image
                    src={
                      Array.isArray(
                        (prop as PropertyRow & { photos?: string[] }).photos
                      ) &&
                      (prop as PropertyRow & { photos?: string[] }).photos?.[0]
                        ? (prop as PropertyRow & { photos?: string[] })
                            .photos![0]
                        : '/images/placeholder-property.svg'
                    }
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
