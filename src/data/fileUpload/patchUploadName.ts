import { APP_CONFIG } from '@/config';
import { Upload } from '@/types/Upload';

export async function patchUploadName(
  id: number,
  file_name: string
): Promise<Upload> {
  const url = `${APP_CONFIG.BACKEND_API_URL}/files/upload/${id}/`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_name }),
  });
  const payload = await res.json();
  if (!res.ok) {
    // backend returns { error: "..." }
    throw new Error(payload.error || 'Rename failed');
  }
  return payload as Upload;
}
