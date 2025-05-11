import { Auth0Client } from '@auth0/nextjs-auth0/server';

process.env.APP_BASE_URL = process.env.APP_BASE_URL || process.env.VERCEL_URL;
export const auth0 = new Auth0Client({
  authorizationParameters: { audience: 'https://sabai.jp.auth0.com/api/v2/' },
});
