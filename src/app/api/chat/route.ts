import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/chat?userId=xxx  → conversations de l'utilisateur
// GET /api/chat?conversationId=xxx  → messages d'une conversation
// POST /api/chat (body: { participants, type? }) → crée une conversation
// POST /api/chat/message (body: { conversationId, senderId, content }) → envoie un message

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const userId = req.nextUrl.searchParams.get('userId');
  const conversationId = req.nextUrl.searchParams.get('conversationId');

  if (conversationId) {
    // Récupérer les messages d'une conversation
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  }
  if (userId) {
    // Récupérer toutes les conversations de l'utilisateur
    const conversations = await Conversation.find({ participants: userId }).sort({ createdAt: -1 });
    return NextResponse.json(conversations);
  }
  return NextResponse.json({ error: 'Paramètre requis' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (body.conversationId && body.content && body.senderId) {
    // Envoi d'un message
    const message = new Message({
      conversationId: body.conversationId,
      senderId: body.senderId,
      content: body.content,
      read: false,
      createdAt: new Date(),
    });
    await message.save();

    // Générer une notification pour tous les autres participants
    try {
      const conv = await Conversation.findById(body.conversationId);
      if (conv) {
        const notifList = conv.participants
          .filter((uid: string) => uid !== body.senderId)
          .map((uid: string) => ({
            userId: uid,
            type: 'chat',
            message: 'Nouveau message reçu',
            link: `/support?conv=${conv._id}`,
            read: false,
            createdAt: new Date(),
          }));
        if (notifList.length) {
          await Notification.insertMany(notifList);
        }
      }
    } catch (e) {
      console.error('Erreur notification chat:', e);
    }
    return NextResponse.json(message, { status: 201 });
  } else if (body.participants && Array.isArray(body.participants)) {
    // Création d'une conversation
    const conversation = new Conversation({
      participants: body.participants,
      type: body.type || 'support',
      createdAt: new Date(),
    });
    await conversation.save();
    return NextResponse.json(conversation, { status: 201 });
  }
  return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
}
