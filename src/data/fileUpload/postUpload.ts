'use client';
// use client directive is needed to prevent the body size limit of 1MB for server actions.

import { axiosClientInstance } from '@/lib/axiosClientInstance';

export async function postUpload(formData: FormData) {
  const r = await axiosClientInstance.post('/files/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return r.data;
}
