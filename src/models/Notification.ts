import  { Schema, Document, models, model } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default models.Notification || model<INotification>('Notification', NotificationSchema);
