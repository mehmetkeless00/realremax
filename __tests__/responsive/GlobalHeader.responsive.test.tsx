import { render, screen, fireEvent } from '@testing-library/react';
import GlobalHeader from '@/components/GlobalHeader';
import { viewportSizes } from '@/lib/utils/responsiveTesting';

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

describe('GlobalHeader Responsive Tests', () => {
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

  test('GlobalHeader renders without crashing', () => {
    render(<GlobalHeader />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('GlobalHeader has responsive classes', () => {
    const { container } = render(<GlobalHeader />);
    const header = container.querySelector('header');

    expect(header).toHaveClass('bg-white', 'shadow-md');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });

  test('Logo is displayed', () => {
    render(<GlobalHeader />);
    const logo = screen.getByAltText(/remax/i);
    expect(logo).toBeInTheDocument();
  });

  test('Navigation links are present', () => {
    render(<GlobalHeader />);

    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('Mobile menu button is present', () => {
    render(<GlobalHeader />);
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('Mobile menu button has proper touch target', () => {
    const { container } = render(<GlobalHeader />);
    const mobileMenuButton = container.querySelector(
      '[aria-label="Toggle mobile menu"]'
    ) as HTMLElement;

    expect(mobileMenuButton).toHaveClass('p-2'); // Should have padding for touch target
  });

  test('Mobile menu toggles correctly', () => {
    render(<GlobalHeader />);
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');

    // Initially mobile menu should be hidden
    expect(screen.queryByText('Free Valuation')).not.toBeInTheDocument();

    // Click mobile menu button
    fireEvent.click(mobileMenuButton);

    // Mobile menu should be visible
    expect(screen.getByText('Free Valuation')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(mobileMenuButton);

    // Mobile menu should be hidden again
    expect(screen.queryByText('Free Valuation')).not.toBeInTheDocument();
  });

  test('Mobile menu has proper responsive classes', () => {
    render(<GlobalHeader />);
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileMenuButton);

    const mobileMenu = screen.getByText('Free Valuation').closest('div');
    expect(mobileMenu).toHaveClass('md:hidden');
  });

  test('Desktop navigation is hidden on mobile', () => {
    const { container } = render(<GlobalHeader />);
    const desktopNav = container.querySelector('nav');

    // Desktop nav should have hidden class on mobile
    expect(desktopNav).toHaveClass('hidden', 'md:flex');
  });

  test('Free Valuation button is present', () => {
    render(<GlobalHeader />);
    const freeValuationButton = screen.getByText('Free Valuation');
    expect(freeValuationButton).toBeInTheDocument();
  });

  test('Free Valuation button has proper styling', () => {
    render(<GlobalHeader />);
    const freeValuationButton = screen.getByText('Free Valuation');

    expect(freeValuationButton).toHaveClass('bg-primary-red', 'text-white');
    expect(freeValuationButton).toHaveClass(
      'hover:bg-red-700',
      'transition-colors'
    );
  });

  // Responsive breakpoint tests
  describe('Responsive Breakpoints', () => {
    viewportSizes.forEach((viewport) => {
      test(`GlobalHeader is responsive at ${viewport.name}`, () => {
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

        const { container } = render(<GlobalHeader />);
        const header = container.querySelector('header');

        // Trigger resize event
        window.dispatchEvent(new Event('resize'));

        // Check if header is visible and properly sized
        expect(header).toBeInTheDocument();
        expect(header?.scrollWidth).toBeLessThanOrEqual(viewport.width);
      });
    });
  });

  // Mobile-specific tests
  describe('Mobile Behavior', () => {
    beforeEach(() => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    test('Mobile menu button is visible on mobile', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toHaveClass('md:hidden');
    });

    test('Desktop navigation is hidden on mobile', () => {
      const { container } = render(<GlobalHeader />);
      const desktopNav = container.querySelector('nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    test('Mobile menu has proper spacing', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileMenuButton);

      const mobileMenu = screen.getByText('Free Valuation').closest('div');
      expect(mobileMenu).toHaveClass('mt-4', 'pb-4');
    });
  });

  // Desktop-specific tests
  describe('Desktop Behavior', () => {
    beforeEach(() => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    test('Desktop navigation is visible', () => {
      const { container } = render(<GlobalHeader />);
      const desktopNav = container.querySelector('nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    test('Mobile menu button is hidden on desktop', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toHaveClass('md:hidden');
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('GlobalHeader has proper ARIA labels', () => {
      render(<GlobalHeader />);

      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    test('Navigation links have proper roles', () => {
      render(<GlobalHeader />);

      const navLinks = screen.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
    });

    test('Logo has alt text', () => {
      render(<GlobalHeader />);
      const logo = screen.getByAltText(/remax/i);
      expect(logo).toHaveAttribute('alt');
    });

    test('Free Valuation button has proper role', () => {
      render(<GlobalHeader />);
      const freeValuationButton = screen.getByRole('button', {
        name: /free valuation/i,
      });
      expect(freeValuationButton).toBeInTheDocument();
    });
  });

  // Performance tests
  describe('Performance', () => {
    test('GlobalHeader renders quickly', () => {
      const startTime = performance.now();
      render(<GlobalHeader />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
    });

    test('Mobile menu toggle is responsive', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');

      const startTime = performance.now();
      fireEvent.click(mobileMenuButton);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should toggle in less than 50ms
    });
  });

  // Touch target tests
  describe('Touch Targets', () => {
    test('All interactive elements have proper touch targets', () => {
      const { container } = render(<GlobalHeader />);
      const interactiveElements = container.querySelectorAll('button, a');

      interactiveElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    test('Mobile menu items have proper touch targets', () => {
      render(<GlobalHeader />);
      const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
      fireEvent.click(mobileMenuButton);

      const mobileMenuItems = screen.getAllByRole('link');
      mobileMenuItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });
  });
});
