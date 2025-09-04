'use client';

import { useState } from 'react';
import Pagination from '@/components/pagination/Pagination';
import InfiniteScroll from '@/components/pagination/InfiniteScroll';
import VirtualList from '@/components/pagination/VirtualList';
import { usePagination } from '@/hooks/usePagination';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';

// Generate large dataset for testing
const generateLargeDataset = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `property-${index + 1}`,
    title: `Property ${index + 1}`,
    description: `Description for Property ${index + 1}`,
    price: Math.floor(Math.random() * 1000000) + 100000,
    location: `Location ${index + 1}`,
    type: 'apartment',
    bedrooms: Math.floor(Math.random() * 5) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    size: Math.floor(Math.random() * 200) + 50,
    year_built: Math.floor(Math.random() * 30) + 1990,
    status: (['active', 'pending', 'sold', 'rented'] as const)[
      Math.floor(Math.random() * 4)
    ],
    agent_id: `agent-${index + 1}`,
    listing_type: 'sale',
    amenities: ['wifi', 'parking', 'gym'],
    features: ['wifi', 'parking', 'gym'],
    photos: ['/images/placeholder-property.svg'],
    address: `Address ${index + 1}`,
    city: 'City',
    district: 'District',
    postal_code: '12345',
    country: 'Country',
    latitude: 40.7128,
    longitude: -74.006,
    slug: `property-${index + 1}`,
    meta_title: `Property ${index + 1} - Real Estate`,
    meta_description: `Description for Property ${index + 1}`,
    og_image_url: '/images/placeholder-property.svg',
    currency: 'EUR',
    energy_rating: 'A',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ['/images/placeholder-property.svg'],
    agent: {
      id: `agent-${index + 1}`,
      name: 'Agent Name',
      company: 'Company',
      phone: '+1234567890',
    },
    listing: {
      id: `listing-${index + 1}`,
      property_id: `property-${index + 1}`,
      agent_id: `agent-${index + 1}`,
      listing_type: 'sale' as const,
      price: Math.floor(Math.random() * 1000000) + 100000,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }));
};

const largeDataset = generateLargeDataset(1000);

export default function PaginationDemo() {
  const [viewMode, setViewMode] = useState<
    'pagination' | 'infinite' | 'virtual'
  >('pagination');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [loadedItems, setLoadedItems] = useState(24); // For infinite scroll
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Pagination hook
  const pagination = usePagination({
    initialPage: currentPage,
    initialItemsPerPage: itemsPerPage,
    totalItems: largeDataset.length,
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination.goToPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    pagination.setItemsPerPage(newItemsPerPage);
  };

  // Handle infinite scroll load more
  const handleLoadMore = async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoadedItems((prev) => Math.min(prev + 12, largeDataset.length));
    setIsLoadingMore(false);
  };

  // Get current items based on view mode
  const getCurrentItems = () => {
    switch (viewMode) {
      case 'pagination':
        return pagination.getPageItems(largeDataset);
      case 'infinite':
        return largeDataset.slice(0, loadedItems);
      case 'virtual':
        return largeDataset;
      default:
        return largeDataset.slice(0, 12);
    }
  };

  const currentItems = getCurrentItems();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-fg mb-4">
              Pagination & Virtualization Demo
            </h1>
            <p className="text-muted mb-6">
              Demonstrating different pagination strategies for large datasets.
            </p>

            {/* View Mode Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                onClick={() => setViewMode('pagination')}
                variant={viewMode === 'pagination' ? 'primary' : 'outline'}
              >
                Traditional Pagination
              </Button>
              <Button
                onClick={() => setViewMode('infinite')}
                variant={viewMode === 'infinite' ? 'primary' : 'outline'}
              >
                Infinite Scroll
              </Button>
              <Button
                onClick={() => setViewMode('virtual')}
                variant={viewMode === 'virtual' ? 'primary' : 'outline'}
              >
                Virtual Scrolling
              </Button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {largeDataset.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentItems.length}
                  </div>
                  <div className="text-sm text-muted">Rendered Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {viewMode === 'virtual' ? '~20' : currentItems.length}
                  </div>
                  <div className="text-sm text-muted">DOM Elements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {viewMode === 'virtual' ? '99%' : '100%'}
                  </div>
                  <div className="text-sm text-muted">Memory Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {viewMode === 'pagination' && 'Traditional Pagination'}
                {viewMode === 'infinite' && 'Infinite Scroll'}
                {viewMode === 'virtual' && 'Virtual Scrolling'}
              </h2>
              <p className="text-muted">
                {viewMode === 'pagination' &&
                  'Classic pagination with page numbers and navigation.'}
                {viewMode === 'infinite' &&
                  'Load more content as user scrolls to the bottom.'}
                {viewMode === 'virtual' &&
                  'Only render visible items for optimal performance.'}
              </p>
            </div>

            {/* Items Grid/List */}
            {viewMode === 'virtual' ? (
              <VirtualList
                items={largeDataset}
                itemHeight={400} // Approximate height of PropertyCard
                containerHeight={600}
                renderItem={(item) => (
                  <div className="p-2">
                    <PropertyCard
                      property={item}
                      view="grid"
                      showFavorite={false}
                    />
                  </div>
                )}
                className="border rounded-lg"
              />
            ) : (
              <InfiniteScroll
                hasMore={
                  viewMode === 'infinite'
                    ? loadedItems < largeDataset.length
                    : false
                }
                isLoading={isLoadingMore}
                onLoadMore={handleLoadMore}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentItems.map((item) => (
                  <PropertyCard
                    key={item.id}
                    property={item}
                    view="grid"
                    showFavorite={false}
                  />
                ))}
              </InfiniteScroll>
            )}

            {/* Pagination Controls */}
            {viewMode === 'pagination' && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={largeDataset.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  showItemsPerPage={true}
                />
              </div>
            )}

            {/* Infinite Scroll Info */}
            {viewMode === 'infinite' && (
              <div className="mt-8 text-center text-muted">
                <p>
                  Loaded {loadedItems} of {largeDataset.length.toLocaleString()}{' '}
                  items
                </p>
                {loadedItems < largeDataset.length && (
                  <p className="text-sm">Scroll down to load more...</p>
                )}
              </div>
            )}

            {/* Virtual Scrolling Info */}
            {viewMode === 'virtual' && (
              <div className="mt-8 text-center text-muted">
                <p>
                  Virtual scrolling with {largeDataset.length.toLocaleString()}{' '}
                  items
                </p>
                <p className="text-sm">
                  Only ~20 DOM elements rendered at any time
                </p>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Pagination Strategy Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    <th className="text-left p-2">Traditional</th>
                    <th className="text-left p-2">Infinite Scroll</th>
                    <th className="text-left p-2">Virtual Scrolling</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Memory Usage</td>
                    <td className="p-2">Low</td>
                    <td className="p-2">Medium</td>
                    <td className="p-2">Very Low</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Performance</td>
                    <td className="p-2">Good</td>
                    <td className="p-2">Good</td>
                    <td className="p-2">Excellent</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">User Experience</td>
                    <td className="p-2">Familiar</td>
                    <td className="p-2">Smooth</td>
                    <td className="p-2">Fast</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">SEO Friendly</td>
                    <td className="p-2">Yes</td>
                    <td className="p-2">Partial</td>
                    <td className="p-2">No</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Best For</td>
                    <td className="p-2">Small datasets</td>
                    <td className="p-2">Medium datasets</td>
                    <td className="p-2">Large datasets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
