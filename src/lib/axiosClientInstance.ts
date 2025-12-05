'use client';

import { APP_CONFIG } from '@/config';
import axios from 'axios';

// Helper function to read cookies in client-side
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const axiosClientInstance = axios.create({
  baseURL: APP_CONFIG.BACKEND_API_URL,
});

// Client-side interceptor without Auth0 server code
axiosClientInstance.interceptors.request.use(async config => {
  if (APP_CONFIG.OFFLINE) {
    // Read from cookie to match server-side behavior
    const offlineUser = getCookie('offlineUser');
    config.headers['doctor'] = offlineUser;
    return config;
  }
  try {
    const response = await fetch('/api/auth/token');
    if (!response.ok) {
      window.location.href = '/auth/login';
      return Promise.reject('Authentication failed');
    }

    const { token } = await response.json();
    if (!token) {
      window.location.href = '/auth/login';
      return Promise.reject('No token available');
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }

  return config;
});
