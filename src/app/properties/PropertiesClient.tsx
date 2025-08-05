'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdvancedSearchBar from '@/components/AdvancedSearchBar';
import PropertyCard from '@/components/PropertyCard';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import type { PropertyWithListing } from '@/types/property';

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyWithListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({});

  const fetchProperties = async (
    params: Record<string, string | string[] | number | undefined> = {}
  ) => {
    setLoading(true);
    const url = new URL('/api/search', window.location.origin);
    Object.entries({
      ...params,
      page: pagination.page,
      limit: pagination.limit,
    }).forEach(([k, v]) => {
      if (typeof v === 'string' ? v !== '' : v !== undefined)
        url.searchParams.append(k, String(v));
    });
    const res = await fetch(url.toString());
    const json = await res.json();
    setProperties(json.data || []);
    setPagination(
      json.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 }
    );
    setLoading(false);
  };

  useEffect(() => {
    const urlFilters: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (key === 'amenities') {
        if (!urlFilters[key]) urlFilters[key] = [];
        if (Array.isArray(urlFilters[key])) {
          (urlFilters[key] as string[]).push(value);
        } else {
          urlFilters[key] = [value];
        }
      } else {
        urlFilters[key] = value;
      }
    });

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
      fetchProperties(urlFilters);
    } else {
      fetchProperties(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, searchParams]);

  const handleSearch = (
    params: Record<string, string | string[] | number | undefined>
  ) => {
    setFilters(params);
    setPagination((p) => ({ ...p, page: 1 }));
    fetchProperties(params);
  };

  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://realremax-kvpi.vercel.app' },
      {
        name: 'Properties',
        url: 'https://realremax-kvpi.vercel.app/properties',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <BreadcrumbStructuredData data={{ items: breadcrumbData.items }} />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Property Listings
            </h1>
            <p className="text-gray-600">
              Browse our comprehensive collection of properties for sale and
              rent.
            </p>
          </div>

          <AdvancedSearchBar onSearch={handleSearch} />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"
                aria-label="Loading properties"
              ></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h2>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse all properties.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <nav className="flex justify-center" aria-label="Pagination">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page - 1 }))
                      }
                      disabled={pagination.page === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page + 1 }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PropertiesClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}
