import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MockUser {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Admin';
  searchesUsed: number;
}

interface AuthState {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, plan?: 'Free' | 'Pro' | 'Admin') => void;
  logout: () => void;
  incrementSearches: () => void;
  resetSearches: () => void;
}

const getQuotaForPlan = (plan: 'Free' | 'Pro' | 'Admin') => {
  switch (plan) {
    case 'Free':
      return 3;
    case 'Pro':
      return 50;
    case 'Admin':
      return Infinity;
    default:
      return 3;
  }
};

export const useMockAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, plan: 'Free' | 'Pro' | 'Admin' = 'Free') => {
        const mockUser: MockUser = {
          id: '1',
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          plan: plan,
          searchesUsed: 0
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      incrementSearches: () => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            searchesUsed: state.user.searchesUsed + 1
          }
        };
      }),
      resetSearches: () => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            searchesUsed: 0
          }
        };
      }),
    }),
    {
      name: 'mock-auth-storage',
    }
  )
);

export { getQuotaForPlan };