import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  pendingEmail: string | null;
  _hasHydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  setPendingEmail: (email: string) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingEmail: null,
      _hasHydrated: false,
      setAuth: (token, user) => set({ token, user, pendingEmail: null }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
      clearAuth: () => set({ token: null, user: null, pendingEmail: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
