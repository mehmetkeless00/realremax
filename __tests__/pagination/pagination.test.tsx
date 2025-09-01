import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import Pagination from '@/components/pagination/Pagination';
import InfiniteScroll from '@/components/pagination/InfiniteScroll';
import VirtualList from '@/components/pagination/VirtualList';
import { usePagination } from '@/hooks/usePagination';

// Mock data
const mockItems = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
}));

describe('Pagination Components', () => {
  describe('Pagination Component', () => {
    const defaultProps = {
      currentPage: 1,
      totalPages: 10,
      totalItems: 100,
      itemsPerPage: 12,
      onPageChange: jest.fn(),
    };

    test('renders pagination controls', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(
        screen.getByText('Showing 1 to 12 of 100 results')
      ).toBeInTheDocument();
    });

    test('handles page navigation', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      fireEvent.click(screen.getByText('Next'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    test('disables navigation buttons appropriately', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).not.toBeDisabled();
    });

    test('shows items per page selector when enabled', () => {
      const onItemsPerPageChange = jest.fn();
      render(
        <Pagination
          {...defaultProps}
          showItemsPerPage={true}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      );

      expect(screen.getByText('Show:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    });

    test('handles items per page change', () => {
      const onItemsPerPageChange = jest.fn();
      render(
        <Pagination
          {...defaultProps}
          showItemsPerPage={true}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      );

      const select = screen.getByDisplayValue('12');
      fireEvent.change(select, { target: { value: '24' } });
      expect(onItemsPerPageChange).toHaveBeenCalledWith(24);
    });

    test('does not render when total pages is 1 or less', () => {
      const { container } = render(
        <Pagination {...defaultProps} totalPages={1} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('InfiniteScroll Component', () => {
    const defaultProps = {
      hasMore: true,
      isLoading: false,
      onLoadMore: jest.fn(),
      children: <div>Test content</div>,
    };

    test('renders children content', () => {
      render(<InfiniteScroll {...defaultProps} />);

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('shows loading indicator when loading', () => {
      render(<InfiniteScroll {...defaultProps} isLoading={true} />);

      expect(screen.getByText('Loading more...')).toBeInTheDocument();
    });

    test('shows end message when no more items', () => {
      render(<InfiniteScroll {...defaultProps} hasMore={false} />);

      expect(
        screen.getByText("You've reached the end of the list")
      ).toBeInTheDocument();
    });
  });

  describe('VirtualList Component', () => {
    const renderItem = (item: any, index: number) => (
      <div key={item.id} data-testid={`item-${index}`}>
        {item.title}
      </div>
    );

    const defaultProps = {
      items: mockItems,
      itemHeight: 50,
      containerHeight: 200,
      renderItem,
    };

    test('renders virtual list container', () => {
      const { container } = render(<VirtualList {...defaultProps} />);

      const virtualListContainer = container.firstChild as HTMLElement;
      expect(virtualListContainer).toHaveStyle({ height: '200px' });
    });

    test('renders items', () => {
      render(<VirtualList {...defaultProps} />);

      const visibleItems = screen.getAllByTestId(/^item-/);
      expect(visibleItems.length).toBeGreaterThan(0);
    });

    test('handles scroll events', () => {
      const onScroll = jest.fn();
      const { container } = render(
        <VirtualList {...defaultProps} onScroll={onScroll} />
      );

      const virtualListContainer = container.firstChild as HTMLElement;
      fireEvent.scroll(virtualListContainer);

      expect(onScroll).toHaveBeenCalled();
    });

    test('maintains correct total height', () => {
      const { container } = render(<VirtualList {...defaultProps} />);

      const virtualListContainer = container.firstChild as HTMLElement;
      const spacer = virtualListContainer.firstChild as HTMLElement;
      expect(spacer).toHaveStyle({ height: '5000px' }); // 100 items * 50px
    });
  });

  describe('usePagination Hook', () => {
    test('calculates pagination values correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 1,
          initialItemsPerPage: 10,
          totalItems: 100,
        })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(10);
      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(10);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPreviousPage).toBe(false);
    });

    test('navigates between pages', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 1,
          initialItemsPerPage: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.goToPage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.startIndex).toBe(20);
      expect(result.current.endIndex).toBe(30);
    });

    test('handles items per page change', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 1,
          initialItemsPerPage: 10,
          totalItems: 100,
        })
      );

      act(() => {
        result.current.setItemsPerPage(20);
      });

      expect(result.current.itemsPerPage).toBe(20);
      expect(result.current.currentPage).toBe(1); // Should reset to first page
      expect(result.current.totalPages).toBe(5);
    });

    test('gets page items correctly', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 2,
          initialItemsPerPage: 10,
          totalItems: 100,
        })
      );

      const testItems = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const pageItems = result.current.getPageItems(testItems);

      expect(pageItems).toHaveLength(10);
      expect(pageItems[0].id).toBe(10); // Second page starts at index 10
    });

    test('provides pagination info', () => {
      const { result } = renderHook(() =>
        usePagination({
          initialPage: 2,
          initialItemsPerPage: 10,
          totalItems: 100,
        })
      );

      expect(result.current.paginationInfo.showing).toBe('11-20');
      expect(result.current.paginationInfo.total).toBe('100');
    });
  });
});
