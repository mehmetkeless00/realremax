'use client';

import OptimizedImage from '@/components/OptimizedImage';

const testImages = [
  {
    src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    alt: 'Modern House',
    width: 800,
    height: 600,
  },
  {
    src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    alt: 'Luxury Apartment',
    width: 800,
    height: 600,
  },
  {
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    alt: 'Contemporary Villa',
    width: 800,
    height: 600,
  },
];

export default function ImageOptimizationDemo() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Image Optimization Demo
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Optimized Image Component
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full h-48 object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                  <p className="text-sm text-gray-600">{image.alt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Features</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2" aria-hidden="true">
                  ✅
                </span>
                Lazy loading for non-priority images
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2" aria-hidden="true">
                  ✅
                </span>
                Blur placeholder during loading
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2" aria-hidden="true">
                  ✅
                </span>
                WebP/AVIF format optimization
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2" aria-hidden="true">
                  ✅
                </span>
                Responsive image sizes
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2" aria-hidden="true">
                  ✅
                </span>
                Error handling with fallback
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2" aria-hidden="true">
                  ✅
                </span>
                Loading skeleton animation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
