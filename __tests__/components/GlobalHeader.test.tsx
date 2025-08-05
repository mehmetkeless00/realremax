import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalHeader from '@/components/GlobalHeader';
import { useUIStore } from '@/lib/store';

// Mock the stores
jest.mock('@/lib/store', () => ({
  useUIStore: jest.fn(),
  useUserStore: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    signOut: jest.fn(),
  })),
  usePropertyStore: jest.fn(() => ({
    properties: [],
    loading: false,
    fetchProperties: jest.fn(),
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('GlobalHeader', () => {
  const mockAddToast = jest.fn();

  beforeEach(() => {
    (useUIStore as jest.Mock).mockReturnValue({
      addToast: mockAddToast,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation', () => {
    render(<GlobalHeader />);

    expect(screen.getByAltText('RealRemax Logo')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('shows sign in button when user is not authenticated', () => {
    render(<GlobalHeader />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('shows user menu when user is authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    (useUserStore as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: jest.fn(),
    });

    render(<GlobalHeader />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<GlobalHeader />);

    const searchInput = screen.getByPlaceholderText('Search properties...');
    fireEvent.change(searchInput, { target: { value: 'Amsterdam' } });

    expect(searchInput).toHaveValue('Amsterdam');
  });

  it('toggles mobile menu', () => {
    render(<GlobalHeader />);

    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);

    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
  });

  it('handles navigation links', () => {
    const mockRouter = { push: jest.fn() };
    jest
      .spyOn(require('next/navigation'), 'useRouter')
      .mockReturnValue(mockRouter);

    render(<GlobalHeader />);

    const propertiesLink = screen.getByText('Properties');
    fireEvent.click(propertiesLink);

    expect(mockRouter.push).toHaveBeenCalledWith('/properties');
  });

  it('displays user profile information correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'agent' as const,
    };

    (useUserStore as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: jest.fn(),
    });

    render(<GlobalHeader />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('handles sign out functionality', async () => {
    const mockSignOut = jest.fn();
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    (useUserStore as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signOut: mockSignOut,
    });

    render(<GlobalHeader />);

    const userMenuButton = screen.getByText('test@example.com');
    fireEvent.click(userMenuButton);

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('shows loading state when fetching properties', () => {
    (usePropertyStore as jest.Mock).mockReturnValue({
      properties: [],
      loading: true,
      fetchProperties: jest.fn(),
    });

    render(<GlobalHeader />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles search form submission', async () => {
    const mockRouter = { push: jest.fn() };
    jest
      .spyOn(require('next/navigation'), 'useRouter')
      .mockReturnValue(mockRouter);

    render(<GlobalHeader />);

    const searchForm = screen.getByRole('search');
    const searchInput = screen.getByPlaceholderText('Search properties...');

    fireEvent.change(searchInput, { target: { value: 'Amsterdam' } });
    fireEvent.submit(searchForm);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        '/properties?search=Amsterdam'
      );
    });
  });
});
