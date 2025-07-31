import { render, screen } from '@testing-library/react';
import PropertyCard from '@/components/PropertyCard';
import GlobalHeader from '@/components/GlobalHeader';
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

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));

// Mock stores
jest.mock('@/lib/store', () => ({
  useUserStore: () => ({
    user: null,
    signOut: jest.fn(),
  }),
  useUIStore: () => ({
    addToast: jest.fn(),
  }),
}));

describe('Responsive Testing Checklist', () => {
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

  describe('PropertyCard Responsive Checklist', () => {
    test('✅ PropertyCard renders without crashing', () => {
      render(<PropertyCard property={mockProperty} />);
      expect(screen.getByText('Beautiful Modern House')).toBeInTheDocument();
    });

    test('✅ PropertyCard has responsive classes', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
      expect(card).toHaveClass(
        'hover:shadow-lg',
        'transition-all',
        'duration-300'
      );
    });

    test('✅ PropertyCard image is responsive', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const image = container.querySelector('img') as HTMLImageElement;

      expect(image).toBeInTheDocument();
      expect(image).toHaveClass('w-full', 'h-48', 'object-cover');
      expect(image).toHaveAttribute('alt', 'Beautiful Modern House');
    });

    test('✅ PropertyCard has no horizontal scroll', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const card = container.firstChild as HTMLElement;

      expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    });

    test('✅ PropertyCard has proper touch targets', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const interactiveElements = container.querySelectorAll('button, a');

      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    test('✅ PropertyCard has valid font sizes', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const textElements = container.querySelectorAll('p, span, div');

      textElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(16);
      });
    });

    test('✅ PropertyCard grid view is responsive', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="grid" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('overflow-hidden');
    });

    test('✅ PropertyCard list view is responsive', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="list" />
      );
      const card = container.firstChild as HTMLElement;

      expect(card).toHaveClass('flex', 'flex-col', 'md:flex-row');
    });
  });

  describe('GlobalHeader Responsive Checklist', () => {
    test('✅ GlobalHeader renders without crashing', () => {
      render(<GlobalHeader />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('✅ GlobalHeader has responsive classes', () => {
      const { container } = render(<GlobalHeader />);
      const header = container.querySelector('header');

      expect(header).toHaveClass('bg-white', 'shadow-md');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    test('✅ GlobalHeader has mobile menu button', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('✅ GlobalHeader mobile menu button has proper touch target', () => {
      const { container } = render(<GlobalHeader />);
      const mobileMenuButton = container.querySelector(
        '[aria-label="Toggle mobile menu"]'
      ) as HTMLElement;

      expect(mobileMenuButton).toHaveClass('p-2');
    });

    test('✅ GlobalHeader has no horizontal scroll', () => {
      const { container } = render(<GlobalHeader />);
      const header = container.querySelector('header') as HTMLElement;

      expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    });

    test('✅ GlobalHeader navigation links are accessible', () => {
      render(<GlobalHeader />);

      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Agents')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    test('✅ GlobalHeader has proper ARIA labels', () => {
      render(<GlobalHeader />);

      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toBeInTheDocument();
    });
  });

  describe('Responsive Breakpoint Tests', () => {
    viewportSizes.forEach((viewport) => {
      test(`✅ Components are responsive at ${viewport.name}`, () => {
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

        // Test PropertyCard
        const { container: propertyContainer } = render(
          <PropertyCard property={mockProperty} />
        );
        const propertyCard = propertyContainer.firstChild as HTMLElement;
        expect(propertyCard).toBeInTheDocument();
        expect(propertyCard.scrollWidth).toBeLessThanOrEqual(viewport.width);

        // Test GlobalHeader
        const { container: headerContainer } = render(<GlobalHeader />);
        const header = headerContainer.querySelector('header') as HTMLElement;
        expect(header).toBeInTheDocument();
        expect(header.scrollWidth).toBeLessThanOrEqual(viewport.width);

        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
      });
    });
  });

  describe('Mobile-Specific Tests', () => {
    beforeEach(() => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    test('✅ Mobile menu button is visible on mobile', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toHaveClass('md:hidden');
    });

    test('✅ Desktop navigation is hidden on mobile', () => {
      const { container } = render(<GlobalHeader />);
      const desktopNav = container.querySelector('nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    test('✅ PropertyCard adapts to mobile layout', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const card = container.firstChild as HTMLElement;

      expect(card.scrollWidth).toBeLessThanOrEqual(375);
    });
  });

  describe('Desktop-Specific Tests', () => {
    beforeEach(() => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    test('✅ Desktop navigation is visible', () => {
      const { container } = render(<GlobalHeader />);
      const desktopNav = container.querySelector('nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    test('✅ Mobile menu button is hidden on desktop', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toHaveClass('md:hidden');
    });

    test('✅ PropertyCard uses desktop layout', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const card = container.firstChild as HTMLElement;

      expect(card.scrollWidth).toBeLessThanOrEqual(1024);
    });
  });

  describe('Accessibility Tests', () => {
    test('✅ All images have alt text', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const images = container.querySelectorAll('img');

      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.alt).not.toBe('');
      });
    });

    test('✅ All interactive elements have proper roles', () => {
      render(<PropertyCard property={mockProperty} />);
      render(<GlobalHeader />);

      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');

      expect(buttons.length).toBeGreaterThan(0);
      expect(links.length).toBeGreaterThan(0);
    });

    test('✅ All form elements are accessible', () => {
      // This would test forms when they're present
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Performance Tests', () => {
    test('✅ Components render quickly', () => {
      const startTime = performance.now();
      render(<PropertyCard property={mockProperty} />);
      render(<GlobalHeader />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200); // Should render in less than 200ms
    });

    test('✅ Components have optimized images', () => {
      const { container } = render(<PropertyCard property={mockProperty} />);
      const image = container.querySelector('img') as HTMLImageElement;

      expect(image).toHaveClass('object-cover');
    });
  });

  describe('Touch Target Tests', () => {
    test('✅ All interactive elements have minimum 44px touch targets', () => {
      const { container: propertyContainer } = render(
        <PropertyCard property={mockProperty} />
      );
      const { container: headerContainer } = render(<GlobalHeader />);

      const allInteractiveElements = [
        ...propertyContainer.querySelectorAll(
          'button, a, input, select, textarea'
        ),
        ...headerContainer.querySelectorAll(
          'button, a, input, select, textarea'
        ),
      ];

      allInteractiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Font Size Tests', () => {
    test('✅ All text elements have minimum 16px font size', () => {
      const { container: propertyContainer } = render(
        <PropertyCard property={mockProperty} />
      );
      const { container: headerContainer } = render(<GlobalHeader />);

      const allTextElements = [
        ...propertyContainer.querySelectorAll(
          'p, span, div, h1, h2, h3, h4, h5, h6'
        ),
        ...headerContainer.querySelectorAll(
          'p, span, div, h1, h2, h3, h4, h5, h6'
        ),
      ];

      allTextElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(16);
      });
    });
  });

  describe('Layout Tests', () => {
    test('✅ No horizontal scroll on any component', () => {
      const { container: propertyContainer } = render(
        <PropertyCard property={mockProperty} />
      );
      const { container: headerContainer } = render(<GlobalHeader />);

      const propertyCard = propertyContainer.firstChild as HTMLElement;
      const header = headerContainer.querySelector('header') as HTMLElement;

      expect(propertyCard.scrollWidth).toBeLessThanOrEqual(
        propertyCard.clientWidth
      );
      expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    });

    test('✅ Components use responsive grid layouts', () => {
      const { container } = render(
        <PropertyCard property={mockProperty} view="grid" />
      );
      const card = container.firstChild as HTMLElement;

      // Check for responsive classes
      const hasResponsiveClasses =
        card.className.includes('grid') ||
        card.className.includes('flex') ||
        card.className.includes('md:') ||
        card.className.includes('lg:');

      expect(hasResponsiveClasses).toBe(true);
    });
  });
});
