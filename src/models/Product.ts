import { Schema, Document, models, model } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  sellerName: string;
  rating: number;
  deliveryDelay: number;
  deliveryInfo: string;
  returnPolicy: string;
  createdAt: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  sellerName: { type: String, required: true },
  rating: { type: Number, default: 0 },
  deliveryDelay: { type: Number, required: true },
  deliveryInfo: { type: String, required: true },
  returnPolicy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Product || model<IProduct>('Product', ProductSchema);
