import { Metadata } from 'next';
import { generatePageMetadata } from '@/components/SeoHead';
import {
  OrganizationStructuredData,
  PropertyStructuredData,
  BreadcrumbStructuredData,
} from '@/components/StructuredData';

export const metadata: Metadata = generatePageMetadata('about', {
  title: 'SEO Demo - RealRemax',
  description:
    'This page demonstrates the SEO features implemented in RealRemax, including meta tags, Open Graph, Twitter cards, and structured data.',
  keywords: [
    'SEO',
    'meta tags',
    'structured data',
    'Open Graph',
    'Twitter cards',
    'real estate SEO',
  ],
});

export default function SeoDemoPage() {
  const organizationData = {
    name: 'RealRemax',
    url: 'https://realremax-kvpi.vercel.app',
    logo: 'https://realremax-kvpi.vercel.app/logo.png',
    description: 'Your trusted partner in real estate',
    address: {
      streetAddress: '123 Real Estate Street',
      addressLocality: 'Amsterdam',
      addressRegion: 'North Holland',
      postalCode: '1000 AA',
      addressCountry: 'NL',
    },
    contactPoint: {
      telephone: '+31-20-123-4567',
      contactType: 'customer service',
      email: 'info@realremax.com',
    },
  };

  const propertyData = {
    id: 'demo-property-1',
    title: 'Beautiful 3-Bedroom House in Amsterdam',
    description:
      'Stunning 3-bedroom house with modern amenities, located in the heart of Amsterdam. Perfect for families looking for comfort and style.',
    price: 750000,
    location: 'Amsterdam, Netherlands',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    yearBuilt: 2015,
    images: ['/images/placeholder-property.svg'],
    address: '123 Example Street',
    city: 'Amsterdam',
    country: 'Netherlands',
    listingType: 'sale' as const,
  };

  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://realremax-kvpi.vercel.app' },
      { name: 'SEO Demo', url: 'https://realremax-kvpi.vercel.app/seo-demo' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <OrganizationStructuredData data={organizationData} />
        <PropertyStructuredData data={propertyData} />
        <BreadcrumbStructuredData data={breadcrumbData} />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-dark-charcoal mb-6">
            SEO Features Demo
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-dark-charcoal mb-4">
              Implemented SEO Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Meta Tags
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Title tags with brand name</li>
                  <li>• Meta descriptions</li>
                  <li>• Keywords meta tags</li>
                  <li>• Viewport meta tag</li>
                  <li>• Theme color meta tag</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Open Graph
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• og:title</li>
                  <li>• og:description</li>
                  <li>• og:image</li>
                  <li>• og:url</li>
                  <li>• og:type</li>
                  <li>• og:site_name</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Twitter Cards
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• twitter:card</li>
                  <li>• twitter:title</li>
                  <li>• twitter:description</li>
                  <li>• twitter:image</li>
                  <li>• twitter:creator</li>
                  <li>• twitter:site</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Structured Data
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Organization schema</li>
                  <li>• LocalBusiness schema</li>
                  <li>• WebSite schema</li>
                  <li>• Property schema</li>
                  <li>• BreadcrumbList schema</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-dark-charcoal mb-4">
              SEO Files
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Sitemap
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Automatically generated sitemap.xml with all static pages and
                  priority settings.
                </p>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:underline text-sm"
                >
                  View Sitemap →
                </a>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Robots.txt
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Properly configured robots.txt with sitemap reference and
                  crawl directives.
                </p>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:underline text-sm"
                >
                  View Robots.txt →
                </a>
              </div>

              <div>
                <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                  Web App Manifest
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  PWA manifest file with app icons, theme colors, and display
                  settings.
                </p>
                <a
                  href="/site.webmanifest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-blue hover:underline text-sm"
                >
                  View Manifest →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-dark-charcoal mb-4">
              Demo Property
            </h2>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-dark-charcoal mb-2">
                {propertyData.title}
              </h3>
              <p className="text-gray-600 mb-4">{propertyData.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price:</span> €
                  {propertyData.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Location:</span>{' '}
                  {propertyData.location}
                </div>
                <div>
                  <span className="font-medium">Bedrooms:</span>{' '}
                  {propertyData.bedrooms}
                </div>
                <div>
                  <span className="font-medium">Bathrooms:</span>{' '}
                  {propertyData.bathrooms}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                This property data is used to generate structured data for
                search engines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
