import { NextResponse, NextRequest } from 'next/server';
import {
  withMiddlewareAuthRequired,
  getSession,
} from '@auth0/nextjs-auth0/edge';
import { APP_CONFIG } from './config';

export default withMiddlewareAuthRequired(async (req: NextRequest) => {
  const offlineUser = req.cookies.get('offlineUser');
  const res = NextResponse.next();
  const user = await getSession(req, res);
  if (APP_CONFIG.OFFLINE && offlineUser == null) {
    return NextResponse.redirect(new URL('/login', req.url));
  } else if (!APP_CONFIG.OFFLINE && !user) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }
  return res;
});

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
 * - login
 */
export const config = {
  matcher:
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)',
};
