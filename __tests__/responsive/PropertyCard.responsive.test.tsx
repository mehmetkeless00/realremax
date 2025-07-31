import { render, screen } from '@testing-library/react';
import PropertyCard from '@/components/PropertyCard';
import {
  viewportSizes,
  runResponsiveTest,
} from '@/lib/utils/responsiveTesting';

// Mock data
const mockProperty = {
  id: '1',
  title: 'Beautiful Modern House',
  price: 500000,
  location: 'Amsterdam, Netherlands',
  type: 'house',
  bedrooms: 3,
  bathrooms: 2,
  size: 150,
  status: 'active',
  images: ['/images/placeholder-property.svg'],
  created_at: '2024-01-01T00:00:00Z',
};

describe('PropertyCard Responsive Tests', () => {
  beforeEach(() => {
    // Mock window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  test('PropertyCard renders without crashing', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Beautiful Modern House')).toBeInTheDocument();
  });

  test('PropertyCard has responsive classes', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    expect(card).toHaveClass(
      'hover:shadow-lg',
      'transition-all',
      'duration-300'
    );
  });

  test('PropertyCard image is responsive', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    const image = container.querySelector('img') as HTMLImageElement;

    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('w-full', 'h-48', 'object-cover');
    expect(image).toHaveAttribute('alt', 'Beautiful Modern House');
  });

  test('PropertyCard price is formatted correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  test('PropertyCard location is displayed', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Amsterdam, Netherlands')).toBeInTheDocument();
  });

  test('PropertyCard has proper touch targets', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    const interactiveElements = container.querySelectorAll('button, a');

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });

  test('PropertyCard has no horizontal scroll', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    const card = container.firstChild as HTMLElement;

    expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
  });

  // Grid view tests
  describe('Grid View', () => {
    test('Grid view has proper responsive classes', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="grid" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('overflow-hidden');
    });

    test('Grid view image has correct dimensions', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="grid" />
      );
      const image = container.querySelector('img') as HTMLImageElement;

      expect(image).toHaveClass('w-full', 'h-48');
    });
  });

  // List view tests
  describe('List View', () => {
    test('List view has proper responsive classes', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="list" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('flex', 'flex-col', 'md:flex-row');
    });

    test('List view image has correct dimensions', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="list" />
      );
      const image = container.querySelector('img') as HTMLImageElement;

      expect(image).toHaveClass('md:w-64', 'md:h-48');
    });
  });

  // Responsive breakpoint tests
  describe('Responsive Breakpoints', () => {
    viewportSizes.forEach((viewport) => {
      test(`PropertyCard is responsive at ${viewport.name}`, () => {
        // Set viewport
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height,
        });

        const { container } = render(<PropertyCard property={mockProperty} />);
        const card = container.firstChild as HTMLElement;

        // Trigger resize event
        window.dispatchEvent(new Event('resize'));

        // Check if card is visible and properly sized
        expect(card).toBeInTheDocument();
        expect(card.scrollWidth).toBeLessThanOrEqual(viewport.width);
      });
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('PropertyCard has proper ARIA labels', () => {
      render(<PropertyCard property={mockProperty} />);

      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      expect(favoriteButton).toBeInTheDocument();
    });

    test('PropertyCard images have alt text', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const images = container.querySelectorAll('img');

      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.alt).not.toBe('');
      });
    });

    test('PropertyCard has proper heading structure', () => {
      render(<PropertyCard property={mockProperty} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Beautiful Modern House');
    });
  });

  // Performance tests
  describe('Performance', () => {
    test('PropertyCard renders quickly', () => {
      const startTime = performance.now();
      render(<PropertyCard property={mockProperty} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
    });

    test('PropertyCard has optimized images', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const image = container.querySelector('img') as HTMLImageElement;

      expect(image).toHaveClass('object-cover'); // Optimized image display
    });
  });
});
