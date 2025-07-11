// src/app/api/auth/verifyToken/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    return NextResponse.json({ uid: decoded.uid, role: decoded.role || 'client' });
  } catch {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }
}
