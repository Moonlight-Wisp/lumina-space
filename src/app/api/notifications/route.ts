import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Notification from '@/models/Notification';
import { connectToDatabase } from '@/lib/mongodb';

// GET: /api/notifications?userId=xxx
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(notifications);
}

// POST: créer une notification
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.userId || !body.message || !body.type) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }
  const notif = await Notification.create(body);
  return NextResponse.json(notif, { status: 201 });
}

// PUT: marquer comme lue
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  const notif = await Notification.findByIdAndUpdate(body.id, { read: true });
  return NextResponse.json(notif);
}

// DELETE: supprimer une notification
export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  await Notification.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
