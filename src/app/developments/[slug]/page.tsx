import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDevelopmentBySlug } from '@/data/mock-developments';
import { formatPrice, formatAreaRange } from '@/lib/format';
import Breadcrumbs from '@/components/property/Breadcrumbs';
import Gallery from '@/components/property/Gallery';
import FeaturesList from '@/components/property/FeaturesList';
import AgentCard from '@/components/property/AgentCard';
import MapPlaceholder from '@/components/property/MapPlaceholder';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const development = getDevelopmentBySlug(slug);

  if (!development) {
    return { title: 'Development Not Found' };
  }

  const ogImage = development.images[0]?.src;

  return {
    title: development.title,
    description: development.description,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function DevelopmentPage({ params }: Props) {
  const { slug } = await params;
  const development = getDevelopmentBySlug(slug);

  if (!development) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Developments', href: '/developments' },
    { label: development.title },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-fg mb-2">
          {development.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {development.location.city}
          {development.location.district &&
            `, ${development.location.district}`}
        </p>
      </div>

      <Gallery images={development.images} />

      {/* Description and Amenities */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-fg mb-4">Description</h3>
            <p className="text-fg leading-relaxed">{development.description}</p>
          </div>
          <FeaturesList amenities={development.amenities} />
        </div>

        <div className="md:col-span-1">
          <AgentCard agent={development.agent} />
        </div>
      </div>

      {/* Units Table */}
      <div className="rounded-2xl bg-white border shadow-sm p-6 mb-8">
        <h3 className="text-xl font-semibold text-fg mb-4">Available Units</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-fg">
                  Bedrooms
                </th>
                <th className="text-left py-3 px-4 font-medium text-fg">
                  Area
                </th>
                <th className="text-left py-3 px-4 font-medium text-fg">
                  Price From
                </th>
                <th className="text-left py-3 px-4 font-medium text-fg">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {development.units.map((unit, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-fg">{unit.bedrooms}</td>
                  <td className="py-3 px-4 text-fg">
                    {formatAreaRange(unit.areaMin, unit.areaMax)}
                  </td>
                  <td className="py-3 px-4 text-fg font-medium">
                    {formatPrice(unit.priceFrom, unit.currency)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        unit.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : unit.status === 'reserved'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {unit.status.charAt(0).toUpperCase() +
                        unit.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MapPlaceholder />
    </div>
  );
}
