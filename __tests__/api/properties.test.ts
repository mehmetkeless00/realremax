import { supabase } from '@/lib/supabase';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Properties API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/properties', () => {
    test('fetches properties successfully', async () => {
      const mockProperties = [
        {
          id: '1',
          title: 'Test Property 1',
          price: 450000,
          location: 'Amsterdam',
          status: 'active',
        },
        {
          id: '2',
          title: 'Test Property 2',
          price: 550000,
          location: 'Rotterdam',
          status: 'active',
        },
      ];

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockProperties,
              error: null,
            }),
          }),
        }),
      } as any);

      const response = await fetch('/api/properties');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockProperties);
    });

    test('handles database errors gracefully', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      } as any);

      const response = await fetch('/api/properties');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/properties/[id]', () => {
    test('fetches single property successfully', async () => {
      const mockProperty = {
        id: '1',
        title: 'Test Property',
        price: 450000,
        location: 'Amsterdam',
        status: 'active',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProperty,
              error: null,
            }),
          }),
        }),
      } as any);

      const response = await fetch('/api/properties/1');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockProperty);
    });

    test('returns 404 for non-existent property', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Property not found' },
            }),
          }),
        }),
      } as any);

      const response = await fetch('/api/properties/non-existent');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/listings', () => {
    test('creates property successfully', async () => {
      const newProperty = {
        title: 'New Property',
        price: 500000,
        location: 'Utrecht',
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
      };

      const mockCreatedProperty = {
        id: '3',
        ...newProperty,
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [mockCreatedProperty],
            error: null,
          }),
        }),
      } as any);

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual([mockCreatedProperty]);
    });

    test('validates required fields', async () => {
      const invalidProperty = {
        title: '', // Missing required field
        price: 500000,
        location: 'Utrecht',
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidProperty),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/listings', () => {
    test('updates property successfully', async () => {
      const updateData = {
        id: '1',
        title: 'Updated Property',
        price: 550000,
      };

      const mockUpdatedProperty = {
        id: '1',
        title: 'Updated Property',
        price: 550000,
        location: 'Amsterdam',
        status: 'active',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: { agent_id: 'agent-1' },
            error: null,
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [mockUpdatedProperty],
              error: null,
            }),
          }),
        }),
      } as any);

      const response = await fetch('/api/listings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual([mockUpdatedProperty]);
    });

    test('prevents unauthorized updates', async () => {
      const updateData = {
        id: '1',
        title: 'Unauthorized Update',
      };

      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null, // Property not found or not owned by user
            error: null,
          }),
        }),
      } as any);

      const response = await fetch('/api/listings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/listings', () => {
    test('deletes property successfully', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: { agent_id: 'agent-1' },
            error: null,
          }),
        }),
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any);

      const response = await fetch('/api/listings?id=1', {
        method: 'DELETE',
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.message).toBe('Property deleted successfully');
    });

    test('prevents unauthorized deletion', async () => {
      const mockSupabase = supabase as jest.Mocked<typeof supabase>;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null, // Property not found or not owned by user
            error: null,
          }),
        }),
      } as any);

      const response = await fetch('/api/listings?id=1', {
        method: 'DELETE',
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });
});
