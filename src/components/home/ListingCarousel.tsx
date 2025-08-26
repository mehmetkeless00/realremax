import Link from 'next/link';
import Image from 'next/image';
import { getFirstValidUrl } from '@/lib/utils';

// Real property data structure from Supabase
type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  city?: string;
  country?: string;
  photos?: string[];
  og_image_url?: string;
  slug?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  published_at?: string;
  created_at: string;
};

type Props = {
  title: string;
  seeAllHref: string;
  items?: Property[];
  limit?: number;
};

function formatPrice(price?: number | null): string {
  if (price == null) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price} €`;
  }
}

export default function ListingCarousel({
  title,
  seeAllHref,
  items = [],
  limit,
}: Props) {
  const list = typeof limit === 'number' ? items.slice(0, limit) : items;

  if (!list.length) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-fg">{title}</h2>
          <Link href={seeAllHref} className="text-sm hover:text-primary">
            See all →
          </Link>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>No properties available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-fg">{title}</h2>
        <Link href={seeAllHref} className="text-sm hover:text-primary">
          See all →
        </Link>
      </div>

      {/* Mobile: horizontal scroll; Desktop: grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6
                      lg:[&>*]:snap-none
                      overflow-x-auto snap-x lg:overflow-visible"
      >
        {list.map((property) => {
          // Image fallback: photos(array) -> og_image_url -> placeholder
          const imageUrl = getFirstValidUrl(
            property.photos,
            property.og_image_url || '/images/placeholder-property.svg'
          );

          const href = `/properties/${property.slug ?? property.id}`;
          const price = formatPrice(property.price);
          const location =
            property.location ||
            [property.city, property.country].filter(Boolean).join(', ') ||
            '—';

          return (
            <Link
              key={property.id}
              href={href}
              className="min-w-[260px] lg:min-w-0 snap-start rounded-2xl bg-white border shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-video">
                <Image
                  src={imageUrl}
                  alt={property.title || 'Property'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="font-semibold">{price}</div>
                <div className="text-sm text-muted">{location}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {property.bedrooms != null && (
                    <span>{property.bedrooms} bd</span>
                  )}
                  {property.bathrooms != null && (
                    <span>{property.bathrooms} ba</span>
                  )}
                  {property.size != null && <span>{property.size} m²</span>}
                  {property.type && (
                    <span className="ml-auto capitalize">{property.type}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
