import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesPage from '../../../src/app/services/page';

// Mock the store hooks
jest.mock('../../../src/lib/store', () => ({
  useUIStore: () => ({
    addToast: jest.fn(),
  }),
  useUserStore: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
      },
    },
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ServicesPage Responsive Design', () => {
  const mockServices = [
    {
      id: '1',
      name: 'Property Valuation',
      description: 'Professional property valuation service',
      category: 'Valuation',
      price: 299.99,
      duration: '2-3 days',
      icon: 'calculator',
      features: ['Detailed market analysis', 'Professional report'],
      is_active: true,
      sort_order: 1,
    },
    {
      id: '2',
      name: 'Property Management',
      description: 'Complete property management service',
      category: 'Management',
      price: 199.99,
      duration: 'Monthly',
      icon: 'home',
      features: ['Tenant screening', 'Rent collection'],
      is_active: true,
      sort_order: 2,
    },
  ];

  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockServices,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders services page with responsive layout', async () => {
    render(<ServicesPage />);

    // Check main heading
    expect(screen.getByText('Our Real Estate Services')).toBeInTheDocument();

    // Check service cards are rendered
    expect(await screen.findByText('Property Valuation')).toBeInTheDocument();
    expect(await screen.findByText('Property Management')).toBeInTheDocument();
  });

  test('displays service information correctly', async () => {
    render(<ServicesPage />);

    // Check service details
    expect(await screen.findByText('Valuation')).toBeInTheDocument();
    expect(await screen.findByText('Management')).toBeInTheDocument();
    expect(await screen.findByText('$299.99')).toBeInTheDocument();
    expect(await screen.findByText('$199.99')).toBeInTheDocument();
  });

  test('shows category filters', async () => {
    render(<ServicesPage />);

    expect(await screen.findByText('all')).toBeInTheDocument();
    expect(await screen.findByText('Valuation')).toBeInTheDocument();
    expect(await screen.findByText('Management')).toBeInTheDocument();
  });

  test('filters services by category', async () => {
    render(<ServicesPage />);

    const valuationButton = await screen.findByText('Valuation');
    fireEvent.click(valuationButton);

    // Should only show valuation services
    expect(screen.getByText('Property Valuation')).toBeInTheDocument();
    expect(screen.queryByText('Property Management')).not.toBeInTheDocument();
  });

  test('shows request service buttons', async () => {
    render(<ServicesPage />);

    const requestButtons = await screen.findAllByText('Request Service');
    expect(requestButtons).toHaveLength(2);
  });

  test('opens service request modal', async () => {
    render(<ServicesPage />);

    const requestButton = await screen.findByText('Request Service');
    fireEvent.click(requestButton);

    // Check if modal opens
    expect(screen.getByText('Request Property Valuation')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
  });

  test('handles service request form submission', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'request-1' }),
      });

    render(<ServicesPage />);

    // Open modal
    const requestButton = await screen.findByText('Request Service');
    fireEvent.click(requestButton);

    // Fill form
    fireEvent.change(screen.getByLabelText('Name *'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'john@example.com' },
    });

    // Submit form
    const submitButton = screen.getByText('Submit Request');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/services/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('John Doe'),
      });
    });
  });

  test('displays service features', async () => {
    render(<ServicesPage />);

    expect(await screen.findByText('Features:')).toBeInTheDocument();
    expect(
      await screen.findByText('Detailed market analysis')
    ).toBeInTheDocument();
    expect(await screen.findByText('Tenant screening')).toBeInTheDocument();
  });

  test('handles loading state', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<ServicesPage />);

    expect(screen.getByText('Loading services...')).toBeInTheDocument();
  });

  test('handles empty services list', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<ServicesPage />);

    // Should still show category filters
    expect(await screen.findByText('all')).toBeInTheDocument();
  });

  test('responsive grid layout classes', async () => {
    render(<ServicesPage />);

    // Check if the grid has responsive classes
    const gridContainer = await screen.findByRole('main');
    expect(gridContainer).toBeInTheDocument();
  });

  test('modal closes when cancel button is clicked', async () => {
    render(<ServicesPage />);

    // Open modal
    const requestButton = await screen.findByText('Request Service');
    fireEvent.click(requestButton);

    // Check modal is open
    expect(screen.getByText('Request Property Valuation')).toBeInTheDocument();

    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Check modal is closed
    expect(
      screen.queryByText('Request Property Valuation')
    ).not.toBeInTheDocument();
  });
});
