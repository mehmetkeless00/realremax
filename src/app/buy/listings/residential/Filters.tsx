'use client';

import { FilterState } from './schema';

export default function Filters({
  filters,
  setFilter,
  clearAll,
}: {
  filters: FilterState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilter: (k: keyof FilterState, v: any) => void;
  clearAll: () => void;
}) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Filters</h3>
        <button className="text-sm text-blue-600 underline" onClick={clearAll}>
          Clear all
        </button>
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-2">
        <Chip
          active={filters.published === 30}
          onClick={() =>
            setFilter('published', filters.published === 30 ? undefined : 30)
          }
        >
          New last 30 days
        </Chip>
        <Chip
          active={!!filters.price_reduced}
          onClick={() => setFilter('price_reduced', !filters.price_reduced)}
        >
          Price reduced
        </Chip>
        <Chip
          active={!!filters.virtual_tour}
          onClick={() => setFilter('virtual_tour', !filters.virtual_tour)}
        >
          Virtual tour
        </Chip>
      </div>

      {/* Type */}
      <div>
        <div className="font-medium mb-2">Property Type</div>
        {['apartment', 'house', 'villa', 'studio', 'duplex', 'other'].map(
          (t) => {
            const arr = filters.type ?? [];
            const active = arr.includes(t);
            return (
              <label key={t} className="block text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={active}
                  onChange={() => {
                    if (active)
                      setFilter(
                        'type',
                        arr.filter((x) => x !== t)
                      );
                    else setFilter('type', [...arr, t]);
                  }}
                />
                {t}
              </label>
            );
          }
        )}
      </div>

      {/* Price */}
      <div>
        <div className="font-medium mb-2">Price Range</div>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border px-2 py-1 rounded"
            type="number"
            placeholder="Min"
            value={filters.price_min ?? ''}
            onChange={(e) =>
              setFilter(
                'price_min',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
          <input
            className="border px-2 py-1 rounded"
            type="number"
            placeholder="Max"
            value={filters.price_max ?? ''}
            onChange={(e) =>
              setFilter(
                'price_max',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>
      </div>

      {/* Beds / Baths */}
      <div>
        <div className="font-medium mb-2">Bedrooms</div>
        <ButtonGroup
          current={filters.beds_min}
          onSelect={(v) => setFilter('beds_min', v)}
          options={[1, 2, 3, 4, 5]}
        />
      </div>
      <div>
        <div className="font-medium mb-2">Bathrooms</div>
        <ButtonGroup
          current={filters.baths_min}
          onSelect={(v) => setFilter('baths_min', v)}
          options={[1, 2, 3]}
        />
      </div>

      {/* Energy */}
      <div>
        <div className="font-medium mb-2">Energy</div>
        {['A+', 'A', 'B', 'C', 'D', 'E', 'F'].map((e) => {
          const arr = filters.energy ?? [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const active = arr.includes(e as any);
          return (
            <button
              key={e}
              onClick={() =>
                active
                  ? setFilter(
                      'energy',
                      arr.filter((x) => x !== e)
                    )
                  : setFilter('energy', [...arr, e])
              }
              className={`px-2 py-1 border rounded text-sm mr-2 mb-2 ${
                active ? 'bg-green-600 text-white' : ''
              }`}
            >
              {e}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Chip({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm border rounded-full ${
        active ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

function ButtonGroup({
  current,
  onSelect,
  options,
}: {
  current?: number;
  onSelect: (v?: number) => void;
  options: number[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = current === o;
        return (
          <button
            key={o}
            className={`px-3 py-1 border rounded text-sm ${
              active ? 'bg-blue-600 text-white' : ''
            }`}
            onClick={() => onSelect(active ? undefined : o)}
          >
            {o}+
          </button>
        );
      })}
    </div>
  );
}
