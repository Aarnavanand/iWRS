import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get('token'); // Assuming token is stored in cookies

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(`${origin}/login`);
    }
  } else if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};