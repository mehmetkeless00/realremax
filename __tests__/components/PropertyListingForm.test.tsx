import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyListingForm from '@/components/PropertyListingForm';
import { useUIStore } from '@/lib/store';

// Mock the stores
jest.mock('@/lib/store', () => ({
  useUIStore: jest.fn(),
  useUserStore: jest.fn(() => ({
    user: { id: '1', email: 'test@example.com', role: 'agent' },
    isAuthenticated: true,
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'test-url' } })),
      })),
    },
  },
}));

describe('PropertyListingForm', () => {
  const mockAddToast = jest.fn();

  beforeEach(() => {
    (useUIStore as jest.Mock).mockReturnValue({
      addToast: mockAddToast,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<PropertyListingForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bathrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year built/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<PropertyListingForm />);

    const submitButton = screen.getByRole('button', {
      name: /create listing/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
      expect(screen.getByText(/type is required/i)).toBeInTheDocument();
    });
  });

  it('validates price format', async () => {
    render(<PropertyListingForm />);

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: 'invalid-price' } });
    fireEvent.blur(priceInput);

    await waitFor(() => {
      expect(
        screen.getByText(/price must be a valid number/i)
      ).toBeInTheDocument();
    });
  });

  it('validates minimum price', async () => {
    render(<PropertyListingForm />);

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '0' } });
    fireEvent.blur(priceInput);

    await waitFor(() => {
      expect(
        screen.getByText(/price must be greater than 0/i)
      ).toBeInTheDocument();
    });
  });

  it('validates title length', async () => {
    render(<PropertyListingForm />);

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'ab' } });
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(
        screen.getByText(/title must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('validates description length', async () => {
    render(<PropertyListingForm />);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'short' } });
    fireEvent.blur(descriptionInput);

    await waitFor(() => {
      expect(
        screen.getByText(/description must be at least 10 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('validates numeric fields', async () => {
    render(<PropertyListingForm />);

    const bedroomsInput = screen.getByLabelText(/bedrooms/i);
    const bathroomsInput = screen.getByLabelText(/bathrooms/i);
    const sizeInput = screen.getByLabelText(/size/i);

    fireEvent.change(bedroomsInput, { target: { value: 'invalid' } });
    fireEvent.change(bathroomsInput, { target: { value: 'invalid' } });
    fireEvent.change(sizeInput, { target: { value: 'invalid' } });

    fireEvent.blur(bedroomsInput);
    fireEvent.blur(bathroomsInput);
    fireEvent.blur(sizeInput);

    await waitFor(() => {
      expect(
        screen.getByText(/bedrooms must be a valid number/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/bathrooms must be a valid number/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/size must be a valid number/i)
      ).toBeInTheDocument();
    });
  });

  it('validates year built range', async () => {
    render(<PropertyListingForm />);

    const yearBuiltInput = screen.getByLabelText(/year built/i);
    fireEvent.change(yearBuiltInput, { target: { value: '1800' } });
    fireEvent.blur(yearBuiltInput);

    await waitFor(() => {
      expect(
        screen.getByText(/year built must be between 1900 and current year/i)
      ).toBeInTheDocument();
    });
  });

  it('validates postal code format', async () => {
    render(<PropertyListingForm />);

    const postalCodeInput = screen.getByLabelText(/postal code/i);
    fireEvent.change(postalCodeInput, { target: { value: 'invalid' } });
    fireEvent.blur(postalCodeInput);

    await waitFor(() => {
      expect(
        screen.getByText(/postal code must be a valid format/i)
      ).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    const mockRouter = { push: jest.fn() };
    jest
      .spyOn(require('next/navigation'), 'useRouter')
      .mockReturnValue(mockRouter);

    render(<PropertyListingForm />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Beautiful House' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'A beautiful house in a great location' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '500000' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Amsterdam' },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'house' },
    });
    fireEvent.change(screen.getByLabelText(/bedrooms/i), {
      target: { value: '3' },
    });
    fireEvent.change(screen.getByLabelText(/bathrooms/i), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText(/size/i), {
      target: { value: '150' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Amsterdam' },
    });
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '1234 AB' },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'Netherlands' },
    });

    const submitButton = screen.getByRole('button', {
      name: /create listing/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/listings');
    });
  });

  it('handles photo upload', async () => {
    render(<PropertyListingForm />);

    const fileInput = screen.getByLabelText(/photos/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });
  });

  it('validates photo file type', async () => {
    render(<PropertyListingForm />);

    const fileInput = screen.getByLabelText(/photos/i);
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/only image files are allowed/i)
      ).toBeInTheDocument();
    });
  });

  it('validates photo file size', async () => {
    render(<PropertyListingForm />);

    const fileInput = screen.getByLabelText(/photos/i);
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/file size must be less than 5MB/i)
      ).toBeInTheDocument();
    });
  });

  it('handles amenities selection', () => {
    render(<PropertyListingForm />);

    const parkingCheckbox = screen.getByLabelText(/parking/i);
    const gardenCheckbox = screen.getByLabelText(/garden/i);

    fireEvent.click(parkingCheckbox);
    fireEvent.click(gardenCheckbox);

    expect(parkingCheckbox).toBeChecked();
    expect(gardenCheckbox).toBeChecked();
  });

  it('handles listing type selection', () => {
    render(<PropertyListingForm />);

    const saleRadio = screen.getByLabelText(/sale/i);
    const rentRadio = screen.getByLabelText(/rent/i);

    fireEvent.click(rentRadio);

    expect(rentRadio).toBeChecked();
    expect(saleRadio).not.toBeChecked();
  });

  it('shows loading state during submission', async () => {
    render(<PropertyListingForm />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test House' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'A test house description' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '300000' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Amsterdam' },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'house' },
    });

    const submitButton = screen.getByRole('button', {
      name: /create listing/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/creating/i)).toBeInTheDocument();
    });
  });

  it('handles form reset', () => {
    render(<PropertyListingForm />);

    const titleInput = screen.getByLabelText(/title/i);
    const priceInput = screen.getByLabelText(/price/i);

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(priceInput, { target: { value: '300000' } });

    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    expect(titleInput).toHaveValue('');
    expect(priceInput).toHaveValue('');
  });

  it('handles form cancellation', () => {
    const mockRouter = { back: jest.fn() };
    jest
      .spyOn(require('next/navigation'), 'useRouter')
      .mockReturnValue(mockRouter);

    render(<PropertyListingForm />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });
});
