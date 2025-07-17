import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'productId et quantity sont requis' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Stock insuffisant' },
        { status: 400 }
      );
    }

    // Mise à jour du stock
    product.stock -= quantity;
    await product.save();

    // Ici, vous pourriez ajouter la logique pour créer une commande
    // et gérer le paiement

    return NextResponse.json({
      status: 'success',
      message: 'Achat effectué avec succès',
      data: {
        productId,
        quantity,
        remainingStock: product.stock
      }
    });
  } catch (error) {
    console.error('Erreur lors du processus d\'achat:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Erreur lors du processus d\'achat',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
