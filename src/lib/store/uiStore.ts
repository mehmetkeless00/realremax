'use client';

import { create } from 'zustand';

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: unknown;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage: string;

  // Modal state
  modal: ModalState;

  // Toast notifications
  toasts: Toast[];

  // Sidebar state
  sidebarOpen: boolean;

  // Theme
  theme: 'light' | 'dark';

  // Actions
  setLoading: (loading: boolean, message?: string) => void;

  // Modal actions
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isLoading: false,
  loadingMessage: '',
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  toasts: [],
  sidebarOpen: false,
  theme: 'light',

  // Loading actions
  setLoading: (loading, message = '') =>
    set({
      isLoading: loading,
      loadingMessage: message,
    }),

  // Modal actions
  openModal: (type, data) =>
    set({
      modal: {
        isOpen: true,
        type,
        data,
      },
    }),

  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        type: null,
        data: null,
      },
    }),

  // Toast actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove toast after duration
    if (newToast.duration) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  // Sidebar actions
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme actions
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  setTheme: (theme) => set({ theme }),
}));
