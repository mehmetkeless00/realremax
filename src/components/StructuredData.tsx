import Script from 'next/script';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    telephone: string;
    contactType: string;
    email: string;
  };
}

interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  yearBuilt?: number;
  images?: string[];
  address?: string;
  city?: string;
  country?: string;
  listingType: 'sale' | 'rent';
}

interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function OrganizationStructuredData({
  data,
}: {
  data: OrganizationData;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      email: data.contactPoint.email,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
    },
    serviceType: 'Real Estate Services',
  };

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function PropertyStructuredData({ data }: { data: PropertyData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description,
    image: data.images || [],
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://realremax-kvpi.vercel.app/properties/${data.id}`,
    },
    category: data.type,
    brand: {
      '@type': 'Brand',
      name: 'RealRemax',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Location',
        value: data.location,
      },
      {
        '@type': 'PropertyValue',
        name: 'Listing Type',
        value: data.listingType,
      },
      ...(data.bedrooms
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Bedrooms',
              value: data.bedrooms,
            },
          ]
        : []),
      ...(data.bathrooms
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Bathrooms',
              value: data.bathrooms,
            },
          ]
        : []),
      ...(data.size
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Size',
              value: `${data.size} m²`,
            },
          ]
        : []),
      ...(data.yearBuilt
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Year Built',
              value: data.yearBuilt,
            },
          ]
        : []),
    ],
  };

  return (
    <Script
      id="property-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({ data }: { data: BreadcrumbData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RealRemax',
    url: 'https://realremax-kvpi.vercel.app',
    description:
      'Discover the perfect property for sale or rent. Browse thousands of listings with detailed information, photos, and virtual tours.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://realremax-kvpi.vercel.app/properties?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RealRemax',
      url: 'https://realremax-kvpi.vercel.app',
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function LocalBusinessStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'RealRemax',
    description:
      'Your trusted partner in real estate. We help you find the perfect property with our comprehensive platform.',
    url: 'https://realremax-kvpi.vercel.app',
    telephone: '+31-20-123-4567',
    email: 'info@realremax.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Real Estate Street',
      addressLocality: 'Amsterdam',
      addressRegion: 'North Holland',
      postalCode: '1000 AA',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.3676,
      longitude: 4.9041,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '15:00',
      },
    ],
    priceRange: '€€',
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
    },
  };

  return (
    <Script
      id="local-business-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
