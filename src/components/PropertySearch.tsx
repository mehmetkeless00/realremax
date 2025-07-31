'use client';

import { useState } from 'react';

interface PropertySearchProps {
  onSearch: (params: Record<string, string | number | undefined>) => void;
  loading?: boolean;
}

export default function PropertySearch({
  onSearch,
  loading,
}: PropertySearchProps) {
  const [form, setForm] = useState({
    location: '',
    type: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    sizeMin: '',
    sizeMax: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end"
    >
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Location
        </label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="mt-1 block w-40 rounded border-gray-300"
          placeholder="City, district..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="mt-1 block w-32 rounded border-gray-300"
        >
          <option value="">Any</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="studio">Studio</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Price Min
        </label>
        <input
          name="priceMin"
          type="number"
          value={form.priceMin}
          onChange={handleChange}
          className="mt-1 block w-24 rounded border-gray-300"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Price Max
        </label>
        <input
          name="priceMax"
          type="number"
          value={form.priceMax}
          onChange={handleChange}
          className="mt-1 block w-24 rounded border-gray-300"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Bedrooms
        </label>
        <input
          name="bedrooms"
          type="number"
          value={form.bedrooms}
          onChange={handleChange}
          className="mt-1 block w-16 rounded border-gray-300"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Bathrooms
        </label>
        <input
          name="bathrooms"
          type="number"
          value={form.bathrooms}
          onChange={handleChange}
          className="mt-1 block w-16 rounded border-gray-300"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Size Min (m²)
        </label>
        <input
          name="sizeMin"
          type="number"
          value={form.sizeMin}
          onChange={handleChange}
          className="mt-1 block w-20 rounded border-gray-300"
          min={0}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Size Max (m²)
        </label>
        <input
          name="sizeMax"
          type="number"
          value={form.sizeMax}
          onChange={handleChange}
          className="mt-1 block w-20 rounded border-gray-300"
          min={0}
        />
      </div>
      <button
        type="submit"
        className="bg-primary-blue text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
