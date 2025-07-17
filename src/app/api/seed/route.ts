import { NextResponse } from 'next/server';
import { seedProducts } from '@/lib/seed';

export async function GET() {
  try {
    await seedProducts();
    return NextResponse.json({ message: 'Base de données initialisée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation de la base de données' },
      { status: 500 }
    );
  }
}
