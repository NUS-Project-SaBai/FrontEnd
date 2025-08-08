'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Upload } from '@/types/Upload';

export async function patchUploadName(
  uploadId: number,
  file_name: string
): Promise<Upload | null> {
  return axiosInstance
    .patch(`/files/upload/${uploadId}/`, { file_name })
    .then(r => r.data);
}
