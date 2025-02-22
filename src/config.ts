export const APP_CONFIG: {
  OFFLINE: boolean;
  BACKEND_API_URL: string;
} = {
  OFFLINE: process.env.OFFLINE == 'true',
  BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:8000',
};
