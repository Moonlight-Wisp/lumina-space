import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Review extends Document {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<Review>({
  userId: { type: String, required: true, ref: 'User' },
  productId: { type: String, required: true, ref: 'Product' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model<Review>('Review', ReviewSchema);
