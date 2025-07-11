import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    return NextResponse.json({ uid: decoded.uid, role: decoded.role || 'client' });
  } catch {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}
