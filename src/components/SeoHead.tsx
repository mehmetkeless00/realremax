import { Metadata } from 'next';

export interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SeoHeadProps): Metadata {
  const siteName = 'RealRemax';
  const fullTitle = `${title} | ${siteName}`;
  const defaultImage = '/images/placeholder-property.svg';
  const defaultUrl = 'https://realremax-kvpi.vercel.app';

  return {
    metadataBase: new URL('https://realremax-kvpi.vercel.app'),
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: url || defaultUrl,
      siteName,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image || defaultImage],
      creator: '@realremax',
      site: '@realremax',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    alternates: {
      canonical: url || defaultUrl,
    },
  };
}

// Utility function to generate property-specific metadata
export function generatePropertyMetadata(property: {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
  address?: string;
  city?: string;
  country?: string;
}) {
  const description =
    property.description ||
    `${property.type} for ${property.type === 'rent' ? 'rent' : 'sale'} in ${property.location}. ${property.bedrooms ? `${property.bedrooms} bedrooms` : ''} ${property.bathrooms ? `${property.bathrooms} bathrooms` : ''} ${property.size ? `${property.size} sq ft` : ''}. Price: €${property.price.toLocaleString()}`;

  const keywords = [
    'real estate',
    property.type,
    property.location,
    property.city || '',
    property.country || '',
    'property',
    'house',
    'apartment',
    'for sale',
    'for rent',
    ...(property.bedrooms ? [`${property.bedrooms} bedroom`] : []),
    ...(property.bathrooms ? [`${property.bathrooms} bathroom`] : []),
  ].filter(Boolean);

  return generateMetadata({
    title: property.title,
    description,
    image: property.images?.[0] || '/images/placeholder-property.svg',
    url: `https://realremax-kvpi.vercel.app/properties/${property.id}`,
    type: 'article',
    keywords,
    section: 'Properties',
    tags: [property.type, property.location, 'real estate'],
  });
}

// Utility function to generate page-specific metadata
export function generatePageMetadata(
  page: string,
  customData?: Partial<SeoHeadProps>
) {
  const pageMetadata: Record<string, SeoHeadProps> = {
    home: {
      title: 'Find Your Dream Property',
      description:
        'Discover the perfect property for sale or rent. Browse thousands of listings with detailed information, photos, and virtual tours.',
      keywords: [
        'real estate',
        'property search',
        'houses for sale',
        'apartments for rent',
        'real estate listings',
      ],
    },
    properties: {
      title: 'Property Listings',
      description:
        'Browse our comprehensive collection of properties for sale and rent. Find your perfect home with our advanced search and filtering options.',
      keywords: [
        'property listings',
        'real estate search',
        'houses',
        'apartments',
        'for sale',
        'for rent',
      ],
    },
    agents: {
      title: 'Real Estate Agents',
      description:
        'Connect with experienced real estate agents in your area. Get professional guidance for buying, selling, or renting properties.',
      keywords: [
        'real estate agents',
        'property agents',
        'real estate professionals',
        'buying agent',
        'selling agent',
      ],
    },
    contact: {
      title: 'Contact Us',
      description:
        "Get in touch with our real estate team. We're here to help you find your perfect property or answer any questions.",
      keywords: [
        'contact',
        'real estate contact',
        'property inquiry',
        'get in touch',
      ],
    },
    about: {
      title: 'About RealRemax',
      description:
        'Learn about RealRemax, your trusted partner in real estate. We help you find the perfect property with our comprehensive platform.',
      keywords: [
        'about us',
        'real estate company',
        'property platform',
        'RealRemax',
      ],
    },
    signin: {
      title: 'Sign In',
      description:
        'Sign in to your RealRemax account to access your saved properties, manage listings, and more.',
      keywords: ['sign in', 'login', 'account', 'user login'],
    },
    signup: {
      title: 'Sign Up',
      description:
        'Create your RealRemax account to save properties, get notifications, and access exclusive features.',
      keywords: ['sign up', 'register', 'create account', 'new user'],
    },
    dashboard: {
      title: 'Dashboard',
      description:
        'Manage your real estate activities. View saved properties, manage listings, and track your inquiries.',
      keywords: ['dashboard', 'account', 'my properties', 'saved properties'],
    },
    profile: {
      title: 'Profile',
      description:
        'Update your profile information and preferences. Manage your account settings and personal details.',
      keywords: [
        'profile',
        'account settings',
        'user profile',
        'personal information',
      ],
    },
    favorites: {
      title: 'Favorite Properties',
      description:
        "View and manage your saved properties. Keep track of properties you're interested in.",
      keywords: [
        'favorites',
        'saved properties',
        'wishlist',
        'property favorites',
      ],
    },
  };

  const baseMetadata = pageMetadata[page] || {
    title: 'RealRemax',
    description: 'Your trusted partner in real estate',
  };

  return generateMetadata({
    ...baseMetadata,
    ...customData,
  });
}
