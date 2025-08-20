export const listingsCardProps = {
  recent: [
    {
      id: '1001',
      title: 'Modern Apartment',
      price: '€350,000',
      location: 'Lisbon',
      img: '/logo.png',
      tag: 'New',
    },
    {
      id: '1002',
      title: 'Family House',
      price: '€540,000',
      location: 'Oporto',
      img: '/logo.png',
    },
    {
      id: '1003',
      title: 'Cozy Studio',
      price: '€190,000',
      location: 'Coimbra',
      img: '/logo.png',
    },
    {
      id: '1004',
      title: 'Sea View',
      price: '€720,000',
      location: 'Faro',
      img: '/logo.png',
      tag: 'Hot',
    },
  ],
  collection: [
    {
      id: '2001',
      title: 'Luxury Villa',
      price: '€1,950,000',
      location: 'Cascais',
      img: '/logo.png',
    },
    {
      id: '2002',
      title: 'Penthouse',
      price: '€1,250,000',
      location: 'Lisbon',
      img: '/logo.png',
    },
    {
      id: '2003',
      title: 'Boutique House',
      price: '€1,100,000',
      location: 'Oeiras',
      img: '/logo.png',
    },
    {
      id: '2004',
      title: 'Manor',
      price: '€2,400,000',
      location: 'Sintra',
      img: '/logo.png',
    },
  ],
  // currently unused - kept for potential future use
  developments: [
    {
      id: '3001',
      title: 'New Block A',
      price: 'From €220,000',
      location: 'Braga',
      img: '/logo.png',
    },
    {
      id: '3002',
      title: 'Riverside Homes',
      price: 'From €310,000',
      location: 'Porto',
      img: '/logo.png',
    },
    {
      id: '3003',
      title: 'Green Valley',
      price: 'From €270,000',
      location: 'Aveiro',
      img: '/logo.png',
    },
    {
      id: '3004',
      title: 'Skyline',
      price: 'From €390,000',
      location: 'Lisbon',
      img: '/logo.png',
    },
  ],
} as const;

// add this export below listingsCardProps
export const moreRecent: ListingItem[] = [
  ...listingsCardProps.recent,
].reverse();

export const regions = [
  'Lisbon',
  'Oporto',
  'Coimbra',
  'Braga',
  'Faro',
  'Leiria',
  'Setúbal',
  'Aveiro',
] as const;

export const quickTags = [
  'Condo/Apartment',
  'House',
  'Land',
  'Store',
  'Office',
  'Warehouse',
] as const;

export type ListingItem = {
  id: string;
  title: string;
  price: string;
  location: string;
  img: string;
  tag?: string;
};
