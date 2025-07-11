import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
  }

  const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/verifyToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!verifyResponse.ok) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const user = await verifyResponse.json();

  // Tu peux maintenant utiliser user.uid, user.role etc.
  return NextResponse.json({ message: 'Bienvenue ' + user.uid });
}
