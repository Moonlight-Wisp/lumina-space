import { create } from 'zustand';

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

export const useUserStore = create<UserState>((set) => ({
  uid: '',
  email: '',
  displayName: '',
  role: '',
  isLoggedIn: false,

  setUser: ({ uid, email, displayName, role }) =>
    set({ uid, email, displayName, role, isLoggedIn: true }),

  logout: () =>
    set({
      uid: '',
      email: '',
      displayName: '',
      role: '',
      isLoggedIn: false,
    }),
}));
