import { create } from 'zustand';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  agent_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  status?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  listingType?: 'sale' | 'rent';
}

export interface PropertySort {
  field: 'price' | 'created_at' | 'title';
  direction: 'asc' | 'desc';
}

interface PropertyState {
  // Properties list
  properties: Property[];
  selectedProperty: Property | null;

  // Filters and sorting
  filters: PropertyFilters;
  sort: PropertySort;

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;

  // Actions
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  removeProperty: (id: string) => void;

  // Selection
  selectProperty: (property: Property | null) => void;

  // Filters
  setFilters: (filters: Partial<PropertyFilters>) => void;
  clearFilters: () => void;

  // Sorting
  setSort: (sort: PropertySort) => void;

  // Pagination
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setTotalItems: (total: number) => void;

  // Loading
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;

  // Utility actions
  getFilteredProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  // Initial state
  properties: [],
  selectedProperty: null,
  filters: {},
  sort: {
    field: 'created_at',
    direction: 'desc',
  },
  currentPage: 1,
  itemsPerPage: 12,
  totalItems: 0,
  isLoading: false,
  isLoadingMore: false,

  // Property actions
  setProperties: (properties) => set({ properties }),

  addProperty: (property) =>
    set((state) => ({
      properties: [property, ...state.properties],
    })),

  updateProperty: (id, updates) =>
    set((state) => ({
      properties: state.properties.map((property) =>
        property.id === id ? { ...property, ...updates } : property
      ),
      selectedProperty:
        state.selectedProperty?.id === id
          ? { ...state.selectedProperty, ...updates }
          : state.selectedProperty,
    })),

  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((property) => property.id !== id),
      selectedProperty:
        state.selectedProperty?.id === id ? null : state.selectedProperty,
    })),

  // Selection
  selectProperty: (property) => set({ selectedProperty: property }),

  // Filters
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    })),

  clearFilters: () =>
    set({
      filters: {},
      currentPage: 1,
    }),

  // Sorting
  setSort: (sort) => set({ sort }),

  // Pagination
  setPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
  setTotalItems: (totalItems) => set({ totalItems }),

  // Loading
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingMore: (isLoadingMore) => set({ isLoadingMore }),

  // Utility actions
  getFilteredProperties: () => {
    const { properties, filters, sort } = get();

    let filtered = [...properties];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(
        (property) => property.status === filters.status
      );
    }

    if (filters.type) {
      filtered = filtered.filter((property) => property.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (property) => property.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (property) => property.price <= filters.maxPrice!
      );
    }

    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location
          .toLowerCase()
          .includes(filters.location!.toLowerCase())
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms === filters.bedrooms
      );
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(
        (property) => property.bathrooms === filters.bathrooms
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  },

  getPropertyById: (id) => {
    const { properties } = get();
    return properties.find((property) => property.id === id);
  },
}));
