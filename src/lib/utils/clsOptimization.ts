// CLS (Cumulative Layout Shift) optimization utilities

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Calculate optimal image dimensions to prevent layout shift
 */
export const calculateOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight?: number
): ImageDimensions => {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Scale down if larger than max dimensions
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio,
  };
};

/**
 * Generate responsive sizes string for different viewports
 */
export const generateResponsiveSizes = (
  containerWidth: number,
  columns: number = 1
): string => {
  const breakpoints = [
    { maxWidth: 640, columns: Math.min(columns, 1) },
    { maxWidth: 768, columns: Math.min(columns, 2) },
    { maxWidth: 1024, columns: Math.min(columns, 3) },
    { maxWidth: 1280, columns: Math.min(columns, 4) },
  ];

  const sizes = breakpoints.map(({ maxWidth, columns }) => {
    const width = Math.round(containerWidth / columns);
    return `(max-width: ${maxWidth}px) ${width}px`;
  });

  // Add default size
  const defaultWidth = Math.round(containerWidth / columns);
  sizes.push(`${defaultWidth}px`);

  return sizes.join(', ');
};

/**
 * Create aspect ratio container styles
 */
export const createAspectRatioStyles = (
  aspectRatio: number,
  width?: number | string,
  height?: number | string
): React.CSSProperties => {
  return {
    width: width || '100%',
    height: height || 'auto',
    aspectRatio: aspectRatio.toString(),
    position: 'relative' as const,
  };
};

/**
 * Generate placeholder styles to prevent layout shift
 */
export const generatePlaceholderStyles = (
  width: number,
  height: number,
  aspectRatio: number
): React.CSSProperties => {
  return {
    width,
    height,
    aspectRatio: aspectRatio.toString(),
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  };
};

/**
 * Calculate image quality based on device and connection
 */
export const getOptimalImageQuality = (
  devicePixelRatio: number = 1,
  connectionType?: 'slow-2g' | '2g' | '3g' | '4g'
): number => {
  let quality = 75; // Default quality

  // Adjust based on device pixel ratio
  if (devicePixelRatio >= 2) {
    quality = 85;
  } else if (devicePixelRatio >= 1.5) {
    quality = 80;
  }

  // Adjust based on connection type
  if (connectionType === 'slow-2g' || connectionType === '2g') {
    quality = Math.min(quality, 60);
  } else if (connectionType === '3g') {
    quality = Math.min(quality, 70);
  }

  return quality;
};

/**
 * Generate blur data URL for placeholder
 */
export const generateBlurDataURL = (
  width: number,
  height: number,
  backgroundColor: string = '#f3f4f6'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#667387" text-anchor="middle" dy=".3em">Image Loading...</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Preload critical images to prevent layout shift
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

/**
 * Batch preload images
 */
export const preloadImages = async (srcs: string[]): Promise<void[]> => {
  const preloadPromises = srcs.map((src) => preloadImage(src));
  return Promise.allSettled(preloadPromises).then((results) => {
    return results
      .map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.warn('Failed to preload image:', result.reason);
          return undefined;
        }
      })
      .filter(Boolean) as void[];
  });
};

/**
 * Detect if user has slow connection
 */
export const detectSlowConnection = (): boolean => {
  if ('connection' in navigator) {
    const connection = navigator as Navigator & {
      connection?: {
        effectiveType?: string;
      };
    };
    return (
      connection.connection?.effectiveType === 'slow-2g' ||
      connection.connection?.effectiveType === '2g' ||
      connection.connection?.effectiveType === '3g'
    );
  }
  return false;
};

/**
 * Get optimal loading strategy based on connection and viewport
 */
export const getLoadingStrategy = (
  isAboveFold: boolean = false,
  isSlowConnection: boolean = false
): 'eager' | 'lazy' => {
  if (isAboveFold) return 'eager';
  if (isSlowConnection) return 'lazy';
  return 'lazy';
};
