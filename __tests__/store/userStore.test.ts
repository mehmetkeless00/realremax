import { renderHook, act } from '@testing-library/react';
import { useUserStore } from '@/lib/store/userStore';

describe('UserStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useUserStore());
    act(() => {
      result.current.reset();
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.role).toBe('visitor');
  });

  it('should set user correctly', () => {
    const { result } = renderHook(() => useUserStore());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.role).toBe('registered');
  });

  it('should update user correctly', () => {
    const { result } = renderHook(() => useUserStore());
    const initialUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };
    const updatedUser = {
      id: '1',
      email: 'updated@example.com',
      role: 'agent' as const,
    };

    act(() => {
      result.current.setUser(initialUser);
    });

    act(() => {
      result.current.updateUser(updatedUser);
    });

    expect(result.current.user).toEqual(updatedUser);
    expect(result.current.role).toBe('agent');
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useUserStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set authentication state', () => {
    const { result } = renderHook(() => useUserStore());

    act(() => {
      result.current.setIsAuthenticated(true);
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.setIsAuthenticated(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set role correctly', () => {
    const { result } = renderHook(() => useUserStore());

    act(() => {
      result.current.setRole('agent');
    });

    expect(result.current.role).toBe('agent');
  });

  it('should sign out correctly', () => {
    const { result } = renderHook(() => useUserStore());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    // Set user first
    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);

    // Sign out
    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.role).toBe('visitor');
  });

  it('should reset store correctly', () => {
    const { result } = renderHook(() => useUserStore());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    // Set some state
    act(() => {
      result.current.setUser(mockUser);
      result.current.setLoading(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.role).toBe('visitor');
  });

  it('should handle role transitions correctly', () => {
    const { result } = renderHook(() => useUserStore());

    // Start as visitor
    expect(result.current.role).toBe('visitor');

    // Become registered user
    act(() => {
      result.current.setRole('registered');
    });
    expect(result.current.role).toBe('registered');

    // Become agent
    act(() => {
      result.current.setRole('agent');
    });
    expect(result.current.role).toBe('agent');

    // Back to visitor
    act(() => {
      result.current.setRole('visitor');
    });
    expect(result.current.role).toBe('visitor');
  });

  it('should handle user with different roles', () => {
    const { result } = renderHook(() => useUserStore());

    const registeredUser = {
      id: '1',
      email: 'user@example.com',
      role: 'registered' as const,
    };

    const agentUser = {
      id: '2',
      email: 'agent@example.com',
      role: 'agent' as const,
    };

    act(() => {
      result.current.setUser(registeredUser);
    });

    expect(result.current.role).toBe('registered');

    act(() => {
      result.current.setUser(agentUser);
    });

    expect(result.current.role).toBe('agent');
  });

  it('should maintain state between renders', () => {
    const { result, rerender } = renderHook(() => useUserStore());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    // Rerender
    rerender();

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.role).toBe('registered');
  });

  it('should handle partial user updates', () => {
    const { result } = renderHook(() => useUserStore());
    const initialUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    act(() => {
      result.current.setUser(initialUser);
    });

    // Update only email
    act(() => {
      result.current.updateUser({ ...initialUser, email: 'updated@example.com' });
    });

    expect(result.current.user?.email).toBe('updated@example.com');
    expect(result.current.user?.id).toBe('1');
    expect(result.current.user?.role).toBe('registered');
  });

  it('should handle null user updates', () => {
    const { result } = renderHook(() => useUserStore());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'registered' as const,
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    act(() => {
      result.current.updateUser(null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
}); 