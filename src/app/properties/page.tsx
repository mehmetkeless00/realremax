import { Metadata } from 'next';
import PropertiesClient from './PropertiesClient';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Property Listings | RealRemax',
  description:
    'Browse our comprehensive collection of properties for sale and rent. Find your perfect home with our advanced search and filtering options.',
  keywords: [
    'property listings',
    'real estate search',
    'houses',
    'apartments',
    'for sale',
    'for rent',
    'Amsterdam properties',
    'Netherlands real estate',
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function PropertiesPage() {
  return <PropertiesClient />;
}
