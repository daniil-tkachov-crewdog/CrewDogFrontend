import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MockUser {
  id: string;
  name: string;
  email: string;
  plan: string;
}

interface AuthState {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useMockAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string) => {
        const mockUser: MockUser = {
          id: '1',
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          plan: 'Free'
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'mock-auth-storage',
    }
  )
);