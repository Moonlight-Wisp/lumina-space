export type Role = 'client' | 'vendeur';

export type UserData = {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
};
