import { APP_CONFIG } from '@/config';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: { audience: 'https://sabai.jp.auth0.com/api/v2/' },
  appBaseUrl: APP_CONFIG.APP_BASE_URL,
  secret: process.env.AUTH0_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});
