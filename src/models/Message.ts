import  { Schema, Document, models, model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default models.Message || model<IMessage>('Message', MessageSchema);
