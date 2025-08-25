import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getPropertyBySlug,
  getSimilarProperties,
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

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    };
  }

  // Use property.photos[0] if available, otherwise fallback
  const ogImage = property.photos?.[0] || '/images/placeholder-property.svg';
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Default to USD since we don't have currency in our schema
    maximumFractionDigits: 0,
  }).format(property.price);

  return {
    title: `${property.title} - ${property.city || property.location}`,
    description: `${property.description} Located in ${property.city || property.location}. ${property.bedrooms ? `${property.bedrooms} bedroom` : ''} ${property.type} for sale at ${formattedPrice}.`,
    keywords: [
      property.type,
      'sale',
      property.city || property.location,
      'real estate',
      'property',
      formattedPrice,
    ].filter((keyword): keyword is string => Boolean(keyword)),
    openGraph: {
      title: `${property.title} - ${property.city || property.location}`,
      description: `${property.description} Located in ${property.city || property.location}.`,
      url: `/properties/${slug}`,
      type: 'website',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: property.title,
            },
          ]
        : undefined,
      siteName: 'Remax Unified Platform',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} - ${property.city || property.location}`,
      description: `${property.description} Located in ${property.city || property.location}.`,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `/properties/${slug}`,
    },
    other: {
      'property:price:amount': property.price.toString(),
      'property:price:currency': 'USD',
      'property:type': property.type,
      'property:operation': 'sale',
      'property:location': property.city || property.location,
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(property);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: property.title },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-fg mb-2">
              {property.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {property.city || property.location}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="text-sm text-muted-foreground hover:text-primary">
              Share
            </button>
            <button className="text-sm text-muted-foreground hover:text-primary">
              Favorite
            </button>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Gallery
            images={(property.photos || []).map((photo) => ({
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
              bedrooms={property.bedrooms || undefined}
              bathrooms={property.bathrooms || undefined}
              netArea={property.size || undefined}
              grossArea={property.size || undefined}
              yearBuilt={property.year_built || undefined}
              energyRating="A"
            />
          </div>
        </aside>
      </div>

      {/* Facts visible under gallery on mobile */}
      <div className="lg:hidden mt-6">
        <Facts
          type={property.type}
          bedrooms={property.bedrooms || undefined}
          bathrooms={property.bathrooms || undefined}
          netArea={property.size || undefined}
          grossArea={property.size || undefined}
          yearBuilt={property.year_built || undefined}
          energyRating="A"
        />
      </div>

      {/* Two columns layout */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-fg mb-4">Description</h3>
            <p className="text-fg leading-relaxed">{property.description}</p>
          </div>
          <FeaturesList amenities={property.amenities || []} />
        </div>

        <div className="md:col-span-1">
          <AgentCard agent={{ name: 'Agent', email: '', phone: '' }} />
        </div>
      </div>

      <MapPlaceholder />

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-fg mb-4">
            Similar Properties
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {similarProperties.map((prop) => (
              <Link
                key={prop.id}
                href={`/properties/${prop.slug}`}
                className="min-w-[280px] rounded-2xl bg-white border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <Image
                    src={prop.photos?.[0] || '/logo.png'}
                    alt={prop.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="font-semibold text-fg mb-1">{prop.title}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {prop.city || prop.location}
                  </div>
                  <div className="font-medium text-primary">
                    {prop.price.toLocaleString('pt-PT')} €
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
