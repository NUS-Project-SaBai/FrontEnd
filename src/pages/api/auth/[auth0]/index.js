// Set to VERCEL_URL or override with AUTH0_BASE_URL
process.env.AUTH0_BASE_URL =
  process.env.AUTH0_BASE_URL || process.env.VERCEL_URL;

import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth();
