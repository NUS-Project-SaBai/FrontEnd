'use server';
import { APP_CONFIG } from '@/config';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export const axiosInstance = axios.create({
  baseURL: APP_CONFIG.BACKEND_API_URL,
});
axiosInstance.interceptors.request.use(async config => {
  if (APP_CONFIG.OFFLINE) {
    const offlineUser = (await cookies()).get('offlineUser');
    config.headers['doctor'] = offlineUser;
    return config;
  }
  try {
    const auth0 = new Auth0Client({
      authorizationParameters: {
        audience: APP_CONFIG.AUTH0_AUDIENCE,
      },
      appBaseUrl: APP_CONFIG.APP_BASE_URL,
    });
    const { token } = await auth0.getAccessToken();
    if (!token) {
      redirect('/auth/login', RedirectType.push);
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
  return config;
});
