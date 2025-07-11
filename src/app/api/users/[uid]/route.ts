import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic';

interface Params {
  uid: string;
}

interface Context {
  params: Params;
}

export async function GET(req: NextRequest, context: Context) {
  try {
    await connectToDatabase();

    const { uid } = context.params;
    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('[API GET USER]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
