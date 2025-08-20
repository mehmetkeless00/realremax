export type Property = {
  id: string;
  slug: string; // e.g. "t2-estrela-lisbon-123751391-128"
  title: string;
  type: 'apartment' | 'house' | 'land' | 'store' | 'office';
  operation: 'buy' | 'rent';
  price: number;
  currency: 'EUR';
  location: {
    address: string;
    parish?: string;
    city: string;
    district?: string;
    lat?: number;
    lng?: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  netArea?: number;
  grossArea?: number;
  yearBuilt?: number;
  energyRating?: string; // e.g. "B-"
  description: string; // can be HTML/MD in future
  amenities: string[];
  images: { src: string; alt?: string }[];
  agent: { name: string; phone?: string; email?: string; photo?: string };
  tags?: string[];
};

export const PROPERTIES: Property[] = [
  {
    id: 'p1001',
    slug: 't2-estrela-lisbon-123751391-128',
    title: 'T2 Apartment in Estrela',
    type: 'apartment',
    operation: 'buy',
    price: 540000,
    currency: 'EUR',
    location: { address: 'Estrela', city: 'Lisbon', district: 'Lisboa' },
    bedrooms: 2,
    bathrooms: 2,
    netArea: 92,
    energyRating: 'B-',
    description: 'Bright T2 in Estrela with balcony and garage.',
    amenities: ['Balcony', 'Elevator', 'Garage', 'Air conditioning'],
    images: [
      { src: '/placeholder/prop1.jpg', alt: 'Living room' },
      { src: '/placeholder/prop2.jpg' },
      { src: '/placeholder/prop3.jpg' },
    ],
    agent: {
      name: 'Ana Silva',
      email: 'ana@example.com',
      phone: '+351 912 000 000',
    },
    tags: ['New'],
  },
  {
    id: 'p1002',
    slug: 'luxury-villa-cascais-123751392-129',
    title: 'Luxury Villa in Cascais',
    type: 'house',
    operation: 'buy',
    price: 1950000,
    currency: 'EUR',
    location: { address: 'Cascais', city: 'Cascais', district: 'Lisboa' },
    bedrooms: 4,
    bathrooms: 3,
    netArea: 280,
    grossArea: 320,
    yearBuilt: 2020,
    energyRating: 'A+',
    description: 'Modern luxury villa with sea view and private pool.',
    amenities: [
      'Pool',
      'Garden',
      'Garage',
      'Sea view',
      'Air conditioning',
      'Security system',
    ],
    images: [
      { src: '/placeholder/col1.jpg', alt: 'Villa exterior' },
      { src: '/placeholder/col2.jpg', alt: 'Living area' },
      { src: '/placeholder/col3.jpg', alt: 'Pool area' },
    ],
    agent: {
      name: 'Carlos Santos',
      email: 'carlos@example.com',
      phone: '+351 913 000 000',
    },
    tags: ['Luxury', 'Sea view'],
  },
];

export function getPropertyBySlug(slug: string) {
  return PROPERTIES.find((p) => p.slug === slug);
}

export function getSimilarProperties(p: Property) {
  return PROPERTIES.filter(
    (x) => x.id !== p.id && x.location.city === p.location.city
  ).slice(0, 4);
}
