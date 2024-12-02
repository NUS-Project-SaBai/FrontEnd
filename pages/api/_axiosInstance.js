import axios from 'axios';
import { getAPI_URL } from '@/utils/constants';
import Router from 'next/router';
import { OFFLINE } from '@/utils/constants';

const axiosInstance = axios.create({
  baseURL: `${getAPI_URL()}`,
});

axiosInstance.interceptors.request.use(async config => {
  if (OFFLINE) {
    const offline_user = window.localStorage.getItem('offline_user');
    config.headers['doctor'] = offline_user;
    return config;
  }
  try {
    const token = await fetch('/api/token').then(res => {
      if (!res.ok) {
        Router.push('/api/auth/login'); // gets new token
        throw new Error(`Failed to fetch token: ${res.statusText}`);
      }
      return res.json();
    });
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
});

export default axiosInstance;
