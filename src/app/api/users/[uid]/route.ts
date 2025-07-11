// app/api/users/[uid]/route.ts (ou pages/api/users/[uid].ts selon ton projet)

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User} from '@/models/User';

export const dynamic = 'force-dynamic'; // si t’es en app router

export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    await connectToDatabase();
    const user = await User.findOne({ uid: params.uid });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('[API GET USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}