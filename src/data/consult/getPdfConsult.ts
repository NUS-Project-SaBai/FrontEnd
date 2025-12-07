'use server';
import { axiosInstance } from '@/lib/axiosInstance';

export async function getPdfConsult(consultId: number): Promise<Blob | null> {
  if (!consultId) return null;

  const response = await axiosInstance.get(
    `/consults/${consultId}/pdf`,
    {
      responseType: "arraybuffer",
      transformResponse: r => r,       // disable axios parsing
      decompress: false,               // avoid compressed transforms
      transitional: { silentJSONParsing: false, forcedJSONParsing: false },
    }
  );

  return new Blob([response.data], { type: "application/pdf" });
}
