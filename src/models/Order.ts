import { Schema, Document, models, model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Order || model<IOrder>('Order', OrderSchema);
