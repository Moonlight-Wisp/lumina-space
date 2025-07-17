// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const authHeader = req.headers.get('authorization');
//
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
//
//   // Ici, on **ne valide pas** le token. La validation sera faite dans l’API `/api/auth/verifyToken`.
//   return NextResponse.next();
// }

export const config = {
  matcher: ['/api/protected/:path*'], // ajuste selon les routes protégées
};
