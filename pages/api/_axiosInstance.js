import axios from 'axios';
import { API_URL } from '@/utils/constants';

const axiosInstance = axios.create({
  baseURL: `${API_URL}`,
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await fetch('/api/token').then((res) => {
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
