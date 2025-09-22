'use client';

import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import { useEffect, useState } from 'react';
import { UploadDocument } from './UploadDocument';
import { ViewDocument } from './ViewDocument';

export function PatientDocuments({ patient }: { patient: Patient }) {
  const [documents, setDocuments] = useState<Upload[]>([]);

  // Function to fetch/refresh documents
  const fetchDocuments = () => {
    getUploadByPatientId(patient.pk).then(data => {
      setDocuments(data);
    });
  };

  // Fetch documents on initial load
  useEffect(() => {
    fetchDocuments();
  }, [patient.pk]);

  return (
    <div className="flex space-x-2">
      <UploadDocument patient={patient} onUploadSuccess={fetchDocuments} />
      <ViewDocument documents={documents} />
    </div>
  );
}
