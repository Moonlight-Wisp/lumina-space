import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IConversation extends Document {
  participants: string[]; // [uid1, uid2]
  type: 'support' | 'order' | 'custom';
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: String, required: true }],
  type: { type: String, enum: ['support', 'order', 'custom'], default: 'support' },
  createdAt: { type: Date, default: Date.now },
});

export default models.Conversation || model<IConversation>('Conversation', ConversationSchema);
