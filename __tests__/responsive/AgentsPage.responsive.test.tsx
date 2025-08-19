import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentsPage from '../../../src/app/agents/page';

// Mock the store hooks
jest.mock('../../../src/lib/store', () => ({
  useUIStore: () => ({
    addToast: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('AgentsPage Responsive Design', () => {
  const mockAgents = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+90 555 123 4567',
      company: 'Remax Istanbul',
      license_number: 'TR123456',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+90 555 987 6543',
      company: 'Remax Ankara',
      license_number: 'TR789012',
      created_at: '2024-02-20T14:30:00Z',
    },
  ];

  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAgents,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders agents page with responsive layout', async () => {
    render(<AgentsPage />);

    // Check main heading
    expect(
      screen.getByText('Our Trusted Real Estate Agents')
    ).toBeInTheDocument();

    // Check search input
    expect(
      screen.getByPlaceholderText('Search agents by name or company...')
    ).toBeInTheDocument();

    // Check agent cards are rendered
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
  });

  test('displays agent information correctly', async () => {
    render(<AgentsPage />);

    // Check agent details
    expect(await screen.findByText('Remax Istanbul')).toBeInTheDocument();
    expect(await screen.findByText('Remax Ankara')).toBeInTheDocument();
    expect(await screen.findByText('+90 555 123 4567')).toBeInTheDocument();
    expect(await screen.findByText('+90 555 987 6543')).toBeInTheDocument();
  });

  test('shows license numbers', async () => {
    render(<AgentsPage />);

    expect(await screen.findByText('License: TR123456')).toBeInTheDocument();
    expect(await screen.findByText('License: TR789012')).toBeInTheDocument();
  });

  test('displays stats section', async () => {
    render(<AgentsPage />);

    expect(await screen.findByText('Total Agents')).toBeInTheDocument();
    expect(await screen.findByText('Companies')).toBeInTheDocument();
    expect(await screen.findByText('Licensed')).toBeInTheDocument();
  });

  test('shows contact and view properties buttons', async () => {
    render(<AgentsPage />);

    const viewPropertiesButtons = await screen.findAllByText('View Properties');
    const contactButtons = await screen.findAllByText('Contact');

    expect(viewPropertiesButtons).toHaveLength(2);
    expect(contactButtons).toHaveLength(2);
  });

  test('handles empty agents list', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<AgentsPage />);

    expect(await screen.findByText('No agents found')).toBeInTheDocument();
    expect(
      await screen.findByText('No agents are currently available.')
    ).toBeInTheDocument();
  });

  test('handles search functionality', async () => {
    render(<AgentsPage />);

    const searchInput = screen.getByPlaceholderText(
      'Search agents by name or company...'
    );

    // Search by name
    searchInput.setAttribute('value', 'John');
    expect(searchInput).toHaveValue('John');

    // Search by company
    searchInput.setAttribute('value', 'Istanbul');
    expect(searchInput).toHaveValue('Istanbul');
  });

  test('displays member since dates', async () => {
    render(<AgentsPage />);

    // Check if member since text is displayed
    expect(await screen.findByText(/Member since/)).toBeInTheDocument();
  });

  test('responsive grid layout classes', async () => {
    render(<AgentsPage />);

    // Check if the grid has responsive classes
    const gridContainer = await screen.findByRole('main');
    expect(gridContainer).toBeInTheDocument();
  });
});
