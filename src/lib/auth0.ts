import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: { audience: 'https://sabai.jp.auth0.com/api/v2/' },
  appBaseUrl:
    process.env.VERCEL_URL != undefined
      ? 'https://' + process.env.VERCEL_URL
      : process.env.APP_BASE_URL,
});
