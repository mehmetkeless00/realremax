'use client';

import { PropertyItem } from './schema';

export default function List({
  items,
  loading,
  page,
  pageSize,
  total,
  onPage,
  onHover,
}: {
  items: PropertyItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onHover: (id: string | null) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currency = 'EUR';

  return (
    <>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="animate-pulse h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="animate-pulse h-4 bg-gray-200 w-3/4" />
                <div className="animate-pulse h-3 bg-gray-200 w-1/2" />
                <div className="animate-pulse h-6 bg-gray-200 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No properties found
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {items.map((it) => (
          <div
            key={it.id}
            onMouseEnter={() => onHover(it.id)}
            onMouseLeave={() => onHover(null)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative">
              {it.images[0] ? (
                <img
                  src={it.images[0]}
                  alt={it.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200" />
              )}
              {it.price_reduced && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  REDUCED
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 space-x-2">
                {it.new_to_market && <Badge>NEW</Badge>}
                {it.virtual_tour && (
                  <Badge className="bg-purple-100 text-purple-800">
                    VIRTUAL TOUR
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{it.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {[it.location.parish, it.location.district]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p className="text-2xl font-bold text-blue-600 mb-3">
                {new Intl.NumberFormat('en-EN', {
                  style: 'currency',
                  currency,
                  maximumFractionDigits: 0,
                }).format(it.price_eur)}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span>{it.beds ?? 0} bd</span>
                <span className="mx-2">·</span>
                <span>{it.baths ?? 0} ba</span>
                <span className="mx-2">·</span>
                <span>{it.area_m2 ?? 0} m²</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            className="px-3 py-2 border rounded"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages })
            .slice(0, 7)
            .map((_, i) => {
              const num = i + 1;
              return (
                <button
                  key={num}
                  onClick={() => onPage(num)}
                  className={`px-3 py-2 border rounded ${
                    page === num ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {num}
                </button>
              );
            })}
          <button
            className="px-3 py-2 border rounded"
            disabled={page >= totalPages}
            onClick={() => onPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Badge({ children, className = '' }: any) {
  return (
    <span
      className={`inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-800 ${className}`}
    >
      {children}
    </span>
  );
}
