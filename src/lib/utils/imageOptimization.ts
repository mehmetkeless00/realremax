// Image optimization utilities

export const generateImageSizes = (containerWidth: number): string => {
  if (containerWidth <= 640) return '100vw';
  if (containerWidth <= 1024) return '50vw';
  if (containerWidth <= 1280) return '33vw';
  return '25vw';
};

export const getOptimalImageQuality = (
  imageType: 'thumbnail' | 'preview' | 'full'
): number => {
  switch (imageType) {
    case 'thumbnail':
      return 60;
    case 'preview':
      return 75;
    case 'full':
      return 85;
    default:
      return 75;
  }
};

export const createImageUrl = (
  baseUrl: string,
  width: number,
  height: number,
  quality: number = 75,
  format: 'webp' | 'avif' | 'auto' = 'auto'
): string => {
  // For Supabase Storage, we can add transformation parameters
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    quality: quality.toString(),
    format: format,
  });

  return `${baseUrl}?${params.toString()}`;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
};

export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Common image sizes for different use cases
export const imageSizes = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 },
};

// Responsive sizes for different breakpoints
export const responsiveSizes = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

// Generate sizes attribute for responsive images
export const generateSizesAttribute = (
  mobileSize: string,
  tabletSize: string,
  desktopSize: string
): string => {
  return `${responsiveSizes.mobile} ${mobileSize}, ${responsiveSizes.tablet} ${tabletSize}, ${responsiveSizes.desktop} ${desktopSize}`;
};
