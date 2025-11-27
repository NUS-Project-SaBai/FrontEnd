'use server';

import { axiosInstance } from '@/lib/axiosInstance';
import { Upload } from '@/types/Upload';

export async function patchUpload(
  uploadId: number,
  updatedUploadData: Partial<Upload>
): Promise<Upload | null> {
  return axiosInstance
    .patch(`/files/${uploadId}/`, { ...updatedUploadData })
    .then(r => r.data);
}
