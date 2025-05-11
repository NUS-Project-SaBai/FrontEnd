import { Auth0Client } from '@auth0/nextjs-auth0/server';

console.log(
  'auth0 appbase_url vercel_url ',
  process.env.APP_BASE_URL,
  process.env.VERCEL_URL
);
export const auth0 = new Auth0Client({
  authorizationParameters: { audience: 'https://sabai.jp.auth0.com/api/v2/' },
});
