import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toast from '@/components/Toast';

describe('Toast Component', () => {
  const mockToast = {
    id: '1',
    type: 'success' as const,
    message: 'Test message',
    duration: 5000,
  };

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders success toast correctly', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass(
      'bg-green-50',
      'border-green-200'
    );
  });

  it('renders error toast correctly', () => {
    const errorToast = { ...mockToast, type: 'error' as const };
    render(<Toast toast={errorToast} onRemove={mockOnRemove} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass(
      'bg-red-50',
      'border-red-200'
    );
  });

  it('renders warning toast correctly', () => {
    const warningToast = { ...mockToast, type: 'warning' as const };
    render(<Toast toast={warningToast} onRemove={mockOnRemove} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass(
      'bg-yellow-50',
      'border-yellow-200'
    );
  });

  it('renders info toast correctly', () => {
    const infoToast = { ...mockToast, type: 'info' as const };
    render(<Toast toast={infoToast} onRemove={mockOnRemove} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass(
      'bg-blue-50',
      'border-blue-200'
    );
  });

  it('calls onRemove when close button is clicked', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('auto-removes toast after duration', async () => {
    jest.useFakeTimers();

    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Fast-forward time
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(mockOnRemove).toHaveBeenCalledWith('1');
    });

    jest.useRealTimers();
  });

  it('shows correct icon for success toast', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    const icon = screen.getByTestId('toast-icon');
    expect(icon).toHaveClass('text-green-400');
  });

  it('shows correct icon for error toast', () => {
    const errorToast = { ...mockToast, type: 'error' as const };
    render(<Toast toast={errorToast} onRemove={mockOnRemove} />);

    const icon = screen.getByTestId('toast-icon');
    expect(icon).toHaveClass('text-red-400');
  });

  it('shows correct icon for warning toast', () => {
    const warningToast = { ...mockToast, type: 'warning' as const };
    render(<Toast toast={warningToast} onRemove={mockOnRemove} />);

    const icon = screen.getByTestId('toast-icon');
    expect(icon).toHaveClass('text-yellow-400');
  });

  it('shows correct icon for info toast', () => {
    const infoToast = { ...mockToast, type: 'info' as const };
    render(<Toast toast={infoToast} onRemove={mockOnRemove} />);

    const icon = screen.getByTestId('toast-icon');
    expect(icon).toHaveClass('text-blue-400');
  });

  it('has proper accessibility attributes', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
  });

  it('handles long messages correctly', () => {
    const longMessage =
      'This is a very long message that should be handled properly by the toast component without breaking the layout or causing any visual issues';
    const longToast = { ...mockToast, message: longMessage };

    render(<Toast toast={longToast} onRemove={mockOnRemove} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles empty message', () => {
    const emptyToast = { ...mockToast, message: '' };
    render(<Toast toast={emptyToast} onRemove={mockOnRemove} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('handles custom duration', async () => {
    jest.useFakeTimers();

    const customToast = { ...mockToast, duration: 2000 };
    render(<Toast toast={customToast} onRemove={mockOnRemove} />);

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnRemove).toHaveBeenCalledWith('1');
    });

    jest.useRealTimers();
  });

  it('prevents auto-removal when duration is 0', async () => {
    jest.useFakeTimers();

    const persistentToast = { ...mockToast, duration: 0 };
    render(<Toast toast={persistentToast} onRemove={mockOnRemove} />);

    // Fast-forward time
    jest.advanceTimersByTime(10000);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(mockOnRemove).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
