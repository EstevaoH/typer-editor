// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Permitir acesso às rotas compartilhadas sem autenticação
  if (request.nextUrl.pathname.startsWith('/shared/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/shared/:path*',
};