import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

// Dans un vrai projet, importez votre bibliothèque de paiement ici
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, userId } = body;

    if (!items || !items.length || !userId) {
      return NextResponse.json(
        { error: 'Données de paiement invalides' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Vérifier le stock pour tous les produits
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { 
            error: `Stock insuffisant pour ${product ? product.title : 'un produit'}`,
            productId: item.productId 
          },
          { status: 400 }
        );
      }
    }

    // Calculer le total
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    // Simuler un paiement réussi
    // Dans un vrai projet, utilisez Stripe ou un autre processeur de paiement
    const paymentSuccessful = true;

    if (paymentSuccessful) {
      // Mettre à jour les stocks
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      return NextResponse.json({
        status: 'success',
        message: 'Paiement effectué avec succès',
        data: {
          orderId: Math.random().toString(36).substring(7),
          total,
          items
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Échec du paiement' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors du paiement:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Erreur lors du traitement du paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
