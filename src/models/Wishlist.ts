import { Schema, Document, models, model } from 'mongoose';

export interface IWishlist extends Document {
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const WishlistSchema = new Schema<IWishlist>({
  userId: { type: String, required: true, unique: true },
  productIds: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Wishlist || model<IWishlist>('Wishlist', WishlistSchema);
