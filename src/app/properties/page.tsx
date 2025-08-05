'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdvancedSearchBar from '@/components/AdvancedSearchBar';
import PropertyCard from '@/components/PropertyCard';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-lg font-bold text-dark-charcoal mb-6">
          Advanced Property Search
        </h1>
        <AdvancedSearchBar onSearch={handleSearch} loading={loading} />
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
              <p className="mt-2 text-gray-600">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No properties found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={pagination.page <= 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}
