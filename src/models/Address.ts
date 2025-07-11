import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAddress extends Document {
  userId: string;
  label: string;
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IAddress>({
  userId: { type: String, required: true },
  label: { type: String, required: true },
  recipient: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: String,
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Address || model<IAddress>('Address', AddressSchema);
