import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Role = 'client' | 'vendeur';

type FirebaseUser = {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
};

type UserState = {
  uid: string;
  email: string;
  displayName: string;
  role: Role | '';
  isLoggedIn: boolean;

  setUser: (user: FirebaseUser) => void;
  logout: () => void;
};

const initialState: Omit<UserState, 'setUser' | 'logout'> = {
  uid: '',
  email: '',
  displayName: '',
  role: '',
  isLoggedIn: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: ({ uid, email, displayName, role }) =>
        set({
          uid,
          email,
          displayName,
          role,
          isLoggedIn: true,
        }),

      logout: () => {
        set({ ...initialState });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-store');
        }
      },
    }),
    {
      name: 'user-store',
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
      partialize: (state) => ({
        uid: state.uid,
        email: state.email,
        displayName: state.displayName,
        role: state.role,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.isLoggedIn) {
          state.logout();
        }
      },
    }
  )
);
