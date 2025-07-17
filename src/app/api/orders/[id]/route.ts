import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}
