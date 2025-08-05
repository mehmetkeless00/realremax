import { Metadata } from 'next';
import { generatePropertyMetadata } from '@/components/SeoHead';
import PropertyDetailClient from './PropertyDetailClient';

// Dynamic metadata generation for property pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://realremax-kvpi.vercel.app'}/api/properties/${id}`
    );
    if (!response.ok) {
      return {
        title: 'Property Not Found | RealRemax',
        description: 'The property you are looking for could not be found.',
        robots: { index: false, follow: false },
      };
    }

    const property = await response.json();
    return generatePropertyMetadata({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size,
      images: property.photos,
      address: property.location,
      city: property.location.split(',')[0],
      country: 'Netherlands',
    });
  } catch {
    return {
      title: 'Property Details | RealRemax',
      description: 'View detailed information about this property.',
    };
  }
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
