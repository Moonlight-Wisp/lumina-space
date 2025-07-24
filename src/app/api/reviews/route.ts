import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';

// POST: Créer un nouvel avis
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, productId, rating, comment } = body;
  if (!userId || !productId || !rating || !comment) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }
  await connectToDatabase();
  const review = await Review.create({ userId, productId, rating, comment });
  return NextResponse.json(review, { status: 201 });
}

// PUT: Modifier un avis
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { reviewId, userId, rating, comment } = body;
  if (!reviewId || !userId) {
    return NextResponse.json({ error: 'reviewId et userId requis' }, { status: 400 });
  }
  await connectToDatabase();
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, userId },
    { rating, comment, updatedAt: new Date() },
    { new: true }
  );
  if (!review) {
    return NextResponse.json({ error: 'Avis non trouvé ou non autorisé' }, { status: 404 });
  }
  return NextResponse.json(review);
}

// DELETE: Supprimer un avis
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { reviewId, userId } = body;
  if (!reviewId || !userId) {
    return NextResponse.json({ error: 'reviewId et userId requis' }, { status: 400 });
  }
  await connectToDatabase();
  const result = await Review.deleteOne({ _id: reviewId, userId });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Avis non trouvé ou non autorisé' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
