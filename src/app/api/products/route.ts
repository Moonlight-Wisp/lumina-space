import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Product from '@/models/Product';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
 try {
   await connectToDatabase();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
 } catch (error) {
  console.log(error)
  return NextResponse.json("une erreur s'est produite")

 }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const product = new Product({ ...body });
  await product.save();
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(body._id, { ...body, updatedAt: new Date() }, { new: true });
  if (!product) return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { id } = await req.json();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
