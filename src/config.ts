export const APP_CONFIG: {
  OFFLINE: boolean;
  BACKEND_API_URL: string;
  APP_BASE_URL: string | undefined;
  IS_PROD: boolean;
} = {
  OFFLINE: process.env.OFFLINE == 'true',
  BACKEND_API_URL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.BACKEND_API_URL || // TODO: remove this line when everyone is synced
    'http://localhost:8000',
  APP_BASE_URL:
    process.env.APP_BASE_URL ||
    (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : undefined),
  IS_PROD: process.env.IS_PROD == 'true',
};
