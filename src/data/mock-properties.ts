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
  {
    id: 'p1003',
    slug: 'modern-apartment-rent-lisbon-123751393-130',
    title: 'Modern Apartment for Rent',
    type: 'apartment',
    operation: 'rent',
    price: 1200,
    currency: 'EUR',
    location: { address: 'Chiado', city: 'Lisbon', district: 'Lisboa' },
    bedrooms: 1,
    bathrooms: 1,
    netArea: 65,
    energyRating: 'A',
    description: 'Fully furnished modern apartment in the heart of Chiado.',
    amenities: ['Furnished', 'WiFi', 'Air conditioning', 'Balcony'],
    images: [
      { src: '/placeholder/dev1.jpg', alt: 'Living room' },
      { src: '/placeholder/dev2.jpg', alt: 'Kitchen' },
    ],
    agent: {
      name: 'Maria Costa',
      email: 'maria@example.com',
      phone: '+351 914 000 000',
    },
    tags: ['Furnished', 'City center'],
  },
  {
    id: 'p1004',
    slug: 'studio-apartment-rent-porto-123751394-131',
    title: 'Cozy Studio in Porto',
    type: 'apartment',
    operation: 'rent',
    price: 800,
    currency: 'EUR',
    location: { address: 'Ribeira', city: 'Porto', district: 'Porto' },
    bedrooms: 1,
    bathrooms: 1,
    netArea: 45,
    energyRating: 'B',
    description: 'Charming studio apartment in the historic Ribeira district.',
    amenities: ['River view', 'Kitchen', 'WiFi'],
    images: [
      { src: '/placeholder/dev3.jpg', alt: 'Studio interior' },
      { src: '/placeholder/dev4.jpg', alt: 'River view' },
    ],
    agent: {
      name: 'João Pereira',
      email: 'joao@example.com',
      phone: '+351 915 000 000',
    },
    tags: ['Historic', 'River view'],
  },
  {
    id: 'p1005',
    slug: 'family-house-buy-sintra-123751395-132',
    title: 'Family House in Sintra',
    type: 'house',
    operation: 'buy',
    price: 750000,
    currency: 'EUR',
    location: { address: 'Sintra', city: 'Sintra', district: 'Lisboa' },
    bedrooms: 3,
    bathrooms: 2,
    netArea: 180,
    grossArea: 200,
    yearBuilt: 2015,
    energyRating: 'A-',
    description: 'Perfect family house with garden in peaceful Sintra.',
    amenities: ['Garden', 'Garage', 'Fireplace', 'Storage'],
    images: [
      { src: '/placeholder/prop1.jpg', alt: 'House exterior' },
      { src: '/placeholder/prop2.jpg', alt: 'Garden' },
    ],
    agent: {
      name: 'Sofia Martins',
      email: 'sofia@example.com',
      phone: '+351 916 000 000',
    },
    tags: ['Family', 'Garden'],
  },
  {
    id: 'p1006',
    slug: 'office-space-rent-lisbon-123751396-133',
    title: 'Modern Office Space',
    type: 'office',
    operation: 'rent',
    price: 2500,
    currency: 'EUR',
    location: {
      address: 'Parque das Nações',
      city: 'Lisbon',
      district: 'Lisboa',
    },
    bedrooms: 0,
    bathrooms: 2,
    netArea: 120,
    energyRating: 'A+',
    description: 'Modern office space with meeting rooms and parking.',
    amenities: ['Meeting rooms', 'Parking', 'Security', 'WiFi'],
    images: [
      { src: '/placeholder/prop3.jpg', alt: 'Office space' },
      { src: '/placeholder/col1.jpg', alt: 'Meeting room' },
    ],
    agent: {
      name: 'Pedro Alves',
      email: 'pedro@example.com',
      phone: '+351 917 000 000',
    },
    tags: ['Business', 'Modern'],
  },
  {
    id: 'p1007',
    slug: 'penthouse-luxury-buy-lisbon-123751397-134',
    title: 'Luxury Penthouse',
    type: 'apartment',
    operation: 'buy',
    price: 2800000,
    currency: 'EUR',
    location: { address: 'Avenidas Novas', city: 'Lisbon', district: 'Lisboa' },
    bedrooms: 3,
    bathrooms: 3,
    netArea: 200,
    grossArea: 220,
    yearBuilt: 2023,
    energyRating: 'A+',
    description: 'Exclusive penthouse with panoramic city views.',
    amenities: ['Terrace', 'Pool', 'Gym', 'Concierge', 'Parking'],
    images: [
      { src: '/placeholder/col2.jpg', alt: 'Penthouse living room' },
      { src: '/placeholder/col3.jpg', alt: 'Terrace view' },
    ],
    agent: {
      name: 'Isabel Ferreira',
      email: 'isabel@example.com',
      phone: '+351 918 000 000',
    },
    tags: ['Luxury', 'Penthouse', 'City view'],
  },
  {
    id: 'p1008',
    slug: 'cozy-studio-rent-lisbon-123751398-135',
    title: 'Cozy Studio in Bairro Alto',
    type: 'apartment',
    operation: 'rent',
    price: 950,
    currency: 'EUR',
    location: { address: 'Bairro Alto', city: 'Lisbon', district: 'Lisboa' },
    bedrooms: 1,
    bathrooms: 1,
    netArea: 40,
    energyRating: 'B',
    description:
      'Charming studio in the heart of Bairro Alto nightlife district.',
    amenities: ['Furnished', 'WiFi', 'Balcony', 'Kitchen'],
    images: [
      { src: '/placeholder/dev1.jpg', alt: 'Studio interior' },
      { src: '/placeholder/dev2.jpg', alt: 'Kitchen area' },
    ],
    agent: {
      name: 'Ricardo Oliveira',
      email: 'ricardo@example.com',
      phone: '+351 919 000 000',
    },
    tags: ['Furnished', 'Nightlife', 'City center'],
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
