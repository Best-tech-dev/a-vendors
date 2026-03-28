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
  setAuth: (token: string, user: AuthUser) => void;
  setPendingEmail: (email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingEmail: null,
      setAuth: (token, user) => set({ token, user, pendingEmail: null }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
      clearAuth: () => set({ token: null, user: null, pendingEmail: null }),
    }),
    { name: "auth-storage" },
  ),
);
