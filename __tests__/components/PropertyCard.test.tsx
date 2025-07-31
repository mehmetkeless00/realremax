import { render, screen } from '@testing-library/react';
import PropertyCard from '@/components/PropertyCard';

const mockProperty = {
  id: '1',
  title: 'Test Property',
  description: 'A beautiful test property',
  price: 450000,
  location: 'Amsterdam',
  type: 'apartment',
  bedrooms: 3,
  bathrooms: 2,
  size: 120,
  year_built: 2020,
  status: 'active',
  listing_type: 'sale',
  amenities: ['Balcony', 'Parking'],
  address: 'Test Street 123',
  city: 'Amsterdam',
  postal_code: '1234 AB',
  country: 'Netherlands',
  latitude: 52.3676,
  longitude: 4.9041,
  images: ['/test-image.jpg'],
  created_at: '2024-01-01T00:00:00Z',
  agent_id: 'agent-1',
  listing: {
    id: 'listing-1',
    listing_type: 'sale',
    price: 450000,
    status: 'active',
  },
};

describe('PropertyCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders property card with correct information', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('Test Property')).toBeInTheDocument();
      expect(screen.getByText('$450,000')).toBeInTheDocument();
      expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    });

    test('renders property image with correct alt text', () => {
      render(<PropertyCard property={mockProperty} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test Property');
    });

    test('renders status badge correctly', () => {
      render(<PropertyCard property={mockProperty} />);

      const statusBadge = screen.getByText('active');
      expect(statusBadge).toBeInTheDocument();
    });

    test('renders listing type badge correctly', () => {
      render(<PropertyCard property={mockProperty} />);

      const listingTypeBadge = screen.getByText('For Sale');
      expect(listingTypeBadge).toBeInTheDocument();
    });

    test('renders favorite button when showFavorite is true', () => {
      render(<PropertyCard property={mockProperty} showFavorite={true} />);

      const favoriteButton = screen.getByRole('button');
      expect(favoriteButton).toBeInTheDocument();
    });

    test('does not render favorite button when showFavorite is false', () => {
      render(<PropertyCard property={mockProperty} showFavorite={false} />);

      const favoriteButton = screen.queryByRole('button');
      expect(favoriteButton).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('navigates to property detail page when clicked', () => {
      render(<PropertyCard property={mockProperty} />);

      const propertyLink = screen.getByRole('link');
      expect(propertyLink).toHaveAttribute('href', '/properties/1');
    });
  });

  describe('Edge Cases', () => {
    test('handles missing property image gracefully', () => {
      const propertyWithoutImage = { ...mockProperty, images: [] };
      render(<PropertyCard property={propertyWithoutImage} />);

      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    test('handles missing optional fields', () => {
      const minimalProperty = {
        id: '1',
        title: 'Minimal Property',
        price: 300000,
        location: 'Test City',
        type: 'house',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
      };

      render(<PropertyCard property={minimalProperty} />);

      expect(screen.getByText('Minimal Property')).toBeInTheDocument();
      expect(screen.getByText('$300,000')).toBeInTheDocument();
      expect(screen.getByText('Test City')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('images have alt text', () => {
      render(<PropertyCard property={mockProperty} />);

      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    test('has proper heading structure', () => {
      render(<PropertyCard property={mockProperty} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Property');
    });

    test('favorite button is accessible', () => {
      render(<PropertyCard property={mockProperty} showFavorite={true} />);

      const favoriteButton = screen.getByRole('button');
      expect(favoriteButton).toBeInTheDocument();
    });
  });
});
