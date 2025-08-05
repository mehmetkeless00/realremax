import {
  generateImageUrl,
  optimizeImageUrl,
  getImagePlaceholder,
  validateImageFile,
  getImageDimensions,
  formatFileSize,
} from '@/lib/utils/imageOptimization';

describe('Image Optimization Utils', () => {
  describe('generateImageUrl', () => {
    it('should generate correct Supabase storage URL', () => {
      const bucket = 'properties';
      const path = 'test-image.jpg';
      const url = generateImageUrl(bucket, path);

      expect(url).toContain('supabase.co');
      expect(url).toContain('storage/v1/object/public');
      expect(url).toContain(bucket);
      expect(url).toContain(path);
    });

    it('should handle paths with spaces', () => {
      const bucket = 'properties';
      const path = 'test image with spaces.jpg';
      const url = generateImageUrl(bucket, path);

      expect(url).toContain(encodeURIComponent(path));
    });

    it('should handle special characters in path', () => {
      const bucket = 'properties';
      const path = 'test-image-@#$%.jpg';
      const url = generateImageUrl(bucket, path);

      expect(url).toContain(encodeURIComponent(path));
    });
  });

  describe('optimizeImageUrl', () => {
    it('should add optimization parameters to URL', () => {
      const originalUrl = 'https://example.com/image.jpg';
      const optimizedUrl = optimizeImageUrl(originalUrl, {
        width: 800,
        height: 600,
        quality: 80,
        format: 'webp',
      });

      expect(optimizedUrl).toContain('width=800');
      expect(optimizedUrl).toContain('height=600');
      expect(optimizedUrl).toContain('quality=80');
      expect(optimizedUrl).toContain('format=webp');
    });

    it('should handle URL without existing parameters', () => {
      const originalUrl = 'https://example.com/image.jpg';
      const optimizedUrl = optimizeImageUrl(originalUrl, { width: 400 });

      expect(optimizedUrl).toContain('?width=400');
    });

    it('should handle URL with existing parameters', () => {
      const originalUrl = 'https://example.com/image.jpg?existing=param';
      const optimizedUrl = optimizeImageUrl(originalUrl, { width: 400 });

      expect(optimizedUrl).toContain('&width=400');
    });

    it('should handle empty optimization options', () => {
      const originalUrl = 'https://example.com/image.jpg';
      const optimizedUrl = optimizeImageUrl(originalUrl, {});

      expect(optimizedUrl).toBe(originalUrl);
    });
  });

  describe('getImagePlaceholder', () => {
    it('should return base64 placeholder for given dimensions', () => {
      const placeholder = getImagePlaceholder(400, 300);

      expect(placeholder).toContain('data:image/svg+xml;base64,');
      expect(placeholder).toContain('width="400"');
      expect(placeholder).toContain('height="300"');
    });

    it('should return default placeholder without dimensions', () => {
      const placeholder = getImagePlaceholder();

      expect(placeholder).toContain('data:image/svg+xml;base64,');
      expect(placeholder).toContain('width="400"');
      expect(placeholder).toContain('height="300"');
    });

    it('should handle zero dimensions', () => {
      const placeholder = getImagePlaceholder(0, 0);

      expect(placeholder).toContain('width="0"');
      expect(placeholder).toContain('height="0"');
    });
  });

  describe('validateImageFile', () => {
    it('should validate correct image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject non-image file', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateImageFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('image');
    });

    it('should reject file with invalid extension', () => {
      const file = new File(['test'], 'test.exe', { type: 'image/jpeg' });
      const result = validateImageFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('extension');
    });

    it('should reject oversized file', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      const result = validateImageFile(largeFile, 5 * 1024 * 1024); // 5MB limit

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('size');
    });

    it('should accept file within size limit', () => {
      const smallFile = new File(['x'.repeat(1024 * 1024)], 'small.jpg', {
        type: 'image/jpeg',
      });
      const result = validateImageFile(smallFile, 5 * 1024 * 1024); // 5MB limit

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle file without type', () => {
      const file = new File(['test'], 'test.jpg');
      const result = validateImageFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('type');
    });
  });

  describe('getImageDimensions', () => {
    it('should return correct dimensions for landscape image', () => {
      const dimensions = getImageDimensions(1920, 1080, 800);

      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(450);
    });

    it('should return correct dimensions for portrait image', () => {
      const dimensions = getImageDimensions(1080, 1920, 800);

      expect(dimensions.width).toBe(450);
      expect(dimensions.height).toBe(800);
    });

    it('should handle square image', () => {
      const dimensions = getImageDimensions(1000, 1000, 500);

      expect(dimensions.width).toBe(500);
      expect(dimensions.height).toBe(500);
    });

    it('should handle zero dimensions', () => {
      const dimensions = getImageDimensions(0, 0, 800);

      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(600);
    });

    it('should handle negative dimensions', () => {
      const dimensions = getImageDimensions(-100, -100, 800);

      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(600);
    });

    it('should maintain aspect ratio', () => {
      const originalWidth = 1920;
      const originalHeight = 1080;
      const maxWidth = 800;

      const dimensions = getImageDimensions(originalWidth, originalHeight, maxWidth);

      const aspectRatio = originalWidth / originalHeight;
      const newAspectRatio = dimensions.width / dimensions.height;

      expect(newAspectRatio).toBeCloseTo(aspectRatio, 2);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle small file sizes', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB');
    });

    it('should handle very large file sizes', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });

    it('should handle negative values', () => {
      expect(formatFileSize(-1024)).toBe('0 B');
    });
  });

  describe('Integration Tests', () => {
    it('should work together for complete image optimization workflow', () => {
      const file = new File(['test'], 'test-image.jpg', { type: 'image/jpeg' });
      
      // Validate file
      const validation = validateImageFile(file);
      expect(validation.isValid).toBe(true);

      // Generate URL
      const url = generateImageUrl('properties', 'test-image.jpg');
      expect(url).toContain('test-image.jpg');

      // Optimize URL
      const optimizedUrl = optimizeImageUrl(url, { width: 800, quality: 80 });
      expect(optimizedUrl).toContain('width=800');
      expect(optimizedUrl).toContain('quality=80');

      // Get dimensions
      const dimensions = getImageDimensions(1920, 1080, 800);
      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(450);

      // Get placeholder
      const placeholder = getImagePlaceholder(dimensions.width, dimensions.height);
      expect(placeholder).toContain('width="800"');
      expect(placeholder).toContain('height="450"');
    });

    it('should handle error cases gracefully', () => {
      // Invalid file
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      const validation = validateImageFile(invalidFile);
      expect(validation.isValid).toBe(false);

      // Invalid URL
      const invalidUrl = 'not-a-url';
      const optimizedUrl = optimizeImageUrl(invalidUrl, { width: 800 });
      expect(optimizedUrl).toBe(invalidUrl);

      // Invalid dimensions
      const dimensions = getImageDimensions(NaN, NaN, 800);
      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(600);
    });
  });
}); 