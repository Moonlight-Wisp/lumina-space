import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role: 'client' | 'vendeur';
  hashedPassword?: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: String,
    role: { type: String, enum: ['client', 'vendeur'], default: 'client' },
    hashedPassword: String,
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // crée createdAt & updatedAt
  }
);

// Utilisation sécurisée avec Next.js pour éviter les recompilations
export const User = models.User || model<IUser>('User', UserSchema);
