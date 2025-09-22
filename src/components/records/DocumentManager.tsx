'use client';

import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import { useCallback, useEffect, useState } from 'react';
import { UploadDocument } from './UploadDocument';
import { ViewDocument } from './ViewDocument';

export function DocumentManager({ patient }: { patient: Patient }) {
  const [documents, setDocuments] = useState<Upload[]>([]);

  // Function to fetch documents
  const fetchDocuments = useCallback(() => {
    getUploadByPatientId(patient.pk).then(data => {
      setDocuments(data);
    });
  }, [patient.pk]);

  // Fetch documents on initial load
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <ViewDocument documents={documents} setDocuments={setDocuments} />
      <UploadDocument patient={patient} onUploadSuccess={fetchDocuments} />
    </div>
  );
}
