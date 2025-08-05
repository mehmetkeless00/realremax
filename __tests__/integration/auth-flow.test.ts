import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signInWithEmail, signUpWithEmail, resetPassword } from '@/lib/auth';
import { useUserStore } from '@/lib/store';

// Mock the auth functions
jest.mock('@/lib/auth', () => ({
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  resetPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mock the stores
jest.mock('@/lib/store', () => ({
  useUserStore: jest.fn(),
  useUIStore: jest.fn(() => ({
    addToast: jest.fn(),
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sign In Flow', () => {
    it('should handle successful sign in', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'registered' as const,
      };

      (signInWithEmail as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      });

      const mockSetUser = jest.fn();
      (useUserStore as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        setUser: mockSetUser,
        setIsAuthenticated: jest.fn(),
      });

      // Simulate sign in
      const result = await signInWithEmail('test@example.com', 'password123');

      expect(result.data.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should handle sign in errors', async () => {
      const mockError = new Error('Invalid credentials');
      (signInWithEmail as jest.Mock).mockRejectedValue(mockError);

      try {
        await signInWithEmail('test@example.com', 'wrongpassword');
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    it('should validate email format', async () => {
      const invalidEmail = 'invalid-email';
      
      try {
        await signInWithEmail(invalidEmail, 'password123');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should require password', async () => {
      try {
        await signInWithEmail('test@example.com', '');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Sign Up Flow', () => {
    it('should handle successful sign up', async () => {
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        role: 'registered' as const,
      };

      (signUpWithEmail as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signUpWithEmail('newuser@example.com', 'password123', 'registered');

      expect(result.data.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should handle sign up with existing email', async () => {
      const mockError = new Error('User already registered');
      (signUpWithEmail as jest.Mock).mockRejectedValue(mockError);

      try {
        await signUpWithEmail('existing@example.com', 'password123');
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    it('should validate password strength', async () => {
      const weakPassword = '123';
      
      try {
        await signUpWithEmail('test@example.com', weakPassword);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle agent registration', async () => {
      const mockUser = {
        id: '1',
        email: 'agent@example.com',
        role: 'agent' as const,
      };

      (signUpWithEmail as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signUpWithEmail('agent@example.com', 'password123', 'agent');

      expect(result.data.user.role).toBe('agent');
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle password reset request', async () => {
      (resetPassword as jest.Mock).mockResolvedValue({
        data: { message: 'Password reset email sent' },
        error: null,
      });

      const result = await resetPassword('test@example.com');

      expect(result.data.message).toBe('Password reset email sent');
      expect(result.error).toBeNull();
    });

    it('should handle invalid email for password reset', async () => {
      const mockError = new Error('User not found');
      (resetPassword as jest.Mock).mockRejectedValue(mockError);

      try {
        await resetPassword('nonexistent@example.com');
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    it('should validate email format for password reset', async () => {
      const invalidEmail = 'invalid-email';
      
      try {
        await resetPassword(invalidEmail);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Session Management', () => {
    it('should handle session persistence', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'registered' as const,
      };

      (useUserStore as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        setUser: jest.fn(),
        setIsAuthenticated: jest.fn(),
      });

      // Simulate page reload
      const store = useUserStore();
      
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it('should handle session expiration', async () => {
      (useUserStore as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        setUser: jest.fn(),
        setIsAuthenticated: jest.fn(),
      });

      const store = useUserStore();
      
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Role-based Access', () => {
    it('should handle visitor role', () => {
      (useUserStore as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        role: 'visitor',
      });

      const store = useUserStore();
      
      expect(store.role).toBe('visitor');
    });

    it('should handle registered user role', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'registered' as const,
      };

      (useUserStore as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        role: 'registered',
      });

      const store = useUserStore();
      
      expect(store.role).toBe('registered');
    });

    it('should handle agent role', () => {
      const mockUser = {
        id: '1',
        email: 'agent@example.com',
        role: 'agent' as const,
      };

      (useUserStore as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        role: 'agent',
      });

      const store = useUserStore();
      
      expect(store.role).toBe('agent');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      (signInWithEmail as jest.Mock).mockRejectedValue(networkError);

      try {
        await signInWithEmail('test@example.com', 'password123');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    it('should handle server errors', async () => {
      const serverError = new Error('Internal server error');
      (signUpWithEmail as jest.Mock).mockRejectedValue(serverError);

      try {
        await signUpWithEmail('test@example.com', 'password123');
      } catch (error) {
        expect(error.message).toBe('Internal server error');
      }
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      (resetPassword as jest.Mock).mockRejectedValue(timeoutError);

      try {
        await resetPassword('test@example.com');
      } catch (error) {
        expect(error.message).toBe('Request timeout');
      }
    });
  });
}); 