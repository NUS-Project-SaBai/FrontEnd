import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { NextResponse, type NextRequest } from 'next/server';
import { APP_CONFIG } from './config';

export async function middleware(req: NextRequest) {
  if (!APP_CONFIG.IS_PROD && !APP_CONFIG.APP_BASE_URL)
    throw new Error('Missing APP_BASE_URL in .env');
  const auth0 = new Auth0Client({
    authorizationParameters: { audience: 'https://sabai.jp.auth0.com/api/v2/' },
    appBaseUrl: APP_CONFIG.APP_BASE_URL,
  });
  const authRes = await auth0.middleware(req);
  // authentication routes — let the middleware handle it
  if (req.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  const { origin } = new URL(req.url);
  const session = await auth0.getSession();
  const offlineUser = req.cookies.get('offlineUser');

  // if user is not authenticated, redirect them to login.
  if (APP_CONFIG.OFFLINE && offlineUser == null) {
    return NextResponse.redirect(new URL('/login', req.url));
  } else if (!APP_CONFIG.OFFLINE && !session) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }
  return authRes;
}

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
