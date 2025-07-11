export type UserRole = 'client' | 'vendeur' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
