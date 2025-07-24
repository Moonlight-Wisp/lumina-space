import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/Review';

// GET: Récupérer tous les avis d'un produit
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}) {
    try {
          const {id} = await params;
  if (!id) {
    return NextResponse.json({ error: 'productId requis' }, { status: 400 });
  }
  await connectToDatabase();
  const reviews = await Review.find({ productId:id }).sort({ createdAt: -1 });
  return NextResponse.json(reviews);
  
    } catch (error) {
        console.log(error)
        return NextResponse.json("une erreur s'est produite ")
    }
}
