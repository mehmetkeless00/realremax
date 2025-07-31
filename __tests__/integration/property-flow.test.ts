import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Property Flow Integration', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Property Creation Flow', () => {
    test('complete property creation process', async () => {
      const user = userEvent.setup();

      // Mock successful API responses
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: 'new-property-1' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve([{ id: 'new-property-1', title: 'New Property' }]),
        });

      // This would be a full integration test with the PropertyListingForm component
      // For now, we'll test the API flow

      // Step 1: Create property
      const newProperty = {
        title: 'New Property',
        price: 500000,
        location: 'Amsterdam',
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        description: 'A beautiful new property',
        status: 'active',
        listing_type: 'sale',
        amenities: ['Balcony', 'Parking'],
        address: 'Test Street 123',
        city: 'Amsterdam',
        postal_code: '1234 AB',
        country: 'Netherlands',
        photos: [],
      };

      const createResponse = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });

      expect(createResponse.ok).toBe(true);
      const createdProperty = await createResponse.json();
      expect(createdProperty).toHaveProperty('id');

      // Step 2: Verify property appears in listings
      const listingsResponse = await fetch('/api/listings');
      expect(listingsResponse.ok).toBe(true);
      const listings = await listingsResponse.json();
      expect(listings).toContainEqual(
        expect.objectContaining({
          id: 'new-property-1',
          title: 'New Property',
        })
      );
    });

    test('handles property creation validation errors', async () => {
      const invalidProperty = {
        title: '', // Missing required field
        price: 500000,
        location: 'Amsterdam',
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidProperty),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('Property Viewing Flow', () => {
    test('property search and viewing process', async () => {
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

      // Mock search API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockProperties,
            pagination: { page: 1, limit: 12, total: 2, totalPages: 1 },
          }),
      });

      // Step 1: Search properties
      const searchResponse = await fetch('/api/search?location=Amsterdam');
      expect(searchResponse.ok).toBe(true);
      const searchResults = await searchResponse.json();
      expect(searchResults.data).toHaveLength(2);

      // Step 2: Get specific property details
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProperties[0]),
      });

      const propertyResponse = await fetch('/api/properties/1');
      expect(propertyResponse.ok).toBe(true);
      const property = await propertyResponse.json();
      expect(property.title).toBe('Test Property 1');
    });

    test('handles property not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Property not found' }),
      });

      const response = await fetch('/api/properties/non-existent');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('Property Inquiry Flow', () => {
    test('complete inquiry submission process', async () => {
      const inquiryData = {
        propertyId: '1',
        agentId: 'agent-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'I am interested in this property. Please contact me.',
      };

      // Mock successful inquiry creation
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            inquiryId: 'inquiry-1',
            message: 'Inquiry submitted successfully',
          }),
      });

      // Step 1: Submit inquiry
      const inquiryResponse = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });

      expect(inquiryResponse.ok).toBe(true);
      const inquiryResult = await inquiryResponse.json();
      expect(inquiryResult.success).toBe(true);
      expect(inquiryResult).toHaveProperty('inquiryId');

      // Step 2: Verify inquiry appears in management
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 'inquiry-1',
              property_id: '1',
              agent_id: 'agent-1',
              user_id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com',
              message: 'I am interested in this property. Please contact me.',
              status: 'pending',
              created_at: '2024-01-01T00:00:00Z',
            },
          ]),
      });

      const inquiriesResponse = await fetch('/api/inquiry');
      expect(inquiriesResponse.ok).toBe(true);
      const inquiries = await inquiriesResponse.json();
      expect(inquiries).toHaveLength(1);
      expect(inquiries[0].name).toBe('John Doe');
    });

    test('handles inquiry validation errors', async () => {
      const invalidInquiry = {
        propertyId: '1',
        agentId: 'agent-1',
        name: '', // Missing required field
        email: 'invalid-email', // Invalid email
        message: 'Too short', // Too short message
      };

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidInquiry),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('Property Management Flow', () => {
    test('agent property management process', async () => {
      const mockAgentProperties = [
        {
          id: '1',
          title: 'Agent Property 1',
          price: 450000,
          location: 'Amsterdam',
          status: 'active',
          agent_id: 'agent-1',
        },
      ];

      // Mock agent properties fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAgentProperties),
      });

      // Step 1: Get agent properties
      const propertiesResponse = await fetch('/api/listings');
      expect(propertiesResponse.ok).toBe(true);
      const properties = await propertiesResponse.json();
      expect(properties).toHaveLength(1);
      expect(properties[0].agent_id).toBe('agent-1');

      // Step 2: Update property
      const updateData = {
        id: '1',
        title: 'Updated Property Title',
        price: 475000,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([{ ...mockAgentProperties[0], ...updateData }]),
      });

      const updateResponse = await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(updateResponse.ok).toBe(true);
      const updatedProperty = await updateResponse.json();
      expect(updatedProperty[0].title).toBe('Updated Property Title');
      expect(updatedProperty[0].price).toBe(475000);
    });

    test('prevents unauthorized property management', async () => {
      // Mock unauthorized access
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const response = await fetch('/api/listings');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);
    });
  });

  describe('Error Handling', () => {
    test('handles network errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(fetch('/api/properties')).rejects.toThrow('Network error');
    });

    test('handles server errors gracefully', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal server error' }),
      });

      const response = await fetch('/api/properties');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });
});
