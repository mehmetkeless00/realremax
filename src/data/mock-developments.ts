export type Development = {
  id: string;
  slug: string;
  title: string;
  location: { city: string; district?: string };
  description: string;
  amenities: string[];
  images: { src: string; alt?: string }[];
  units: {
    bedrooms: number;
    areaMin: number;
    areaMax: number;
    priceFrom: number;
    currency: 'EUR';
    status: 'available' | 'reserved' | 'sold';
  }[];
  agent: { name: string; email?: string; phone?: string };
};

export const DEVELOPMENTS: Development[] = [
  {
    id: 'd8468',
    slug: 'correios-129-8468',
    title: 'Correios 129',
    location: { city: 'Lisbon', district: 'Lisboa' },
    description: 'A contemporary development in the heart of Lisbon.',
    amenities: ['Elevator', 'Parking', 'Near transport'],
    images: [
      { src: '/placeholder/dev1.jpg' },
      { src: '/placeholder/dev2.jpg' },
    ],
    units: [
      {
        bedrooms: 1,
        areaMin: 45,
        areaMax: 58,
        priceFrom: 220000,
        currency: 'EUR',
        status: 'available',
      },
      {
        bedrooms: 2,
        areaMin: 70,
        areaMax: 88,
        priceFrom: 320000,
        currency: 'EUR',
        status: 'reserved',
      },
    ],
    agent: { name: 'João Costa', email: 'joao@example.com' },
  },
  {
    id: 'd8469',
    slug: 'green-valley-aveiro-8469',
    title: 'Green Valley',
    location: { city: 'Aveiro', district: 'Aveiro' },
    description: 'Eco-friendly residential development with modern amenities.',
    amenities: [
      'Solar panels',
      'Green spaces',
      'Bike storage',
      'Community garden',
    ],
    images: [
      { src: '/placeholder/dev3.jpg' },
      { src: '/placeholder/dev4.jpg' },
    ],
    units: [
      {
        bedrooms: 1,
        areaMin: 50,
        areaMax: 65,
        priceFrom: 270000,
        currency: 'EUR',
        status: 'available',
      },
      {
        bedrooms: 2,
        areaMin: 75,
        areaMax: 95,
        priceFrom: 380000,
        currency: 'EUR',
        status: 'available',
      },
      {
        bedrooms: 3,
        areaMin: 100,
        areaMax: 120,
        priceFrom: 520000,
        currency: 'EUR',
        status: 'available',
      },
    ],
    agent: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+351 914 000 000',
    },
  },
];

export function getDevelopmentBySlug(slug: string) {
  return DEVELOPMENTS.find((d) => d.slug === slug);
}
