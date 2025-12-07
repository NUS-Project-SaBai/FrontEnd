'use server';
import { axiosInstance } from '@/lib/axiosInstance';

export async function getPdfConsult(consultId: number): Promise<Blob | null> {
  if (!consultId) return null;

  const response = await axiosInstance.get(
    `/consults/${consultId}/pdf`,
    // fix from repeated ChatGPT prompts
    {
      responseType: "arraybuffer",
      transformResponse: r => r,       // disable axios parsing
      decompress: false,               // avoid compressed transforms
      transitional: { silentJSONParsing: false, forcedJSONParsing: false },
    }
  );

  return new Blob([response.data], { type: "application/pdf" });
}

export async function getLatestPdfConsultByPatientId(
  patientId: number
): Promise<Blob |  null> {
  if (!patientId) {
    throw new Error('Invalid patient ID:' + patientId);
  }
  return axiosInstance
    .get(`/patients/${patientId}/reports/pdf/latest_consult/`)
    .then(r => {
      return new Blob([r.data], { type: 'application/pdf' });
    })
    .catch(err => {
      throw new Error(err.response.data.error);
    });
}

export async function getAllPdfConsultsByPatientId(
  patientId: number
): Promise<Blob | null> {
  if (!patientId) {
    throw new Error('Invalid patient ID:' + patientId);
  }
  return axiosInstance
    .get(`/patients/${patientId}/reports/pdf/all_consults/`)
    .then(r => {
      return new Blob([r.data], { type: 'application/pdf' })
    })
    .catch(err => {
      throw new Error(err.response.data.error);
    });
}

export async function getAllPdfConsults() : Promise<{fileBlob :Blob ,filename: string} | null> {
  return axiosInstance
    .get(`/consults/reports/pdf/all/`, {responseType:"document"})
    .then(r => {
      const filename = r.headers['content-disposition'].split('filename=')[1]?.replaceAll('"', '') || `all_patients_reports_${new Date().toISOString()}.zip`;
      console.log('Filename from header:', filename);
          return { fileBlob: new Blob([r.data], { type: 'application/zip' }), filename };
    })
    .catch(err => {
      throw new Error(err.response.data.error);
    });
  }