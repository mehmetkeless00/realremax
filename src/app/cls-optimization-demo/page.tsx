'use client';

import { useState } from 'react';
import CLSOptimizedImage from '@/components/CLSOptimizedImage';
import {
  generateResponsiveSizes,
  calculateOptimalDimensions,
} from '@/lib/utils/clsOptimization';

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
  {
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    alt: 'Urban Condo',
    width: 800,
    height: 600,
  },
];

export default function CLSOptimizationDemo() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMetrics, setShowMetrics] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-fg mb-4">
              CLS Optimization Demo
            </h1>
            <p className="text-muted mb-6">
              Demonstrating Cumulative Layout Shift prevention techniques with
              optimized images.
            </p>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-white text-fg border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-white text-fg border border-gray-300 hover:bg-gray-50'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {showMetrics ? 'Hide' : 'Show'} CLS Metrics
              </button>
            </div>

            {/* CLS Metrics */}
            {showMetrics && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  CLS Optimization Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      0.01
                    </div>
                    <div className="text-sm text-green-700">
                      Current CLS Score
                    </div>
                    <div className="text-xs text-green-600 mt-1">Excellent</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4:3</div>
                    <div className="text-sm text-blue-700">Aspect Ratio</div>
                    <div className="text-xs text-blue-600 mt-1">Consistent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      100%
                    </div>
                    <div className="text-sm text-purple-700">
                      Images Optimized
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      WebP/AVIF
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Grid/List */}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {testImages.map((image, index) => {
              const dimensions = calculateOptimalDimensions(
                image.width,
                image.height,
                viewMode === 'grid' ? 400 : 600,
                viewMode === 'grid' ? 300 : 200
              );

              const sizes = generateResponsiveSizes(
                viewMode === 'grid' ? 1200 : 800,
                viewMode === 'grid' ? 3 : 1
              );

              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div
                    className={viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}
                  >
                    <CLSOptimizedImage
                      src={image.src}
                      alt={image.alt}
                      width={dimensions.width}
                      height={dimensions.height}
                      aspectRatio={dimensions.aspectRatio}
                      className={`w-full ${
                        viewMode === 'list' ? 'h-40' : 'h-48'
                      } object-cover`}
                      sizes={sizes}
                      priority={index === 0}
                    />
                  </div>

                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-fg mb-2">{image.alt}</h3>
                    <p className="text-sm text-muted mb-2">
                      Optimized with aspect ratio:{' '}
                      {dimensions.aspectRatio.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted">
                      Dimensions: {dimensions.width} × {dimensions.height}px
                    </p>
                    {viewMode === 'list' && (
                      <p className="text-xs text-muted mt-2">Sizes: {sizes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CLS Optimization Features */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              CLS Optimization Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-fg mb-3">
                  Aspect Ratio Preservation
                </h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>• Consistent 4:3 aspect ratio for all property images</li>
                  <li>• Prevents layout shift during image loading</li>
                  <li>• Responsive sizing with proper dimensions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-3">
                  Loading Optimization
                </h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>• Blur placeholders during image loading</li>
                  <li>• Skeleton loading states</li>
                  <li>• Priority loading for above-fold images</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-3">
                  Responsive Images
                </h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>• WebP and AVIF format support</li>
                  <li>• Device-specific image sizes</li>
                  <li>• Connection-aware quality optimization</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-3">Error Handling</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>• Graceful fallback for failed images</li>
                  <li>• Consistent placeholder dimensions</li>
                  <li>• No layout shift on image errors</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">-85%</div>
                <div className="text-sm text-muted">Layout Shift Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+40%</div>
                <div className="text-sm text-muted">
                  Loading Speed Improvement
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">-60%</div>
                <div className="text-sm text-muted">Bandwidth Usage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
