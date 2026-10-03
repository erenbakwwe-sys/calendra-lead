import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude auth routes and static assets
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Assuming auth is handled client side for real routes or checking cookie here
  // For standard protected route redirect if not logged in (using cookie if available)
  // In a real app we would verify a cookie token. 
  // For this exercise, we just pass through and let client handle redirect if no store.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
