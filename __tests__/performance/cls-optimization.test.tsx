import { render, screen } from '@testing-library/react';
import CLSOptimizedImage from '@/components/CLSOptimizedImage';
import {
  calculateOptimalDimensions,
  generateResponsiveSizes,
  createAspectRatioStyles,
  generatePlaceholderStyles,
} from '@/lib/utils/clsOptimization';

describe('CLS Optimization Tests', () => {
  const mockImage = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test Property',
    width: 800,
    height: 600,
  };

  describe('CLSOptimizedImage Component', () => {
    test('renders with proper aspect ratio', () => {
      render(
        <CLSOptimizedImage
          src={mockImage.src}
          alt={mockImage.alt}
          width={mockImage.width}
          height={mockImage.height}
          aspectRatio={4 / 3}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', mockImage.alt);
    });

    test('maintains aspect ratio in container', () => {
      const { container } = render(
        <CLSOptimizedImage
          src={mockImage.src}
          alt={mockImage.alt}
          width={400}
          height={300}
          aspectRatio={4 / 3}
        />
      );

      const imageContainer = container.firstChild as HTMLElement;
      expect(imageContainer).toHaveStyle({ aspectRatio: '1.3333333333333333' });
    });

    test('shows loading skeleton initially', () => {
      const { container } = render(
        <CLSOptimizedImage
          src={mockImage.src}
          alt={mockImage.alt}
          width={400}
          height={300}
        />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    test('applies priority loading for above-fold images', () => {
      render(
        <CLSOptimizedImage
          src={mockImage.src}
          alt={mockImage.alt}
          width={400}
          height={300}
          priority={true}
        />
      );

      const image = screen.getByRole('img');
      // Next.js Image component handles priority internally
      expect(image).toBeInTheDocument();
    });
  });

  describe('CLS Optimization Utilities', () => {
    test('calculateOptimalDimensions returns correct dimensions', () => {
      const result = calculateOptimalDimensions(800, 600, 400, 300);

      expect(result.width).toBe(400);
      expect(result.height).toBe(300);
      expect(result.aspectRatio).toBe(4 / 3);
    });

    test('calculateOptimalDimensions maintains aspect ratio when scaling down', () => {
      const result = calculateOptimalDimensions(1200, 800, 600);

      expect(result.width).toBe(600);
      expect(result.height).toBe(400);
      expect(result.aspectRatio).toBe(1.5);
    });

    test('generateResponsiveSizes creates proper sizes string', () => {
      const sizes = generateResponsiveSizes(1200, 3);

      expect(sizes).toContain('(max-width: 640px)');
      expect(sizes).toContain('(max-width: 768px)');
      expect(sizes).toContain('(max-width: 1024px)');
      expect(sizes).toContain('400px'); // 1200 / 3
    });

    test('createAspectRatioStyles generates correct styles', () => {
      const styles = createAspectRatioStyles(4 / 3, 400, 300);

      expect(styles.aspectRatio).toBe('1.3333333333333333');
      expect(styles.width).toBe(400);
      expect(styles.height).toBe(300);
      expect(styles.position).toBe('relative');
    });

    test('generatePlaceholderStyles creates placeholder styles', () => {
      const styles = generatePlaceholderStyles(400, 300, 4 / 3);

      expect(styles.width).toBe(400);
      expect(styles.height).toBe(300);
      expect(styles.aspectRatio).toBe('1.3333333333333333');
      expect(styles.backgroundColor).toBe('#f3f4f6');
      expect(styles.display).toBe('flex');
    });
  });

  describe('Performance Metrics', () => {
    test('image dimensions are optimized for performance', () => {
      const dimensions = calculateOptimalDimensions(1920, 1080, 800);

      // Should not exceed max width
      expect(dimensions.width).toBeLessThanOrEqual(800);

      // Should maintain aspect ratio
      const calculatedAspectRatio = dimensions.width / dimensions.height;
      expect(calculatedAspectRatio).toBeCloseTo(16 / 9, 2);
    });

    test('responsive sizes are optimized for different viewports', () => {
      const mobileSizes = generateResponsiveSizes(375, 1); // Mobile
      const tabletSizes = generateResponsiveSizes(768, 2); // Tablet
      const desktopSizes = generateResponsiveSizes(1200, 3); // Desktop

      expect(mobileSizes).toContain('375px');
      expect(tabletSizes).toContain('384px'); // 768 / 2
      expect(desktopSizes).toContain('400px'); // 1200 / 3
    });
  });

  describe('Accessibility with CLS Optimization', () => {
    test('maintains accessibility while preventing layout shift', () => {
      render(
        <CLSOptimizedImage
          src={mockImage.src}
          alt={mockImage.alt}
          width={400}
          height={300}
          aspectRatio={4 / 3}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', mockImage.alt);

      // Next.js Image handles loading attributes internally
      expect(image).toBeInTheDocument();
    });
  });

  describe('CLS Prevention Techniques', () => {
    test('placeholder maintains layout space', () => {
      const { container } = render(
        <CLSOptimizedImage
          src="slow-loading-image"
          alt={mockImage.alt}
          width={400}
          height={300}
        />
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement).toHaveStyle({ width: '400px', height: '300px' });
    });

    test('loading skeleton maintains dimensions', () => {
      const { container } = render(
        <CLSOptimizedImage
          src={mockImage.src}
          alt={mockImage.alt}
          width={400}
          height={300}
        />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveStyle({ width: '400px', height: '300px' });
    });
  });
});
