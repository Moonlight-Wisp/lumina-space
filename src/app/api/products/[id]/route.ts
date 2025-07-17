import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de produit invalide' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const product = await Product.findById(params.id);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
