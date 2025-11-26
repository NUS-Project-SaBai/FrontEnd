'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Upload } from '@/types/Upload';

export async function deleteUpload(uploadId: number): Promise<Upload> {
  const r = await axiosInstance.delete(`/files/${uploadId}/`);
  return r.data;
}
