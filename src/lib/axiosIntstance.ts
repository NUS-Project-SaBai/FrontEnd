import { APP_CONFIG } from '@/config';
import axios from 'axios';
import { auth0 } from './auth0';

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
    const { token } = await auth0.getAccessToken();
    config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
  return config;
});
