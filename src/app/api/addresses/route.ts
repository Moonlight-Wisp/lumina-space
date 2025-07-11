import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Address from '@/models/Address';
import { connectToDatabase } from '@/lib/mongodb';

// GET: /api/addresses?userId=xxx
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });
  const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
  return NextResponse.json(addresses);
}

// POST: ajout d'une adresse
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.userId || !body.street || !body.city || !body.country) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }
  if (body.isDefault) {
    await Address.updateMany({ userId: body.userId }, { isDefault: false });
  }
  const address = await Address.create(body);
  return NextResponse.json(address, { status: 201 });
}

// PUT: édition d'une adresse
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body._id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  if (body.isDefault) {
    await Address.updateMany({ userId: body.userId }, { isDefault: false });
  }
  const address = await Address.findByIdAndUpdate(body._id, { ...body, updatedAt: new Date() }, { new: true });
  return NextResponse.json(address);
}

// DELETE: suppression d'une adresse
export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  await Address.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
