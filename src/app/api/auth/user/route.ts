import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {User} from '@/models/User';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const email = searchParams.get('email');
  const displayName = searchParams.get('displayName');

  if (!uid || !email) {
    return NextResponse.json({ error: 'UID et email requis' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    let user = await User.findOne({ uid });

    // Si l'utilisateur n'existe pas, le créer
    if (!user) {
      const [firstName, lastName] = (displayName || email.split('@')[0]).split(' ');
      user = await User.create({
        uid,
        email,
        firstName: firstName || 'Utilisateur',
        lastName: lastName || '',
        displayName: displayName || '',
        role: 'client',
        verified: true
      });
      console.log('Nouvel utilisateur créé:', user);
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
