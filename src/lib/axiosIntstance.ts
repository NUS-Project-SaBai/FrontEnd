'use server';
import { APP_CONFIG } from '@/config';
import axios from 'axios';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const axiosInstance = axios.create({
  baseURL: APP_CONFIG.BACKEND_API_URL,
});
axiosInstance.interceptors.request.use(async config => {
  if (APP_CONFIG.OFFLINE) {
    const offline_user = window.localStorage.getItem('offline_user');
    config.headers['doctor'] = offline_user;
    return config;
  }
  try {
    const auth0 = new Auth0Client({
      authorizationParameters: {
        audience: 'https://sabai.jp.auth0.com/api/v2/',
      },
      appBaseUrl: APP_CONFIG.APP_BASE_URL,
    });
    const { token } = await auth0.getAccessToken();
    config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
  return config;
});
