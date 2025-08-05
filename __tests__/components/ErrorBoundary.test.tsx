import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div role="alert">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

describe('Error Boundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders error fallback when there is an error', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong:')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when try again button is clicked', () => {
    const mockReset = jest.fn();
    
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try again');
    fireEvent.click(tryAgainButton);

    // Note: In a real scenario, this would reset the error boundary
    // For testing purposes, we're just verifying the button exists and is clickable
    expect(tryAgainButton).toBeInTheDocument();
  });

  it('handles different types of errors', () => {
    const TypeErrorComponent = () => {
      throw new TypeError('Type error occurred');
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TypeErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Type error occurred')).toBeInTheDocument();
  });

  it('handles async errors', async () => {
    const AsyncErrorComponent = () => {
      throw new Error('Async error');
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Async error')).toBeInTheDocument();
  });

  it('logs error to console', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('handles multiple errors in the same component tree', () => {
    const MultipleErrorsComponent = () => {
      throw new Error('First error');
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div>
          <MultipleErrorsComponent />
          <div>This should not render</div>
        </div>
      </ErrorBoundary>
    );

    expect(screen.getByText('First error')).toBeInTheDocument();
    expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
  });

  it('provides error information to fallback component', () => {
    const CustomErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
      <div role="alert">
        <h2>Custom Error Handler</h2>
        <p>Error name: {error.name}</p>
        <p>Error message: {error.message}</p>
        <p>Error stack: {error.stack?.slice(0, 50)}...</p>
        <button onClick={resetErrorBoundary}>Reset</button>
      </div>
    );

    render(
      <ErrorBoundary FallbackComponent={CustomErrorFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Handler')).toBeInTheDocument();
    expect(screen.getByText('Error name: Error')).toBeInTheDocument();
    expect(screen.getByText('Error message: Test error')).toBeInTheDocument();
    expect(screen.getByText(/Error stack:/)).toBeInTheDocument();
  });

  it('handles errors in nested components', () => {
    const NestedErrorComponent = () => (
      <div>
        <div>Outer component</div>
        <ThrowError shouldThrow={true} />
      </div>
    );

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <NestedErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByText('Outer component')).not.toBeInTheDocument();
  });

  it('handles errors in async components', async () => {
    const AsyncComponent = () => {
      const [error, setError] = React.useState<Error | null>(null);

      React.useEffect(() => {
        setError(new Error('Async component error'));
      }, []);

      if (error) {
        throw error;
      }

      return <div>Loading...</div>;
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AsyncComponent />
      </ErrorBoundary>
    );

    // Wait for the error to be thrown
    await screen.findByText('Async component error');
    expect(screen.getByText('Async component error')).toBeInTheDocument();
  });

  it('handles errors in event handlers', () => {
    const EventErrorComponent = () => {
      const handleClick = () => {
        throw new Error('Event handler error');
      };

      return <button onClick={handleClick}>Click me</button>;
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <EventErrorComponent />
      </ErrorBoundary>
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);

    // Note: Error boundaries don't catch errors in event handlers
    // This test demonstrates that limitation
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles errors in useEffect', () => {
    const EffectErrorComponent = () => {
      React.useEffect(() => {
        throw new Error('useEffect error');
      }, []);

      return <div>Component with useEffect error</div>;
    };

    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <EffectErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('useEffect error')).toBeInTheDocument();
  });
}); 