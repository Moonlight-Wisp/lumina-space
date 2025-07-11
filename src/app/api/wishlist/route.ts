import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Wishlist from '@/models/Wishlist';
import { connectToDatabase } from '@/lib/mongodb';

// GET: /api/wishlist?userId=xxx
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });
  const wishlist = await Wishlist.findOne({ userId });
  return NextResponse.json(wishlist || { userId, productIds: [] });
}

// POST: ajoute un produit à la wishlist
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { userId, productId } = await req.json();
  if (!userId || !productId) return NextResponse.json({ error: 'userId et productId requis' }, { status: 400 });
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [productId] });
  } else if (!wishlist.productIds.includes(productId)) {
    wishlist.productIds.push(productId);
    await wishlist.save();
  }
  return NextResponse.json(wishlist);
}

// DELETE: retire un produit de la wishlist
export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { userId, productId } = await req.json();
  if (!userId || !productId) return NextResponse.json({ error: 'userId et productId requis' }, { status: 400 });
  const wishlist = await Wishlist.findOne({ userId });
  if (wishlist && wishlist.productIds.includes(productId)) {
    wishlist.productIds = wishlist.productIds.filter((id: string) => id !== productId);
    await wishlist.save();
  }
  return NextResponse.json(wishlist);
}
