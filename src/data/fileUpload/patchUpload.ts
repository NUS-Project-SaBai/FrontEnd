'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { UploadFile } from '@/types/UploadFile';

export async function patchUpload(
  uploadId: number,
  updatedUploadData: Partial<UploadFile>
): Promise<UploadFile | null> {
  return axiosInstance
    .patch(`/files/${uploadId}/`, { ...updatedUploadData })
    .then(r => r.data);
}
